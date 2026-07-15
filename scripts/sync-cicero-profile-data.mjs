import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const baseUrl = "https://app.cicerodata.com/v3.1/official";

function biography(notes) {
  return notes?.map((note) => note?.trim()).find((note) => note?.length >= 40) ?? null;
}

function socialLinks(identifiers = []) {
  const links = new Map();
  for (const identifier of identifiers) {
    const type = identifier.identifier_type?.toUpperCase() ?? "";
    const raw = identifier.identifier_value?.trim();
    if (!raw) continue;
    const handle = raw.replace(/^@/, "");
    let label;
    let url;
    if (type.includes("FACEBOOK")) [label, url] = ["Facebook", raw.startsWith("http") ? raw : `https://www.facebook.com/${handle}`];
    else if (type === "TWITTER" || type === "X") [label, url] = ["X / Twitter", raw.startsWith("http") ? raw : `https://x.com/${handle}`];
    else if (type.includes("INSTAGRAM")) [label, url] = ["Instagram", raw.startsWith("http") ? raw : `https://www.instagram.com/${handle}`];
    else if (type === "LINKEDIN") [label, url] = ["LinkedIn", raw.startsWith("http") ? raw : `https://www.linkedin.com/in/${handle}`];
    else if (type === "YOUTUBE") [label, url] = ["YouTube", raw.startsWith("http") ? raw : `https://www.youtube.com/@${handle}`];
    if (label && !links.has(label)) links.set(label, { label, url });
  }
  return [...links.values()];
}

try {
  const key = process.env.CICERO_API_KEY;
  if (!key) throw new Error("CICERO_API_KEY is not configured.");
  const lookups = await prisma.locationLookup.findMany({ select: { input: true } });
  const inputs = [...new Set(lookups.map(({ input }) => input).filter(Boolean))];
  await prisma.source.upsert({
    where: { id: "src-cicero-api" },
    update: { lastUpdated: new Date() },
    create: {
      id: "src-cicero-api",
      name: "Cicero API",
      type: "government",
      url: "https://www.cicerodata.com/",
      verificationStatus: "verified",
      notes: "Current officeholder biographies, contact information, and social identifiers.",
    },
  });

  let updated = 0;
  for (const input of inputs) {
    const params = new URLSearchParams({ key, format: "json", max: "200" });
    if (/^\d{5}(?:-?\d{4})?$/.test(input)) {
      params.set("search_postal", input);
      params.set("search_country", "US");
    } else {
      params.set("search_loc", input);
      params.set("search_country", "US");
    }
    const response = await fetch(`${baseUrl}?${params}`, {
      headers: { "User-Agent": "SVEP civic-information application/1.0" },
    });
    if (!response.ok) throw new Error(`Cicero returned HTTP ${response.status} for ${input}`);
    const payload = await response.json();
    const officials = payload.response?.results?.candidates?.[0]?.officials ?? [];
    for (const official of officials) {
      const name = `${official.first_name ?? ""} ${official.last_name ?? ""}`.trim();
      if (!name) continue;
      const ids = [official.id, official.sk].filter(Boolean).map((id) => `rep-cicero-${id}`);
      const records = await prisma.representative.findMany({
        where: { OR: [{ id: { in: ids } }, { name }] },
        select: { id: true },
      });
      const bio = biography(official.notes);
      const socials = socialLinks(official.identifiers);
      for (const record of records) {
        await prisma.representative.update({
          where: { id: record.id },
          data: {
            ...(bio ? { bio } : {}),
            socialLinks: JSON.stringify(socials),
            contactWebsite: official.urls?.[0] ?? undefined,
            contactPhone: official.addresses?.[0]?.phone_1 ?? undefined,
            contactEmail: official.email_addresses?.[0] ?? undefined,
            sources: { connect: { id: "src-cicero-api" } },
          },
        });
        if (bio) {
          const metadata = await prisma.fieldMetadata.findFirst({
            where: { representativeId: record.id, field: "bio" },
          });
          const data = {
            entityType: "Representative",
            entityId: record.id,
            field: "bio",
            confidenceScore: 95,
            version: "cicero-live",
            sourceId: "src-cicero-api",
            representativeId: record.id,
            lastUpdated: new Date(),
          };
          if (metadata) await prisma.fieldMetadata.update({ where: { id: metadata.id }, data });
          else await prisma.fieldMetadata.create({ data });
        }
        updated += 1;
      }
    }
  }
  console.log(`Updated ${updated} cached representative profile records from ${inputs.length} location queries.`);
} finally {
  await prisma.$disconnect();
}
