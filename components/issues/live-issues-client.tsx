"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LiveIssueCard } from "@/components/issues/live-issue-card";
import { LiveIssueCategory } from "@/lib/live-issues";

export function LiveIssuesClient({ initialIssues }: { initialIssues: LiveIssueCategory[] }) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [query, setQuery] = React.useState(initialSearch);

  const filtered = initialIssues.filter((cat) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    
    // Search by category title or bill titles
    const matchesTitle = cat.title.toLowerCase().includes(q);
    const matchesBills = cat.bills.some(b => 
      b.title.toLowerCase().includes(q) || b.billNumber.toLowerCase().includes(q)
    );
    const matchesNews = cat.news.some((article) =>
      article.title.toLowerCase().includes(q) ||
      article.source.toLowerCase().includes(q)
    );
    
    return matchesTitle || matchesBills || matchesNews;
  });

  return (
    <>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Civic Issues</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Explore active issues shaping Michigan through recent OpenStates
            legislation and current publisher news coverage.
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search issues, bills, or news..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((cat) => (
          <LiveIssueCard key={cat.id} category={cat} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-muted-foreground">
            No issues match &ldquo;{query}&rdquo;.
          </p>
        )}
      </div>
    </>
  );
}
