"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { IssueCard } from "@/components/issues/issue-card";
import { Input } from "@/components/ui/input";
import type { Issue } from "@/lib/types";

export function IssuesClient({ initialIssues }: { initialIssues: Record<string, unknown>[] }) {
  const [query, setQuery] = React.useState("");

  const filtered = initialIssues.filter((issue: Record<string, unknown>) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    
    const title = typeof issue.title === 'string' ? issue.title : '';
    const summary = typeof issue.summary === 'string' ? issue.summary : '';
    const plain = typeof issue.plainLanguageSummary === 'string' ? issue.plainLanguageSummary : '';
    
    return (
      title.toLowerCase().includes(q) ||
      summary.toLowerCase().includes(q) ||
      plain.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Civic Issues</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">
            Explore the issues shaping Detroit — each one links real legislation, representatives,
            and officeholders back to official sources.
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search issues..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((issue) => (
          <IssueCard key={issue.id as string} issue={issue as unknown as Issue} />
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
