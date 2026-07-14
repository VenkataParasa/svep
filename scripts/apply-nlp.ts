import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';
import path from 'path';

const prisma = new PrismaClient();

interface NLPResult {
  original_length: number;
  summary_html: string;
  readability_score: number;
  requires_manual_review: boolean;
}

// Local duplicate of processCivicText that explicitly bypasses DEPLOYMENT_PLATFORM check
// because this script is explicitly designed for local environment preprocessing.
async function processCivicTextLocal(text: string): Promise<NLPResult> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(process.cwd(), 'nlp_service', 'pipeline.py');
    const pyProcess = spawn('python', [pythonScript]);

    let outputData = '';
    let errorData = '';

    pyProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pyProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pyProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('[Batch NLP] Python script failed:', errorData);
        return reject(new Error(`Python process exited with code ${code}`));
      }

      try {
        const result: NLPResult = JSON.parse(outputData.trim());
        resolve(result);
      } catch (err) {
        console.error('[Batch NLP] Failed to parse JSON:', outputData);
        reject(err);
      }
    });

    pyProcess.stdin.write(text);
    pyProcess.stdin.end();
  });
}

async function runBatch() {
  console.log("🚀 Starting NLP Batch Processor...");

  // 1. Legislation
  const bills = await prisma.legislation.findMany({
    where: { nlpSummaryHtml: null }
  });
  console.log(`Found ${bills.length} Legislation records to process.`);
  
  for (const bill of bills) {
    if (!bill.summary) continue;
    try {
      const result = await processCivicTextLocal(bill.summary);
      await prisma.legislation.update({
        where: { id: bill.id },
        data: {
          nlpSummaryHtml: result.summary_html,
          nlpReadabilityScore: result.readability_score,
          nlpRequiresReview: result.requires_manual_review
        }
      });
      console.log(`✅ Processed Legislation: ${bill.title}`);
    } catch (e) {
      console.error(`❌ Failed Legislation ${bill.title}:`, e);
    }
  }

  // 2. Issues
  const issues = await prisma.issue.findMany({
    where: { nlpSummaryHtml: null }
  });
  console.log(`Found ${issues.length} Issue records to process.`);

  for (const issue of issues) {
    if (!issue.plainLanguageSummary) continue;
    try {
      const result = await processCivicTextLocal(issue.plainLanguageSummary);
      
      let impactHtml = null;
      if (issue.communityImpact) {
        const impactResult = await processCivicTextLocal(issue.communityImpact);
        impactHtml = impactResult.summary_html;
      }

      await prisma.issue.update({
        where: { id: issue.id },
        data: {
          nlpSummaryHtml: result.summary_html,
          nlpReadabilityScore: result.readability_score,
          nlpRequiresReview: result.requires_manual_review,
          nlpCommunityImpactHtml: impactHtml
        }
      });
      console.log(`✅ Processed Issue: ${issue.title}`);
    } catch (e) {
      console.error(`❌ Failed Issue ${issue.title}:`, e);
    }
  }

  // 3. Representatives
  const reps = await prisma.representative.findMany({
    where: { nlpBioHtml: null }
  });
  console.log(`Found ${reps.length} Representative records to process.`);

  for (const rep of reps) {
    if (!rep.bio) continue;
    try {
      const result = await processCivicTextLocal(rep.bio);
      await prisma.representative.update({
        where: { id: rep.id },
        data: {
          nlpBioHtml: result.summary_html,
          nlpReadabilityScore: result.readability_score,
          nlpRequiresReview: result.requires_manual_review
        }
      });
      console.log(`✅ Processed Representative: ${rep.name}`);
    } catch (e) {
      console.error(`❌ Failed Representative ${rep.name}:`, e);
    }
  }

  console.log("🎉 NLP Batch Processing Complete!");
}

runBatch()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
