"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, Landmark, ScrollText, Search, UserRound } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { searchAll, type SearchResultType } from "@/lib/search";

const typeIcon: Record<SearchResultType, React.ElementType> = {
  issue: FileText,
  candidate: UserRound,
  representative: Landmark,
  legislation: ScrollText,
};

const typeLabel: Record<SearchResultType, string> = {
  issue: "Issue",
  candidate: "Candidate",
  representative: "Representative",
  legislation: "Legislation",
};

export function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = React.useState(initialQuery);

  React.useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  function onChange(value: string) {
    setQuery(value);
    const params = new URLSearchParams();
    if (value) params.set("q", value);
    router.replace(`/search${value ? `?${params.toString()}` : ""}`);
  }

  const results = searchAll(query);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Search" }]} />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Search the Platform</h1>
      <p className="mt-1 text-muted-foreground">
        Find civic issues and legislation by keyword.
      </p>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search issues and bills..."
          className="h-12 pl-9 text-base"
        />
      </div>

      <div className="mt-6 space-y-3">
        {query && results.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">No results found for &ldquo;{query}&rdquo;.</p>
        )}
        {results.map((result) => {
          const Icon = typeIcon[result.type];
          return (
            <Link key={`${result.type}-${result.id}`} href={result.href}>
              <Card className="rounded-xl border-border/80 shadow-sm transition-colors hover:bg-accent/40">
                <CardContent className="flex items-center gap-3 py-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{result.title}</p>
                    <p className="truncate text-sm text-muted-foreground">{result.subtitle}</p>
                  </div>
                  <Badge variant="outline">{typeLabel[result.type]}</Badge>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {!query && (
          <p className="py-10 text-center text-muted-foreground">
            Start typing to search, or press{" "}
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">Ctrl K</kbd> anywhere
            on the site.
          </p>
        )}
      </div>
    </div>
  );
}
