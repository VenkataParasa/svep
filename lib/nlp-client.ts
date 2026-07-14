import { spawn } from 'child_process';
import path from 'path';

export interface NLPResult {
  original_length: number;
  summary_html: string;
  readability_score: number;
  requires_manual_review: boolean;
}

export async function processCivicText(text: string): Promise<NLPResult | null> {
  // Always run if called directly by a script or if Azure is explicitly set
  const platform = process.env.DEPLOYMENT_PLATFORM || 'vercel';
  
  // In a real deployed Vercel environment, Python cannot run. 
  // However, local execution (npm run dev or local scripts) is fine.
  if (platform === 'vercel' && process.env.NODE_ENV === 'production') {
    console.warn("[NLP Client] Bypassing dynamic Python execution on Vercel production.");
    return null;
  }

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
        console.error('[NLP Client] Python script failed:', errorData);
        return reject(new Error(`Python process exited with code ${code}`));
      }

      try {
        const result: NLPResult = JSON.parse(outputData.trim());
        resolve(result);
      } catch (err) {
        console.error('[NLP Client] Failed to parse JSON:', outputData);
        reject(err);
      }
    });

    // Write the raw text to standard input and close it
    pyProcess.stdin.write(text);
    pyProcess.stdin.end();
  });
}
