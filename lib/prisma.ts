import { PrismaClient } from '@prisma/client';
import { injectChaos, isChaosMonkeyEnabled } from './chaos-monkey';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const client = new PrismaClient();
  
  if (isChaosMonkeyEnabled()) {
    return client.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            await injectChaos(`Prisma: ${model}.${operation}`);
            return query(args);
          },
        },
      },
    }) as unknown as PrismaClient; // Cast to satisfy standard Prisma exports across the app
  }
  
  return client;
};

export const prisma =
  globalForPrisma.prisma ||
  createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
