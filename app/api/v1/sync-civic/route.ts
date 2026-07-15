import { NextResponse } from 'next/server';
import { prisma as db } from '@/lib/prisma';
import { randomUUID } from 'crypto';
import { ciceroBiography, ciceroSocialLinks } from '@/lib/cicero-official';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const address = typeof body.address === 'string' ? body.address.trim() : '';
    if (!address) {
      return NextResponse.json({ error: 'A full address, ZIP, or ZIP+4 is required.' }, { status: 400 });
    }

    const apiKey = process.env.CICERO_API_KEY;
    let candidatesList = [];

    if (apiKey && apiKey.length > 5) {
      const url = `https://app.cicerodata.com/v3.1/official?search_loc=${encodeURIComponent(address)}&format=json&max=200&key=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Cicero API Error: ${response.status}`);
      }
      const jsonData = await response.json();
      candidatesList = jsonData.response?.results?.candidates || [];
    } else {
      return NextResponse.json({ error: 'Cicero API is not configured.' }, { status: 503 });
    }

    if (!candidatesList || candidatesList.length === 0) {
      return NextResponse.json({ error: 'No data returned from Cicero API' }, { status: 500 });
    }

    // Exclude only chambers Cicero explicitly identifies as appointed.
    const officials = (candidatesList[0].officials || []).filter(
      (o: { office?: { chamber?: { is_appointed?: boolean } } }) => o.office?.chamber?.is_appointed !== true
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
      const photoUrl = official.photo_origin_url || "";
      const biography = ciceroBiography(official.notes);
      const socialLinks = ciceroSocialLinks(official.identifiers);

      // Upsert Representative
      await db.representative.upsert({
        where: { id: repId },
        update: {
          name: name,
          office: officeTitle,
          party: official.party || "Nonpartisan",
          contactPhone: contactPhone,
          contactWebsite: contactWebsite,
          ...(photoUrl ? { photoUrl, isDemoPhoto: false } : {}),
          ...(biography ? { bio: biography } : {}),
          socialLinks: JSON.stringify(socialLinks),
          contactEmail: official.email_addresses?.[0] || null,
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
          isDemoPhoto: !photoUrl,
          photoUrl,
          bio: biography ?? `Data automatically synced from Cicero API for ${officeTitle}.`,
          socialLinks: JSON.stringify(socialLinks),
          contactEmail: official.email_addresses?.[0] || null,
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
