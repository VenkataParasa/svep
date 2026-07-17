import { NextResponse } from "next/server";
import { getCandidateById } from "@/data/candidates";
import { getSourceById } from "@/data/sources";

function safeHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    return (
      url.protocol === "https:" &&
      hostname !== "localhost" &&
      hostname !== "127.0.0.1" &&
      hostname !== "::1" &&
      !hostname.endsWith(".local")
    );
  } catch {
    return false;
  }
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

function metaContent(html: string, key: string) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`, "i"),
  ];
  return patterns.map((pattern) => html.match(pattern)?.[1]).find(Boolean) ?? null;
}

function normalized(value: string) {
  return value.normalize("NFKD").replace(/[^a-zA-Z0-9]+/g, " ").trim().toLowerCase();
}

function verifiedStoredPortrait(
  photoUrl: string,
  sourceIds: string[],
) {
  if (!safeHttpsUrl(photoUrl)) return null;
  const hostname = new URL(photoUrl).hostname.toLowerCase();
  const hasPortraitSource = sourceIds.some(
    (sourceId) =>
      sourceId.startsWith("src-wikipedia-photo-") ||
      sourceId.startsWith("src-wikipedia-"),
  );
  if (hostname === "upload.wikimedia.org" && hasPortraitSource) return photoUrl;
  if (hostname.endsWith(".gov")) return photoUrl;
  return null;
}

async function portraitFromProfile(
  pageUrl: string,
  candidateName: string,
  requireNameMatch: boolean,
) {
  if (!safeHttpsUrl(pageUrl)) return null;
  const response = await fetch(pageUrl, {
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Upgrade-Insecure-Requests": "1"
    },
    next: { revalidate: 60 * 60 * 24 * 7 },
    signal: AbortSignal.timeout(8_000),
  });
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || !contentType.includes("text/html")) return null;

  const html = await response.text();
  const pageTitle =
    metaContent(html, "og:title") ??
    html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ??
    "";
  const imageAlt = metaContent(html, "og:image:alt") ?? "";
  const lastName = normalized(candidateName).split(" ").at(-1) ?? "";
  if (
    requireNameMatch &&
    (!lastName || !normalized(`${pageTitle} ${imageAlt}`).includes(lastName))
  ) {
    return null;
  }
  const image =
    metaContent(html, "og:image") ??
    metaContent(html, "twitter:image") ??
    metaContent(html, "twitter:image:src");
  if (!image) return null;
  const imageUrl = new URL(decodeHtml(image), pageUrl).toString();
  return safeHttpsUrl(imageUrl) ? imageUrl : null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const candidate = getCandidateById(id);
  if (!candidate) return new NextResponse("Candidate not found.", { status: 404 });

  // Curated portrait files are person-specific and take precedence over a
  // campaign page's social preview, which may be a slogan or group banner.
  let portraitUrl = verifiedStoredPortrait(
    candidate.photoUrl,
    candidate.sourceIds,
  );

  const directOfficialPages = [
    candidate.officialLinks.campaignSite,
    candidate.officialLinks.website,
  ].filter((url): url is string => Boolean(url));
  const sourcedOfficialPages = [
    ...candidate.sourceIds
      .map(getSourceById)
      .filter(
        (source) =>
          source && ["campaign", "government", "legislative"].includes(source.type),
      )
      .map((source) => source!.url),
  ].filter((url): url is string => Boolean(url));
  const officialPages = [
    ...directOfficialPages.map((url) => ({ url, requireNameMatch: false })),
    ...sourcedOfficialPages.map((url) => ({ url, requireNameMatch: true })),
  ].filter(
    (page, index, pages) =>
      pages.findIndex((candidatePage) => candidatePage.url === page.url) === index,
  );

  for (const page of portraitUrl ? [] : officialPages) {
    try {
      portraitUrl = await portraitFromProfile(
        page.url,
        candidate.name,
        page.requireNameMatch,
      );
      if (portraitUrl) break;
    } catch {
      // Try the next official source. Missing images fall back to initials.
    }
  }

  if (!portraitUrl) return new NextResponse("Official portrait not available.", { status: 404 });

  try {
    const response = await fetch(portraitUrl, {
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Upgrade-Insecure-Requests": "1"
      },
      next: { revalidate: 60 * 60 * 24 * 7 },
      signal: AbortSignal.timeout(8_000),
    });
    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || !contentType.startsWith("image/")) {
      return new NextResponse("Official portrait not available.", { status: 404 });
    }
    return new NextResponse(await response.arrayBuffer(), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
      },
    });
  } catch {
    return new NextResponse("Official portrait not available.", { status: 404 });
  }
}
