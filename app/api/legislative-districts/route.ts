import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { ciceroBiography, ciceroSocialLinks } from "@/lib/cicero-official";
import {
  findWikipediaPortrait,
  wikipediaSourceId,
  type WikipediaPhoto,
} from "@/lib/wikipedia-photo";

const CICERO_BASE_URL = "https://app.cicerodata.com/v3.1";

type CiceroDistrict = {
  id?: number;
  district_type?: string;
  district_id?: string;
  label?: string;
  subtype?: string;
  state?: string;
  city?: string;
  country?: string;
  valid_from?: string;
  valid_to?: string | null;
};

type CiceroCandidate = {
  score?: number;
  partial_match?: boolean;
  match_addr?: string;
  match_streetaddr?: string;
  match_city?: string;
  match_subregion?: string;
  match_region?: string;
  match_postal?: string;
  match_country?: string;
  x?: number;
  y?: number;
  districts?: CiceroDistrict[];
};

type CiceroOfficial = {
  id?: number;
  sk?: number;
  first_name?: string;
  last_name?: string;
  party?: string;
  photo_origin_url?: string;
  urls?: string[];
  notes?: Array<string | null>;
  identifiers?: Array<{
    identifier_type?: string;
    identifier_value?: string;
  }>;
  addresses?: Array<{ phone_1?: string }>;
  email_addresses?: string[];
  office?: {
    title?: string;
    chamber?: { is_appointed?: boolean; election_frequency?: string };
    district?: {
      id?: number;
      district_type?: string;
      district_id?: string;
    };
  };
};

function representativeId(official: CiceroOfficial) {
  const sourceId = official.id ?? official.sk;
  return sourceId ? `rep-cicero-${sourceId}` : null;
}

function governmentLevel(type?: string) {
  if (type?.startsWith("NATIONAL")) return "federal";
  if (type?.startsWith("STATE")) return "state";
  return "city";
}

function normalizedParty(value?: string) {
  const party = value?.toLowerCase() ?? "";
  if (party.includes("democrat")) return "Democratic";
  if (party.includes("republican")) return "Republican";
  if (party.includes("independent")) return "Independent";
  if (party.includes("nonpartisan") || !party) return "Nonpartisan";
  return "Other";
}

function isCoordinate(value: string | null, min: number, max: number) {
  if (value === null || value.trim() === "") return false;
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max;
}

export async function GET(request: NextRequest) {
  const location = request.nextUrl.searchParams.get("location")?.trim();
  const lat = request.nextUrl.searchParams.get("lat");
  const lon = request.nextUrl.searchParams.get("lon");
  const hasCoordinates =
    isCoordinate(lat, -90, 90) && isCoordinate(lon, -180, 180);

  if (!location && !hasCoordinates) {
    return NextResponse.json(
      { error: "Enter an address or ZIP code, or share your location." },
      { status: 400 },
    );
  }

  const precision = hasCoordinates
    ? "coordinates"
    : /^\d{5}(?:-?\d{4})?$/.test(location!)
      ? "postal"
      : "address";
  const normalizedInput = hasCoordinates
    ? `${Number(lat).toFixed(6)},${Number(lon).toFixed(6)}`
    : location!.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const cacheKey = createHash("sha256")
    .update(`${precision}:${normalizedInput}`)
    .digest("hex");

  const cachedLookup = await prisma.locationLookup
    .findUnique({ where: { cacheKey } })
    .catch(() => null);
  if (cachedLookup && cachedLookup.expiresAt > new Date()) {
    try {
      const cached = JSON.parse(cachedLookup.payload);
      return NextResponse.json({
        ...cached,
        meta: { ...cached.meta, cache: "database" },
      });
    } catch {
      // Ignore invalid legacy cache data and refresh it from Cicero.
    }
  }

  const apiKey = process.env.CICERO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Cicero is not configured on this server." },
      { status: 503 },
    );
  }

  const params = new URLSearchParams({
    key: apiKey,
    format: "json",
    max: "200",
  });

  if (hasCoordinates) {
    params.set("lat", lat!);
    params.set("lon", lon!);
  } else if (/^\d{5}(?:-?\d{4})?$/.test(location!)) {
    params.set("search_postal", location!);
    params.set("search_country", "US");
  } else {
    params.set("search_loc", location!);
    params.set("search_country", "US");
  }

  try {
    const [districtResponse, officialResponse] = await Promise.all([
      fetch(`${CICERO_BASE_URL}/legislative_district?${params.toString()}`, {
        next: { revalidate: 60 * 60 },
      }),
      fetch(`${CICERO_BASE_URL}/official?${params.toString()}`, {
        next: { revalidate: 60 * 60 },
      }),
    ]);
    const [payload, officialPayload] = await Promise.all([
      districtResponse.json(),
      officialResponse.json(),
    ]);

    if (!districtResponse.ok || !officialResponse.ok) {
      throw new Error(
        `Cicero returned HTTP ${districtResponse.status}/${officialResponse.status}.`,
      );
    }

    const errors = payload.response?.errors ?? [];
    if (errors.length > 0) {
      const message = errors
        .map((error: string | { message?: string }) =>
          typeof error === "string" ? error : error.message,
        )
        .filter(Boolean)
        .join(" ");
      return NextResponse.json(
        { error: message || "Cicero could not resolve that location." },
        { status: 400 },
      );
    }

    const candidates: CiceroCandidate[] =
      payload.response?.results?.candidates ?? [];
    const candidate = candidates[0];
    if (!candidate) {
      return NextResponse.json(
        { error: "No jurisdiction match was found for that location." },
        { status: 404 },
      );
    }

    const officialErrors = officialPayload.response?.errors ?? [];
    if (officialErrors.length > 0) {
      throw new Error(
        officialErrors
          .map((error: string | { message?: string }) =>
            typeof error === "string" ? error : error.message,
          )
          .filter(Boolean)
          .join(" "),
      );
    }

    const officials: CiceroOfficial[] =
      officialPayload.response?.results?.candidates?.[0]?.officials ?? [];
    const electedOfficials = officials.filter(
      (official) =>
        official.office?.chamber?.is_appointed !== true &&
        official.office?.chamber?.election_frequency !== "" &&
        Boolean(official.first_name || official.last_name),
    );
    const officialIds = electedOfficials
      .map(representativeId)
      .filter((id): id is string => Boolean(id));
    const storedRepresentatives = await prisma.representative
      .findMany({
        where: { id: { in: officialIds } },
        select: { id: true, photoUrl: true },
      })
      .catch(() => []);
    const storedPhotoById = new Map(
      storedRepresentatives.map((representative) => [
        representative.id,
        representative.photoUrl,
      ]),
    );

    const stateOfficialNames = [
      ...new Set(
        electedOfficials
          .filter((official) =>
            official.office?.district?.district_type?.startsWith("STATE"),
          )
          .map((official) =>
            `${official.first_name ?? ""} ${official.last_name ?? ""}`.trim(),
          )
          .filter(Boolean),
      ),
    ].filter((name) => {
      const matchingOfficial = electedOfficials.find(
        (official) =>
          `${official.first_name ?? ""} ${official.last_name ?? ""}`.trim() === name,
      );
      const id = matchingOfficial ? representativeId(matchingOfficial) : null;
      return !(
        id && storedPhotoById.get(id)?.includes("upload.wikimedia.org")
      );
    });
    const wikipediaPhotos = new Map<string, WikipediaPhoto>();
    for (const name of stateOfficialNames) {
      try {
        const portrait = await findWikipediaPortrait(name);
        if (portrait) wikipediaPhotos.set(name, portrait);
      } catch {
        // A portrait lookup must never prevent Cicero jurisdiction results.
      }
    }

    const persistedOfficials = electedOfficials.map((official) => {
      const id = representativeId(official);
      const name = `${official.first_name ?? ""} ${official.last_name ?? ""}`.trim();
      const wikipediaPhoto = wikipediaPhotos.get(name) ?? null;
      const ciceroPhotoUrl = official.photo_origin_url?.trim() || null;
      return {
        official,
        id,
        wikipediaPhoto,
        photoUrl:
          wikipediaPhoto?.imageUrl ||
          (id ? storedPhotoById.get(id) : null) ||
          ciceroPhotoUrl ||
          null,
      };
    });

    await Promise.allSettled(
      [...wikipediaPhotos.entries()].map(([name, portrait]) =>
        prisma.source.upsert({
          where: { id: wikipediaSourceId(name) },
          update: {
            name: `Wikipedia — ${portrait.pageTitle}`,
            url: portrait.pageUrl,
            lastUpdated: new Date(),
          },
          create: {
            id: wikipediaSourceId(name),
            name: `Wikipedia — ${portrait.pageTitle}`,
            type: "nonprofit",
            url: portrait.pageUrl,
            verificationStatus: "verified",
            notes: "Source page for the Wikimedia-hosted representative portrait.",
          },
        }),
      ),
    );

    // Persist current Cicero records without allowing a database failure to
    // prevent the live jurisdiction result from being displayed.
    await Promise.allSettled(
      persistedOfficials.flatMap(({ official, id, photoUrl, wikipediaPhoto }) => {
        if (!id) return [];
        const name = `${official.first_name ?? ""} ${official.last_name ?? ""}`.trim();
        const district = official.office?.district;
        const biography = ciceroBiography(official.notes);
        const socialLinks = ciceroSocialLinks(official.identifiers);
        const sourceId = wikipediaPhoto ? wikipediaSourceId(name) : null;
        return [
          prisma.representative.upsert({
            where: { id },
            update: {
              name,
              office: official.office?.title ?? "Elected official",
              level: governmentLevel(district?.district_type),
              party: normalizedParty(official.party),
              jurisdiction: district?.district_id ?? "",
              district: district?.district_id ?? null,
              ...(photoUrl ? { photoUrl, isDemoPhoto: false } : {}),
              contactWebsite: official.urls?.[0] ?? null,
              contactPhone: official.addresses?.[0]?.phone_1 ?? null,
              contactEmail: official.email_addresses?.[0] ?? null,
              ...(biography ? { bio: biography } : {}),
              socialLinks: JSON.stringify(socialLinks),
              confidence: "verified",
              ...(sourceId ? { sources: { connect: { id: sourceId } } } : {}),
            },
            create: {
              id,
              name,
              office: official.office?.title ?? "Elected official",
              level: governmentLevel(district?.district_type),
              party: normalizedParty(official.party),
              jurisdiction: district?.district_id ?? "",
              district: district?.district_id ?? null,
              photoUrl,
              isDemoPhoto: !photoUrl,
              contactWebsite: official.urls?.[0] ?? null,
              contactPhone: official.addresses?.[0]?.phone_1 ?? null,
              contactEmail: official.email_addresses?.[0] ?? null,
              confidence: "verified",
              bio:
                biography ??
                `Current officeholder data retrieved from the Cicero API for ${official.office?.title ?? "this office"}.`,
              socialLinks: JSON.stringify(socialLinks),
              ...(sourceId ? { sources: { connect: { id: sourceId } } } : {}),
            },
          }),
        ];
      }),
    );

    const responseBody = {
      data: {
        query: hasCoordinates
          ? { type: "coordinates", lat: Number(lat), lon: Number(lon) }
          : { type: "text", value: location },
        match: {
          formattedAddress: candidate.match_addr ?? location ?? "Current location",
          streetAddress: candidate.match_streetaddr ?? "",
          city: candidate.match_city ?? "",
          county: candidate.match_subregion ?? "",
          state: candidate.match_region ?? "",
          postalCode: candidate.match_postal ?? "",
          country: candidate.match_country ?? "US",
          latitude: candidate.y ?? (hasCoordinates ? Number(lat) : null),
          longitude: candidate.x ?? (hasCoordinates ? Number(lon) : null),
          score: candidate.score ?? null,
          partialMatch: candidate.partial_match ?? false,
        },
        districts: (candidate.districts ?? []).map((district) => {
          const districtOfficials = persistedOfficials
            .filter(({ official }) => {
              const officialDistrict = official.office?.district;
              if (district.id && officialDistrict?.id) {
                return district.id === officialDistrict.id;
              }
              return (
                district.district_type === officialDistrict?.district_type &&
                district.district_id === officialDistrict?.district_id
              );
            })
            .map(({ official, id, photoUrl }) => ({
              id,
              name: `${official.first_name ?? ""} ${official.last_name ?? ""}`.trim(),
              title: official.office?.title ?? "Elected official",
              party: official.party || "Nonpartisan/Unknown",
              photoUrl: photoUrl && id ? `/api/representative-photo/${id}` : "",
              website: official.urls?.[0] ?? null,
            }));

          return {
            mapId: district.id ?? null,
            type: district.district_type ?? "UNKNOWN",
            districtId: district.district_id ?? "",
            label: district.label ?? district.district_id ?? "Unnamed district",
            subtype: district.subtype ?? null,
            state: district.state ?? null,
            city: district.city ?? null,
            country: district.country ?? null,
            validFrom: district.valid_from ?? null,
            validTo: district.valid_to ?? null,
            officialCount: districtOfficials.length,
            officials: districtOfficials,
          };
        }),
        alternativeMatches: Math.max(0, candidates.length - 1),
      },
      meta: {
        source: "Cicero legislative_district and official",
        cachedForSeconds: 3600,
        cache: "cicero",
      },
    };

    await prisma.locationLookup.upsert({
      where: { cacheKey },
      update: {
        input: location ?? normalizedInput,
        normalizedAddress: candidate.match_addr ?? null,
        latitude: candidate.y ?? (hasCoordinates ? Number(lat) : null),
        longitude: candidate.x ?? (hasCoordinates ? Number(lon) : null),
        postalCode: candidate.match_postal ?? null,
        precision,
        payload: JSON.stringify(responseBody),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
      create: {
        cacheKey,
        input: location ?? normalizedInput,
        normalizedAddress: candidate.match_addr ?? null,
        latitude: candidate.y ?? (hasCoordinates ? Number(lat) : null),
        longitude: candidate.x ?? (hasCoordinates ? Number(lon) : null),
        postalCode: candidate.match_postal ?? null,
        precision,
        payload: JSON.stringify(responseBody),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error("Cicero legislative district lookup failed:", error);
    return NextResponse.json(
      { error: "The jurisdiction service is temporarily unavailable." },
      { status: 502 },
    );
  }
}
