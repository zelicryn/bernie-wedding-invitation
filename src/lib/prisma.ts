import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // If running in Vercel / AWS Lambda serverless container
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT) {
    const tmpDbPath = '/tmp/dev.db';

    if (!fs.existsSync(tmpDbPath)) {
      const sourceDb = path.join(process.cwd(), 'prisma', 'dev.db');
      if (fs.existsSync(sourceDb)) {
        try {
          fs.copyFileSync(sourceDb, tmpDbPath);
          console.log(`Copied database from ${sourceDb} to ${tmpDbPath}`);
        } catch (err) {
          console.error(`Failed to copy database from ${sourceDb} to ${tmpDbPath}:`, err);
        }
      }
    }

    return `file:${tmpDbPath}`;
  }

  // Local development
  const localDb = path.resolve(process.cwd(), 'prisma', 'dev.db');
  return `file:${localDb}`;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
