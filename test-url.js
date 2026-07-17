const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const x = await prisma.representative.findUnique({where: {id: 'rep-cicero-697165'}});
  if (!x) return console.log("Not found");
  console.log('URL:', x.photoUrl);
  const res = await fetch(x.photoUrl, {
    headers: {'User-Agent': 'City-of-Detroit-Voter-Education-Platform/1.0'}
  });
  console.log('Status:', res.status, 'Type:', res.headers.get('content-type'));
}

main().finally(() => prisma.$disconnect());
