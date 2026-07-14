import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { GovLevel, Party } from "@/lib/types";

interface CiceroOfficial {
  id?: number;
  sk?: number;
  first_name?: string;
  last_name?: string;
  party?: string;
  photo_origin_url?: string;
  urls?: string[];
  addresses?: { phone_1?: string }[];
  office?: {
    title?: string;
    chamber?: { is_appointed?: boolean };
    district?: { district_type?: string; label?: string };
  };
}

function normalizeParty(value?: string): Party {
  const party = value?.toLowerCase() || "";
  if (party.includes("democrat")) return "Democratic";
  if (party.includes("republican")) return "Republican";
  if (party.includes("independent")) return "Independent";
  if (party.includes("nonpartisan") || !party) return "Nonpartisan";
  return "Other";
}

function getLevel(districtType?: string): GovLevel {
  if (districtType?.startsWith("NATIONAL")) return "federal";
  if (districtType?.startsWith("STATE")) return "state";
  return "city";
}

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get("zip")?.trim();
  if (!zip || !/^\d{5}(?:-\d{4})?$/.test(zip)) {
    return NextResponse.json({ error: "A valid ZIP code is required." }, { status: 400 });
  }

  const apiKey = process.env.CICERO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Cicero API is not configured." }, { status: 503 });
  }

  const params = new URLSearchParams({
    key: apiKey,
    format: "json",
    max: "200",
    search_postal: zip,
    search_country: "US",
  });

  try {
    const response = await fetch(`https://app.cicerodata.com/v3.1/official?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(`Cicero returned HTTP ${response.status}.`);

    const payload = await response.json();
    const apiErrors = payload.response?.errors || [];
    if (apiErrors.length) throw new Error(apiErrors.join(" "));

    const officials: CiceroOfficial[] = payload.response?.results?.candidates?.[0]?.officials || [];
    const currentOfficials = officials
      .filter((official) => official.office?.chamber?.is_appointed !== true)
      .filter((official) => official.first_name || official.last_name)
      .map((official, index) => {
        const name = `${official.first_name || ""} ${official.last_name || ""}`.trim();
        const office = official.office?.title || "Elected Official";
        const sourceId = official.id || official.sk || `${name}-${office}-${index}`;
        return {
          id: `rep-cicero-${String(sourceId).toLowerCase().replace(/[^a-z0-9-]/g, "-")}`,
          name,
          office,
          level: getLevel(official.office?.district?.district_type),
          party: normalizeParty(official.party),
          jurisdiction: official.office?.district?.label || zip,
          photoUrl: official.photo_origin_url || "",
          contactWebsite: official.urls?.[0] || null,
          contactPhone: official.addresses?.[0]?.phone_1 || null,
        };
      });

    // Keep profile records current. A database failure must not hide live results.
    await Promise.allSettled(currentOfficials.map((official) =>
      prisma.representative.upsert({
        where: { id: official.id },
        update: {
          name: official.name,
          office: official.office,
          level: official.level,
          party: official.party,
          jurisdiction: official.jurisdiction,
          photoUrl: official.photoUrl || undefined,
          isDemoPhoto: official.photoUrl ? false : undefined,
          contactWebsite: official.contactWebsite,
          contactPhone: official.contactPhone,
          confidence: "verified",
        },
        create: {
          ...official,
          isDemoPhoto: !official.photoUrl,
          confidence: "verified",
          bio: `Current officeholder data retrieved from the Cicero API for ${official.office}.`,
        },
      })
    ));

    return NextResponse.json({ data: currentOfficials, meta: { count: currentOfficials.length, zip } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to retrieve current officials.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
