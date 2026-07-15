"use client";

import * as React from "react";
import { Search, Users2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Input } from "@/components/ui/input";
import { LeaderRow } from "@/components/leaders/leader-row";
import { cn } from "@/lib/utils";
import { useZipContextStore } from "@/store/zip-context-store";

const levelOrder = { city: 0, state: 1, federal: 2 } as const;

type StoredRepresentative = {
  id: string;
  name: string;
  office: string;
  level: "city" | "state" | "federal";
  party: "Democratic" | "Republican" | "Independent" | "Nonpartisan" | "Other";
  jurisdiction: string;
  photoUrl: string | null;
  confidence: "verified" | "demo-data";
  demoDataNote: string | null;
  bio: string | null;
};

export function LeadersDirectory() {
  const [query, setQuery] = React.useState("");
  const [representatives, setRepresentatives] = React.useState<StoredRepresentative[]>([]);
  const [loading, setLoading] = React.useState(true);
  const savedLocation = useZipContextStore((state) => state.location);

  React.useEffect(() => {
    fetch("/api/representatives")
      .then((response) => response.json())
      .then((payload) => setRepresentatives(payload.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const q = query.trim().toLowerCase();
  const matchesQuery = (name: string, office: string) =>
    !q || name.toLowerCase().includes(q) || office.toLowerCase().includes(q);

  const filteredReps = representatives
    .filter((rep) => matchesQuery(rep.name, rep.office))
    .sort((a, b) => levelOrder[a.level] - levelOrder[b.level] || a.office.localeCompare(b.office));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Officeholders" }]} />
      <div className="mt-4">
        <h1 className="text-3xl font-semibold tracking-tight">Current Officeholders</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Current officeholders retrieved from Cicero and stored after location lookups.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:ml-auto sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or office..."
            className="pl-9"
          />
        </div>
      </div>

      {savedLocation && (
        <p className="mt-3 text-sm text-muted-foreground">
          Most recently resolved location: <span className="font-medium text-foreground">{savedLocation}</span>.
        </p>
      )}

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Users2 className="size-5 text-primary" />
          Current Officeholders
          <span className="text-sm font-normal text-muted-foreground">({filteredReps.length})</span>
        </h2>
        <div className="mt-4 space-y-3">
          {filteredReps.map((rep) => (
            <LeaderRow
              key={rep.id}
              href={`/representatives/${rep.id}`}
              name={rep.name}
              photoUrl={rep.photoUrl ?? undefined}
              office={rep.office}
              jurisdiction={rep.jurisdiction}
              party={rep.party}
              confidence={rep.confidence}
              demoDataNote={rep.demoDataNote ?? undefined}
              summary={rep.bio ?? "Current officeholder retrieved from Cicero."}
            />
          ))}
          {!loading && filteredReps.length === 0 && (
            <p className="py-10 text-center text-muted-foreground">
              No officeholders match your filters.
            </p>
          )}
        </div>
      </section>

      <p className={cn("mt-8 rounded-xl border border-border bg-secondary/40 p-4 text-xs text-muted-foreground")}>
        This directory contains officeholders saved from live Cicero location lookups. Search a new
        address to refresh and expand the database.
      </p>
    </div>
  );
}
