import { NextResponse } from 'next/server';
import { prisma as db } from '@/lib/prisma';
import { legislation as mockLegislation } from '@/data/legislation';

export async function POST(request: Request) {
  // Use request to avoid unused variable warning, even if it's not strictly needed for this mock route
  const url = new URL(request.url);
  console.log(`[Legislation Sync] Hit ${url.pathname}`);
  try {
    const apiKey = process.env.OPENSTATES_API_KEY;

    if (apiKey && apiKey.length > 5) {
      // In production with a real key, you would query OpenStates API:
      // e.g., fetch(`https://v3.openstates.org/bills?jurisdiction=Michigan&sort=updated_desc&apikey=${apiKey}`)
      return NextResponse.json({ error: "Live OpenStates API sync requires mapping real categories to issues, which is not implemented in this demo." }, { status: 501 });
    }

    // Mock Fallback: Upsert mock legislation into the database
    console.log("[Mock Legislation Sync] Upserting mock legislation");
    const results = [];

    for (const leg of mockLegislation) {
      // For each legislation, find the related Issue in DB based on slug/id.
      // We know leg.relatedIssueId corresponds to Issue.id in our seed data.
      
      const issue = await db.issue.findUnique({
        where: { id: leg.relatedIssueId }
      });

      if (!issue) {
        console.warn(`[Mock Legislation Sync] Issue not found for legislation ${leg.id}`);
        continue;
      }

      const upsertedLeg = await db.legislation.upsert({
        where: { id: leg.id },
        update: {
          status: leg.status,
          confidence: "verified",
          lastUpdated: new Date()
        },
        create: {
          id: leg.id,
          billNumber: leg.billNumber,
          title: leg.title,
          summary: leg.summary,
          status: leg.status,
          sponsors: JSON.stringify(leg.sponsors),
          level: leg.level,
          confidence: leg.confidence,
          demoDataNote: leg.demoDataNote,
          lastUpdated: leg.lastUpdated ? new Date(leg.lastUpdated) : new Date(),
          relatedIssueId: issue.id
        }
      });

      // Link sources
      if (leg.sourceIds && leg.sourceIds.length > 0) {
        await db.legislation.update({
          where: { id: upsertedLeg.id },
          data: {
            sources: {
              connect: leg.sourceIds.map(id => ({ id }))
            }
          }
        });
      }

      results.push({ id: upsertedLeg.id, title: upsertedLeg.title });
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${results.length} bills via OpenStates (Mock).`,
      data: results
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Sync Legislation Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
