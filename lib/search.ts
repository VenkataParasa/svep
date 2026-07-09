import { issues } from "@/data/issues";
import { candidates } from "@/data/candidates";
import { representatives } from "@/data/representatives";
import { legislation } from "@/data/legislation";

export type SearchResultType = "issue" | "candidate" | "representative" | "legislation";

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export function buildSearchIndex(): SearchResult[] {
  const issueResults: SearchResult[] = issues.map((i) => ({
    type: "issue",
    id: i.id,
    title: i.title,
    subtitle: i.summary,
    href: `/issues/${i.slug}`,
  }));

  const candidateResults: SearchResult[] = candidates.map((c) => ({
    type: "candidate",
    id: c.id,
    title: c.name,
    subtitle: `${c.office} — ${c.party}`,
    href: `/candidates/${c.id}`,
  }));

  const repResults: SearchResult[] = representatives.map((r) => ({
    type: "representative",
    id: r.id,
    title: r.name,
    subtitle: r.office,
    href: `/representatives/${r.id}`,
  }));

  const legResults: SearchResult[] = legislation.map((l) => ({
    type: "legislation",
    id: l.id,
    title: l.title,
    subtitle: l.billNumber,
    href: `/issues/${issues.find((i) => i.id === l.relatedIssueId)?.slug ?? ""}`,
  }));

  return [...issueResults, ...candidateResults, ...repResults, ...legResults];
}

export function searchAll(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return buildSearchIndex().filter(
    (r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)
  );
}
