import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

// Default to the relative path for local development
let dbUrl = process.env.DATABASE_URL || 'file:./dev.db';

// Vercel Serverless Functions have a read-only filesystem except for /tmp
// SQLite requires write access even for reads (to create lock/WAL files)
if (process.env.VERCEL || process.env.VERCEL_ENV) {
  const tmpDbPath = '/tmp/dev.db';
  const originalDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  
  try {
    let shouldCopy = true;
    if (fs.existsSync(tmpDbPath) && fs.existsSync(originalDbPath)) {
      const tmpStat = fs.statSync(tmpDbPath);
      const origStat = fs.statSync(originalDbPath);
      if (tmpStat.size === origStat.size) {
        shouldCopy = false;
      }
    }

    if (shouldCopy && fs.existsSync(originalDbPath)) {
      fs.copyFileSync(originalDbPath, tmpDbPath);
      console.log('Successfully copied SQLite DB to /tmp for Vercel execution.');
    }
    
    // Only use the /tmp path if the file is actually there
    if (fs.existsSync(tmpDbPath)) {
      dbUrl = `file:${tmpDbPath}`;
    }
  } catch (error) {
    console.error('Failed to copy SQLite database to /tmp', error);
  }
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
