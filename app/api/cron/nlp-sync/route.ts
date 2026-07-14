import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { processCivicText } from '@/lib/nlp-client';

export const maxDuration = 300; // Allow maximum 5 minutes for cron execution

export async function GET(request: Request) {
  // Security Check (if CRON_SECRET is configured)
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let processedCount = 0;

    // 1. Process Legislation
    const bills = await prisma.legislation.findMany({
      where: { nlpSummaryHtml: null }, // Only process records without NLP summaries
      take: 20 // Process in batches to avoid timeouts
    });
    
    for (const bill of bills) {
      if (!bill.summary) continue;
      const result = await processCivicText(bill.summary);
      if (result) {
        await prisma.legislation.update({
          where: { id: bill.id },
          data: {
            nlpSummaryHtml: result.summary_html,
            nlpReadabilityScore: result.readability_score,
            nlpRequiresReview: result.requires_manual_review
          }
        });
        processedCount++;
      }
    }

    // 2. Process Issues (plainLanguageSummary)
    const issues = await prisma.issue.findMany({
      where: { nlpSummaryHtml: null },
      take: 20
    });

    for (const issue of issues) {
      if (!issue.plainLanguageSummary) continue;
      const result = await processCivicText(issue.plainLanguageSummary);
      if (result) {
        // Also run communityImpact if we have it
        let impactResult = null;
        if (issue.communityImpact) {
          impactResult = await processCivicText(issue.communityImpact);
        }

        await prisma.issue.update({
          where: { id: issue.id },
          data: {
            nlpSummaryHtml: result.summary_html,
            nlpReadabilityScore: result.readability_score,
            nlpRequiresReview: result.requires_manual_review,
            nlpCommunityImpactHtml: impactResult ? impactResult.summary_html : null
          }
        });
        processedCount++;
      }
    }

    // 3. Process Representatives (bio)
    const reps = await prisma.representative.findMany({
      where: { nlpBioHtml: null },
      take: 20
    });

    for (const rep of reps) {
      if (!rep.bio) continue;
      const result = await processCivicText(rep.bio);
      if (result) {
        await prisma.representative.update({
          where: { id: rep.id },
          data: {
            nlpBioHtml: result.summary_html,
            nlpReadabilityScore: result.readability_score,
            nlpRequiresReview: result.requires_manual_review
          }
        });
        processedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed_records: processedCount,
      message: 'CRON NLP sync completed.' 
    });

  } catch (error) {
    console.error('[CRON NLP] Error during processing:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
