export type OfficialGovernmentPhoto = {
  imageUrl: string;
  pageUrl: string;
  pageTitle: string;
};

function normalized(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function isGovernmentPage(value: string) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    const trustedLegislativeHosts = [
      "house.mi.gov",
      "senate.michigan.gov",
      "housedems.com",
      "gophouse.org",
      "senatedems.com",
      "misenategop.com",
    ];
    return (
      url.protocol === "https:" &&
      (hostname.endsWith(".gov") ||
        trustedLegislativeHosts.some(
          (trustedHost) =>
            hostname === trustedHost || hostname.endsWith(`.${trustedHost}`),
        ))
    );
  } catch {
    return false;
  }
}

function metaContent(html: string, key: string) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${escapedKey}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escapedKey}["'][^>]*>`,
      "i",
    ),
  ];
  return patterns.map((pattern) => html.match(pattern)?.[1]).find(Boolean) ?? null;
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

/** Resolve a portrait advertised by a name-matching official government page. */
export async function findOfficialGovernmentPortrait(
  name: string,
  pageUrls: string[],
): Promise<OfficialGovernmentPhoto | null> {
  const expectedName = normalized(name);

  for (const pageUrl of pageUrls.filter(isGovernmentPage)) {
    try {
      const response = await fetch(pageUrl, {
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "User-Agent": "SVEP civic-information application/1.0",
        },
        next: { revalidate: 60 * 60 * 24 * 30 },
        signal: AbortSignal.timeout(8_000),
      });
      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok || !contentType.includes("text/html")) continue;

      const html = await response.text();
      const title = decodeHtml(
        metaContent(html, "og:title") ??
          html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ??
          "",
      ).trim();
      if (!normalized(title).includes(expectedName)) continue;

      const imageValue =
        metaContent(html, "og:image") ??
        metaContent(html, "twitter:image") ??
        metaContent(html, "twitter:image:src");
      if (!imageValue) continue;

      const imageUrl = new URL(decodeHtml(imageValue), pageUrl);
      if (imageUrl.protocol !== "https:") continue;

      return {
        imageUrl: imageUrl.toString(),
        pageUrl,
        pageTitle: title,
      };
    } catch {
      // An unavailable government page must not prevent jurisdiction results.
    }
  }

  return null;
}

export function officialGovernmentPhotoSourceId(name: string) {
  const slug = normalized(name).replace(/\s+/g, "-");
  return `src-government-photo-${slug}`;
}
