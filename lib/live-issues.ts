import { prisma as db } from "@/lib/prisma";

export interface LiveBill {
  id: string;
  title: string;
  billNumber: string;
  status: string;
  url: string;
  summary?: string;
  updatedAt?: string;
  source: string;
}

export interface LiveNewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt?: string;
  imageUrl?: string;
}

export interface LiveIssueCategory {
  id: string;
  slug: string;
  title: string;
  icon: string;
  bills: LiveBill[];
  news: LiveNewsArticle[];
}

const CATEGORIES = [
  { slug: "housing", title: "Housing", icon: "Home", query: "housing", newsTerms: ["housing", "rent", "home", "mortgage"] },
  { slug: "education", title: "Education", icon: "GraduationCap", query: "education", newsTerms: ["education", "school", "student", "teacher"] },
  { slug: "public-safety", title: "Public Safety", icon: "ShieldCheck", query: "safety", newsTerms: ["safety", "crime", "police", "firearm"] },
  { slug: "transportation", title: "Transportation", icon: "Bus", query: "transit", newsTerms: ["transit", "transportation", "bus", "road"] },
  { slug: "economic-development", title: "Economic Development", icon: "TrendingUp", query: "economic", newsTerms: ["economic", "economy", "jobs", "business"] },
  { slug: "environment", title: "Environment", icon: "Leaf", query: "environment", newsTerms: ["environment", "climate", "water", "energy"] },
  { slug: "healthcare", title: "Healthcare", icon: "HeartPulse", query: "health", newsTerms: ["health", "hospital", "medicaid", "medical"] },
  { slug: "parks-recreation", title: "Parks & Recreation", icon: "TreePine", query: "parks", newsTerms: ["park", "recreation", "trail", "greenway"] },
  { slug: "taxation", title: "Taxation", icon: "BadgeDollarSign", query: "tax", newsTerms: ["tax", "revenue", "budget", "fiscal"] },
];

async function getRecentNews(): Promise<LiveNewsArticle[]> {
  try {
    const params = new URLSearchParams({
      query: "Michigan (housing OR education OR safety OR transit OR economic OR environment OR health OR parks OR tax)",
      mode: "artlist",
      maxrecords: "75",
      format: "json",
      sort: "datedesc",
      timespan: "1month",
    });
    const response = await fetch(
      `https://api.gdeltproject.org/api/v2/doc/doc?${params.toString()}`,
      { next: { revalidate: 60 * 60 } },
    );
    if (!response.ok) return [];
    const payload = (await response.json()) as {
      items?: Array<{
        title?: string;
        url?: string;
        domain?: string;
        date_published?: string;
        socialimage?: string;
      }>;
    };
    return (payload.items ?? [])
      .filter((item) => item.title && item.url)
      .map((item, index) => ({
        id: `michigan-news-${index}-${item.url}`,
        title: item.title!,
        url: item.url!,
        source: item.domain || new URL(item.url!).hostname,
        publishedAt: item.date_published,
        imageUrl: item.socialimage,
      }));
  } catch {
    return [];
  }
}

export async function getLiveIssues(): Promise<LiveIssueCategory[]> {
  const apiKey = process.env.OPENSTATES_API_KEY || "";
  const recentNews = await getRecentNews();

  const results = await Promise.all(
    CATEGORIES.map(async (cat) => {
      let bills: LiveBill[] = [];

      if (apiKey && apiKey.length > 5) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const res = await fetch(
            `https://v3.openstates.org/bills?jurisdiction=Michigan&q=${cat.query}&sort=updated_desc&per_page=6`,
            {
              headers: { "X-API-KEY": apiKey },
              next: { revalidate: 3600 },
              signal: controller.signal,
            }
          );
          
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const resultsArray = data.results || [];
            bills = resultsArray.map(
              (b: {
                id: string;
                title: string;
                identifier: string;
                latest_action_description?: string;
                latest_action_date?: string;
                openstates_url?: string;
                abstracts?: Array<{ abstract?: string; note?: string }>;
              }) => ({
                id: b.id,
                title: b.title,
                billNumber: b.identifier,
                status: b.latest_action_description || "Unknown",
                url: b.openstates_url || `https://openstates.org/mi/bills/`,
                summary: b.abstracts?.[0]?.abstract || b.abstracts?.[0]?.note,
                updatedAt: b.latest_action_date,
                source: "OpenStates",
              })
            );
          } else {
            console.warn(`[OpenStates] Failed to fetch for ${cat.query}: ${res.status}`);
          }
        } catch (e: unknown) {
          console.error(`[OpenStates] Error fetching for ${cat.query}:`, (e as Error).message || e);
        }
      }

      // Fallback if no API key or if the real fetch yielded no results (or timed out)
      if (bills.length === 0) {
        try {
          const dbLegislation = await db.legislation.findMany({
            where: { issue: { slug: cat.slug } },
            take: 6,
            orderBy: { lastUpdated: "desc" },
          });

          bills = dbLegislation.map((l) => ({
            id: l.id,
            title: l.title,
            billNumber: l.billNumber,
            status: l.status,
            url: "#",
            summary: l.summary,
            updatedAt: l.lastUpdated.toISOString(),
            source: "Platform legislative records",
          }));
        } catch (e: unknown) {
          console.error(`[Prisma Database Fallback] Error querying legislation for ${cat.slug}:`, e);
        }
      }

      return {
        id: cat.slug,
        slug: cat.slug,
        title: cat.title,
        icon: cat.icon,
        bills,
        news: recentNews
          .filter((article) => {
            const title = article.title.toLowerCase();
            return cat.newsTerms.some((term) => title.includes(term));
          })
          .slice(0, 6),
      };
    })
  );

  return results;
}
