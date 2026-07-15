const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mockLegislation = [
  { id: 'leg-1', title: 'Affordable Housing Act 2026', billNumber: 'HB-101', status: 'In Committee', summary: 'Increases funding for affordable housing projects.', issueSlug: 'housing', sponsors: '["Rep. Smith"]', level: 'state' },
  { id: 'leg-2', title: 'Rent Control Expansion', billNumber: 'SB-202', status: 'Passed Senate', summary: 'Expands rent control limits in urban areas.', issueSlug: 'housing', sponsors: '["Sen. Jones"]', level: 'state' },
  { id: 'leg-3', title: 'Early Literacy Funding', billNumber: 'HB-303', status: 'Signed', summary: 'Provides grants for early childhood literacy programs.', issueSlug: 'education', sponsors: '["Rep. Brown"]', level: 'state' },
  { id: 'leg-4', title: 'School Infrastructure Bond', billNumber: 'SB-404', status: 'Introduced', summary: 'Authorizes bonds for school building repairs.', issueSlug: 'education', sponsors: '["Sen. Davis"]', level: 'state' },
  { id: 'leg-5', title: 'Community Policing Grant', billNumber: 'HB-505', status: 'In Committee', summary: 'Funds community-oriented policing initiatives.', issueSlug: 'public-safety', sponsors: '["Rep. Wilson"]', level: 'state' },
  { id: 'leg-6', title: 'Regional Transit Expansion', billNumber: 'SB-606', status: 'Passed House', summary: 'Expands bus routes in metro areas.', issueSlug: 'transportation', sponsors: '["Sen. Miller"]', level: 'state' },
  { id: 'leg-7', title: 'Small Business Tax Relief', billNumber: 'HB-707', status: 'Signed', summary: 'Reduces taxes for small businesses with under 50 employees.', issueSlug: 'economic-development', sponsors: '["Rep. Taylor"]', level: 'state' },
  { id: 'leg-8', title: 'Clean Water Infrastructure', billNumber: 'SB-808', status: 'In Committee', summary: 'Invests in lead pipe replacement.', issueSlug: 'environment', sponsors: '["Sen. Anderson"]', level: 'state' },
  { id: 'leg-9', title: 'Maternal Health Initiative', billNumber: 'HB-909', status: 'Introduced', summary: 'Expands Medicaid coverage for maternal care.', issueSlug: 'healthcare', sponsors: '["Rep. Thomas"]', level: 'state' },
  { id: 'leg-10', title: 'State Parks Revitalization', billNumber: 'SB-111', status: 'Passed Senate', summary: 'Funds improvements in major state parks.', issueSlug: 'parks-recreation', sponsors: '["Sen. Moore"]', level: 'state' },
  { id: 'leg-11', title: 'Property Tax Cap', billNumber: 'HB-222', status: 'In Committee', summary: 'Caps annual property tax increases at 3%.', issueSlug: 'taxation', sponsors: '["Rep. Martin"]', level: 'state' },
];

async function main() {
  console.log('Seeding mock legislation...');
  for (const leg of mockLegislation) {
    const issue = await prisma.issue.findUnique({ where: { slug: leg.issueSlug } });
    if (issue) {
      await prisma.legislation.upsert({
        where: { id: leg.id },
        update: {},
        create: {
          id: leg.id,
          title: leg.title,
          billNumber: leg.billNumber,
          status: leg.status,
          summary: leg.summary,
          sponsors: leg.sponsors,
          level: leg.level,
          relatedIssueId: issue.id
        }
      });
      console.log(`Seeded: ${leg.title}`);
    }
  }
  console.log('Done seeding legislation!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
