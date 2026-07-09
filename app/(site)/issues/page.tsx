"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { IssueCard } from "@/components/issues/issue-card";
import { Input } from "@/components/ui/input";
import { issues } from "@/data/issues";

export default function IssuesPage() {
  const [query, setQuery] = React.useState("");

  const filtered = issues.filter((issue) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      issue.title.toLowerCase().includes(q) ||
      issue.summary.toLowerCase().includes(q) ||
      issue.plainLanguageSummary.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Issues" }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Civic Issues</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">
            Explore the issues shaping Detroit — each one links real legislation, representatives,
            and candidates back to official sources.
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
          <IssueCard key={issue.id} issue={issue} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-muted-foreground">
            No issues match &ldquo;{query}&rdquo;.
          </p>
        )}
      </div>
    </div>
  );
}
