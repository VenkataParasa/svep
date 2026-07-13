import { prisma as db } from "@/lib/prisma";

export interface LiveBill {
  id: string;
  title: string;
  billNumber: string;
  status: string;
  url: string;
}

export interface LiveIssueCategory {
  id: string;
  slug: string;
  title: string;
  icon: string;
  bills: LiveBill[];
}

const CATEGORIES = [
  { slug: "housing", title: "Housing", icon: "Home", query: "housing" },
  { slug: "education", title: "Education", icon: "GraduationCap", query: "education" },
  { slug: "public-safety", title: "Public Safety", icon: "ShieldCheck", query: "safety" },
  { slug: "transportation", title: "Transportation", icon: "Bus", query: "transit" },
  { slug: "economic-development", title: "Economic Development", icon: "TrendingUp", query: "economic" },
  { slug: "environment", title: "Environment", icon: "Leaf", query: "environment" },
  { slug: "healthcare", title: "Healthcare", icon: "HeartPulse", query: "health" },
  { slug: "parks-recreation", title: "Parks & Recreation", icon: "TreePine", query: "parks" },
  { slug: "taxation", title: "Taxation", icon: "BadgeDollarSign", query: "tax" },
];

export async function getLiveIssues(): Promise<LiveIssueCategory[]> {
  const apiKey = process.env.OPENSTATES_API_KEY || "";
  const results: LiveIssueCategory[] = [];

  for (const cat of CATEGORIES) {
    let bills: LiveBill[] = [];
    
    if (apiKey && apiKey.length > 5) {
      try {
        const res = await fetch(`https://v3.openstates.org/bills?jurisdiction=Michigan&q=${cat.query}&sort=updated_desc&per_page=3`, {
          headers: { 'X-API-KEY': apiKey },
          next: { revalidate: 3600 } // Cache results for 1 hour to prevent hitting rate limits
        });
        
        if (res.ok) {
          const data = await res.json();
          const resultsArray = data.results || [];
          bills = resultsArray.map((b: { id: string; title: string; identifier: string; latest_action_description?: string; openstates_url?: string }) => ({
            id: b.id,
            title: b.title,
            billNumber: b.identifier,
            status: b.latest_action_description || "Unknown",
            url: b.openstates_url || `https://openstates.org/mi/bills/`
          }));
        } else {
          console.warn(`[OpenStates] Failed to fetch for ${cat.query}: ${res.status}`);
        }
      } catch (e: unknown) {
        console.error(`[OpenStates] Error fetching for ${cat.query}`, e);
      }
    }
    
    // Fallback if no API key or if the real fetch yielded no results
    if (bills.length === 0) {
       const dbLegislation = await db.legislation.findMany({
         where: { issue: { slug: cat.slug } },
         take: 3
       });
       
       bills = dbLegislation.map((l: { id: string; title: string; billNumber: string; status: string }) => ({
         id: l.id,
         title: l.title,
         billNumber: l.billNumber,
         status: l.status,
         url: "#"
       }));
    }

    results.push({
      id: cat.slug,
      slug: cat.slug,
      title: cat.title,
      icon: cat.icon,
      bills
    });
  }

  return results;
}
