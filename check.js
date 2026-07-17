/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const issues = await prisma.issue.findMany();
  console.log('Issues found:', issues.length);
  
  const legislation = await prisma.legislation.findMany();
  console.log('Legislation found:', legislation.length);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
