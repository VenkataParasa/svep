import { NextResponse } from 'next/server';
import { prisma as db } from '@/lib/prisma';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const address = body.address || 'Detroit, MI'; // Default target area

    const apiKey = process.env.CICERO_API_KEY;
    let candidatesList = [];

    if (apiKey && apiKey.length > 5) {
      const url = `https://app.cicerodata.com/v3.1/official?search_loc=${encodeURIComponent(address)}&format=json&key=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Cicero API Error: ${response.status}`);
      }
      const jsonData = await response.json();
      candidatesList = jsonData.response?.results?.candidates || [];
    } else {
      // Mock Fallback Data matching Cicero's structure
      console.log("[Mock Sync] Simulating Cicero API fetch for:", address);
      candidatesList = [
        {
          officials: [
            {
              first_name: "Mike",
              last_name: "Duggan",
              party: "Democratic Party",
              office: {
                title: "Mayor of Detroit",
                district: { district_type: "LOCAL" },
                chamber: { election_frequency: "4 years" }
              },
              addresses: [{ phone_1: "313-224-3400" }],
              urls: ["https://detroitmi.gov/government/mayors-office"]
            }
          ]
        }
      ];
    }

    if (!candidatesList || candidatesList.length === 0) {
      return NextResponse.json({ error: 'No data returned from Cicero API' }, { status: 500 });
    }

    // Filter out officials without an election frequency (appointed/non-elected)
    const officials = (candidatesList[0].officials || []).filter(
      (o: { office?: { chamber?: { election_frequency?: string } } }) => o.office?.chamber?.election_frequency !== ""
    );

    // Prepare Source Record
    const sourceId = "src-cicero-api";
    await db.source.upsert({
      where: { id: sourceId },
      update: { lastUpdated: new Date() },
      create: {
        id: sourceId,
        name: "Cicero API",
        type: "government",
        verificationStatus: "verified",
        url: "https://cicerodata.com/",
        notes: "Official representative data pipeline via Cicero API",
        lastUpdated: new Date(),
      }
    });

    const results = [];

    // Map through officials
    for (const official of officials) {
      const name = `${official.first_name} ${official.last_name}`;
      const officeTitle = official.office?.title || "Unknown Office";
      
      // Generate a deterministic ID based on name and office to prevent duplicates
      const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const repId = `rep-cicero-${normalizedName}`;
      
      let level = "city";
      const distType = official.office?.district?.district_type;
      if (distType?.startsWith("NATIONAL")) level = "federal";
      else if (distType?.startsWith("STATE")) level = "state";

      const contactPhone = official.addresses?.[0]?.phone_1 || null;
      const contactWebsite = official.urls?.[0] || null;

      // Upsert Representative
      await db.representative.upsert({
        where: { id: repId },
        update: {
          name: name,
          office: officeTitle,
          party: official.party || "Nonpartisan",
          contactPhone: contactPhone,
          contactWebsite: contactWebsite,
          confidence: "verified",
        },
        create: {
          id: repId,
          name: name,
          office: officeTitle,
          level: level,
          party: official.party || "Nonpartisan",
          jurisdiction: address,
          contactPhone: contactPhone,
          contactWebsite: contactWebsite,
          confidence: "verified",
          isDemoPhoto: true,
          photoUrl: official.photo_origin_url || "",
          bio: `Data automatically synced from Cicero API for ${officeTitle}.`
        }
      });

      // Link Source
      await db.representative.update({
        where: { id: repId },
        data: {
          sources: {
            connect: { id: sourceId }
          }
        }
      });

      // Manually handle FieldMetadata upsert since there is no unique constraint
      const existingMeta = await db.fieldMetadata.findFirst({
        where: { representativeId: repId, field: 'office' }
      });

      if (existingMeta) {
        await db.fieldMetadata.update({
          where: { id: existingMeta.id },
          data: {
            confidenceScore: 99,
            sourceId: sourceId,
            lastUpdated: new Date(),
          }
        });
      } else {
        await db.fieldMetadata.create({
          data: {
            id: randomUUID(),
            entityType: 'representative',
            entityId: repId,
            representativeId: repId,
            field: 'office',
            confidenceScore: 99,
            sourceId: sourceId,
            version: 'v3',
            lastUpdated: new Date(),
          }
        });
      }

      // Generate Audit Record
      await db.auditRecord.create({
        data: {
          id: randomUUID(),
          timestamp: new Date(),
          entityType: "representative",
          entityId: repId,
          entityLabel: name,
          stage: "Cicero Sync Job",
          status: "success",
          source: "app.cicerodata.com",
          version: "v3"
        }
      });

      results.push({ name: name, office: officeTitle, id: repId });
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${results.length} elected officials via Cicero API.`,
      data: results
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Civic Sync Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
