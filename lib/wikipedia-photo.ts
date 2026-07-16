type WikipediaPage = {
  pageid?: number;
  title?: string;
  fullurl?: string;
  missing?: boolean;
  original?: { source?: string };
  thumbnail?: { source?: string };
};

export type WikipediaPhoto = {
  imageUrl: string;
  pageUrl: string;
  pageTitle: string;
};

const WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php";

function normalizedName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function photoFromPage(page?: WikipediaPage): WikipediaPhoto | null {
  const imageUrl = page?.original?.source ?? page?.thumbnail?.source;
  if (!page || page.missing || !imageUrl || !page.fullurl || !page.title) return null;

  try {
    if (new URL(imageUrl).hostname !== "upload.wikimedia.org") return null;
  } catch {
    return null;
  }

  return { imageUrl, pageUrl: page.fullurl, pageTitle: page.title };
}

async function wikipediaQuery(params: URLSearchParams) {
  params.set("action", "query");
  params.set("format", "json");
  params.set("formatversion", "2");
  params.set("origin", "*");
  params.set("prop", "pageimages|info");
  params.set("piprop", "original|thumbnail");
  params.set("pithumbsize", "800");
  params.set("inprop", "url");

  const response = await fetch(`${WIKIPEDIA_API}?${params}`, {
    headers: { "User-Agent": "SVEP civic-information application/1.0" },
    next: { revalidate: 60 * 60 * 24 * 30 },
  });
  if (!response.ok) return [];
  const payload = (await response.json()) as { query?: { pages?: WikipediaPage[] } };
  return payload.query?.pages ?? [];
}

/** Resolve only a confidently named Wikipedia biography to avoid wrong portraits. */
export async function findWikipediaPortrait(
  name: string,
  requiredContext: string[] = [],
) {
  const summaryResponse = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name.replace(/ /g, "_"))}`,
    {
      headers: { "User-Agent": "SVEP civic-information application/1.0" },
      next: { revalidate: 60 * 60 * 24 * 30 },
    },
  );
  if (summaryResponse.ok) {
    const summary = (await summaryResponse.json()) as {
      title?: string;
      originalimage?: { source?: string };
      thumbnail?: { source?: string };
      content_urls?: { desktop?: { page?: string } };
      description?: string;
    };
    const summaryPhoto = photoFromPage({
      title: summary.title,
      fullurl: summary.content_urls?.desktop?.page,
      original: summary.originalimage,
      thumbnail: summary.thumbnail,
    });
    const hasRequiredContext =
      requiredContext.length === 0 ||
      requiredContext.some((term) =>
        normalizedName(summary.description ?? "").includes(normalizedName(term)),
      );
    if (
      summaryPhoto &&
      hasRequiredContext &&
      (normalizedName(summaryPhoto.pageTitle) === normalizedName(name) ||
        normalizedName(summaryPhoto.pageTitle).startsWith(`${normalizedName(name)} `))
    ) {
      return summaryPhoto;
    }
  }

  // For officials, an exact name alone is insufficient: people in sports,
  // entertainment, or business frequently share the same name.
  if (requiredContext.length > 0) return null;

  const directPages = await wikipediaQuery(
    new URLSearchParams({ titles: name, redirects: "1" }),
  );
  const direct = photoFromPage(directPages[0]);
  if (direct && normalizedName(direct.pageTitle) === normalizedName(name)) return direct;

  const searchPages = await wikipediaQuery(
    new URLSearchParams({
      generator: "search",
      gsrsearch: `\"${name}\" Michigan politician`,
      gsrlimit: "5",
    }),
  );
  const expected = normalizedName(name);
  const matchingPage = searchPages.find((page) => {
    const title = normalizedName(page.title ?? "");
    return title === expected || title.startsWith(`${expected} `);
  });
  return photoFromPage(matchingPage);
}

export function wikipediaSourceId(name: string) {
  const slug = normalizedName(name).replace(/\s+/g, "-");
  return `src-wikipedia-photo-${slug}`;
}
