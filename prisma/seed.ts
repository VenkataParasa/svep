import { PrismaClient } from '@prisma/client';
import { sources } from '../data/sources';
import { issues } from '../data/issues';
import { representativeIssuePositions } from '../data/representative-issue-positions';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // 1. Seed Sources
  for (const source of sources) {
    await prisma.source.upsert({
      where: { id: source.id },
      update: {},
      create: {
        id: source.id,
        name: source.name,
        type: source.type,
        url: source.url,
        verificationStatus: source.verificationStatus,
        lastUpdated: new Date(source.lastUpdated),
        notes: source.notes,
      },
    });
  }
  
  // 2. Representatives are populated dynamically from Cicero lookups.

  // 3. Seed Field Metadata for dynamically stored records when sources exist.
  // We'll map the metadata records from metadata.ts to specific fields if possible.
  // We'll attach a metadata record to every representative's bio for demonstration.
  await prisma.fieldMetadata.deleteMany();
  const allReps = await prisma.representative.findMany();
  
  for (const rep of allReps) {
    // Find a source connected to this rep, or default to a dummy if none
    const repSources = await prisma.source.findMany({
      where: { representatives: { some: { id: rep.id } } }
    });
    
    if (repSources.length > 0) {
      const source = repSources[0];
      await prisma.fieldMetadata.create({
        data: {
          entityType: 'Representative',
          entityId: rep.id,
          field: 'bio',
          confidenceScore: 99,
          version: 'v1.6.2',
          lastUpdated: new Date('2026-06-01'),
          sourceId: source.id,
          representativeId: rep.id,
        }
      });
    }
  }

  // 4. Seed Issues
  for (const issue of issues) {
    await prisma.issue.upsert({
      where: { slug: issue.slug },
      update: {},
      create: {
        id: issue.id,
        slug: issue.slug,
        title: issue.title,
        icon: issue.icon,
        summary: issue.summary,
        plainLanguageSummary: issue.plainLanguageSummary,
        communityImpact: issue.communityImpact,
        status: issue.status,
        confidence: issue.confidence,
        demoDataNote: issue.demoDataNote,
        lastUpdated: new Date(issue.lastUpdated),
        departments: {
          create: issue.relatedDepartments.map(dep => ({
            name: dep.name,
            url: dep.url
          }))
        },
        publicDocuments: {
          create: issue.publicDocuments.map(doc => ({
            title: doc.title,
            type: doc.type,
            url: doc.url,
            date: doc.date
          }))
        },
        sources: {
          connect: issue.sourceIds.map(id => ({ id }))
        }
      }
    });
  }

  // 5. Seed sourced issue positions for current officeholders. Representative
  // rows are created dynamically from live Cicero lookups, so ids aren't
  // known ahead of time — match by name instead, and apply to every
  // matching row so the data attaches regardless of which Cicero-derived id
  // is currently live.
  for (const entry of representativeIssuePositions) {
    const matchedReps = await prisma.representative.findMany({
      where: { name: { in: entry.matchNames } },
    });
    const issueIds = entry.positions.map((position) => position.issueId);
    const fields = entry.positions.map((position) => `issuePosition_${position.issueId}`);

    for (const rep of matchedReps) {
      await prisma.issuePosition.deleteMany({
        where: { representativeId: rep.id, issueId: { in: issueIds } },
      });
      await prisma.fieldMetadata.deleteMany({
        where: { representativeId: rep.id, field: { in: fields } },
      });

      for (const position of entry.positions) {
        await prisma.issuePosition.create({
          data: {
            issueId: position.issueId,
            summary: position.summary,
            representativeId: rep.id,
          },
        });
        await prisma.fieldMetadata.create({
          data: {
            entityType: 'Representative',
            entityId: rep.id,
            field: `issuePosition_${position.issueId}`,
            confidenceScore: position.confidenceScore,
            version: 'v1.6.2',
            lastUpdated: new Date(position.lastUpdated),
            sourceId: position.sourceId,
            representativeId: rep.id,
          },
        });
      }
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
