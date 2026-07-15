import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API = "https://en.wikipedia.org/w/api.php";

const normalize = (value) =>
  value.normalize("NFKD").replace(/[^a-zA-Z0-9]+/g, " ").trim().toLowerCase();
const sourceId = (name) => `src-wikipedia-photo-${normalize(name).replace(/\s+/g, "-")}`;

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function query(params, attempt = 0) {
  Object.entries({
    action: "query",
    format: "json",
    formatversion: "2",
    origin: "*",
    prop: "pageimages|info",
    piprop: "original|thumbnail",
    pithumbsize: "800",
    inprop: "url",
  }).forEach(([key, value]) => params.set(key, value));
  const response = await fetch(`${API}?${params}`, {
    headers: { "User-Agent": "SVEP civic-information application/1.0" },
  });
  if (response.status === 429 && attempt < 3) {
    await wait(2000 * (attempt + 1));
    return query(params, attempt + 1);
  }
  if (!response.ok) throw new Error(`Wikipedia returned HTTP ${response.status}`);
  return (await response.json()).query?.pages ?? [];
}

function portrait(page) {
  const imageUrl = page?.original?.source ?? page?.thumbnail?.source;
  if (!page || page.missing || !imageUrl || !page.fullurl || !page.title) return null;
  if (new URL(imageUrl).hostname !== "upload.wikimedia.org") return null;
  return { imageUrl, pageUrl: page.fullurl, pageTitle: page.title };
}

async function findPortrait(name) {
  const summaryResponse = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name.replace(/ /g, "_"))}`,
    { headers: { "User-Agent": "SVEP civic-information application/1.0" } },
  );
  if (summaryResponse.ok) {
    const summary = await summaryResponse.json();
    const result = portrait({
      title: summary.title,
      fullurl: summary.content_urls?.desktop?.page,
      original: summary.originalimage,
      thumbnail: summary.thumbnail,
    });
    if (result) {
      const title = normalize(result.pageTitle);
      const expected = normalize(name);
      if (title === expected || title.startsWith(`${expected} `)) return result;
    }
  }
  const direct = portrait((await query(new URLSearchParams({ titles: name, redirects: "1" })))[0]);
  if (direct && normalize(direct.pageTitle) === normalize(name)) return direct;
  const pages = await query(new URLSearchParams({
    generator: "search",
    gsrsearch: `\"${name}\" Michigan politician`,
    gsrlimit: "5",
  }));
  const expected = normalize(name);
  return portrait(pages.find((page) => {
    const title = normalize(page.title ?? "");
    return title === expected || title.startsWith(`${expected} `);
  }));
}

try {
  const records = await prisma.representative.findMany({
    where: { level: "state", id: { startsWith: "rep-cicero-" } },
    select: { id: true, name: true, photoUrl: true },
  });
  const names = [...new Set(
    records
      .filter(({ photoUrl }) => !photoUrl?.includes("upload.wikimedia.org"))
      .map(({ name }) => name),
  )];
  let updated = 0;
  for (const name of names) {
    await wait(750);
    const result = await findPortrait(name);
    if (!result) {
      console.log(`SKIP  ${name}: no confidently matched portrait`);
      continue;
    }
    const id = sourceId(name);
    await prisma.source.upsert({
      where: { id },
      update: { name: `Wikipedia — ${result.pageTitle}`, url: result.pageUrl, lastUpdated: new Date() },
      create: {
        id,
        name: `Wikipedia — ${result.pageTitle}`,
        type: "nonprofit",
        url: result.pageUrl,
        verificationStatus: "verified",
        notes: "Source page for the Wikimedia-hosted representative portrait.",
      },
    });
    const matching = records.filter((record) => record.name === name);
    for (const record of matching) {
      await prisma.representative.update({
        where: { id: record.id },
        data: {
          photoUrl: result.imageUrl,
          isDemoPhoto: false,
          sources: { connect: { id } },
        },
      });
      updated += 1;
    }
    console.log(`OK    ${name}: ${result.pageUrl}`);
  }
  console.log(`Updated ${updated} representative records across ${names.length} unique state officials.`);
} finally {
  await prisma.$disconnect();
}
