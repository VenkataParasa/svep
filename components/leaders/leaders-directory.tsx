"use client";

import * as React from "react";
import { MapPin, Search, Users2, Vote } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeaderRow } from "@/components/leaders/leader-row";
import { representatives } from "@/data/representatives";
import { candidates } from "@/data/candidates";
import { jurisdictions } from "@/data/jurisdictions";
import { cn } from "@/lib/utils";

const levelOrder = { city: 0, state: 1, federal: 2 } as const;

const candidateStatusLabel: Record<(typeof candidates)[number]["status"], string> = {
  active: "Active Candidate",
  withdrawn: "Campaign Withdrawn",
  incumbent: "Incumbent",
};

export function LeadersDirectory() {
  const [zipFilter, setZipFilter] = React.useState<string>("all");
  const [query, setQuery] = React.useState("");

  const jurisdiction = zipFilter === "all" ? undefined : jurisdictions.find((j) => j.zip === zipFilter);

  const q = query.trim().toLowerCase();
  const matchesQuery = (name: string, office: string) =>
    !q || name.toLowerCase().includes(q) || office.toLowerCase().includes(q);

  const filteredReps = representatives
    .filter((rep) => (jurisdiction ? jurisdiction.representativeIds.includes(rep.id) : true))
    .filter((rep) => matchesQuery(rep.name, rep.office))
    .sort((a, b) => levelOrder[a.level] - levelOrder[b.level] || a.office.localeCompare(b.office));

  // Statewide races apply to every Detroit ZIP code, so candidates are
  // shown under all ZIP filters.
  const filteredCandidates = candidates.filter((c) => matchesQuery(c.name, c.office));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Leaders & Candidates" }]} />
      <div className="mt-4">
        <h1 className="text-3xl font-semibold tracking-tight">Leaders &amp; Candidates</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Every current officeholder and active candidate tracked by this platform — real people,
          compiled from official government sources. Filter by ZIP code to see who serves your area.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-muted-foreground" />
          <Select value={zipFilter} onValueChange={(v) => setZipFilter(v ?? "all")}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Filter by ZIP code" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ZIP codes</SelectItem>
              {jurisdictions.map((j) => (
                <SelectItem key={j.zip} value={j.zip}>
                  {j.zip} — {j.neighborhood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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

      {jurisdiction && (
        <p className="mt-3 text-sm text-muted-foreground">
          Showing officials serving <span className="font-medium text-foreground">{jurisdiction.neighborhood}</span>{" "}
          ({jurisdiction.zip}) — {jurisdiction.councilDistrict.split(" — ")[0]},{" "}
          {jurisdiction.stateHouseDistrict}, {jurisdiction.stateSenateDistrict},{" "}
          {jurisdiction.congressionalDistrict}.
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
              photoUrl={rep.photoUrl}
              office={rep.office}
              jurisdiction={rep.jurisdiction}
              party={rep.party}
              confidence={rep.confidence}
              demoDataNote={rep.demoDataNote}
              summary={rep.bio}
            />
          ))}
          {filteredReps.length === 0 && (
            <p className="py-10 text-center text-muted-foreground">
              No officeholders match your filters.
            </p>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Vote className="size-5 text-primary" />
          Candidates — 2026 Election Cycle
          <span className="text-sm font-normal text-muted-foreground">({filteredCandidates.length})</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Statewide races appear for every Detroit ZIP code.
        </p>
        <div className="mt-4 space-y-3">
          {filteredCandidates.map((candidate) => (
            <LeaderRow
              key={candidate.id}
              href={`/candidates/${candidate.id}`}
              name={candidate.name}
              photoUrl={candidate.photoUrl}
              office={candidate.office}
              jurisdiction={candidate.jurisdiction}
              party={candidate.party}
              confidence={candidate.confidence}
              demoDataNote={candidate.demoDataNote}
              summary={candidate.positionSummary}
              tag={candidateStatusLabel[candidate.status]}
            />
          ))}
          {filteredCandidates.length === 0 && (
            <p className="py-10 text-center text-muted-foreground">
              No candidates match your search.
            </p>
          )}
        </div>
      </section>

      <p className={cn("mt-8 rounded-xl border border-border bg-secondary/40 p-4 text-xs text-muted-foreground")}>
        Photos: no directly-linkable official portrait assets were confirmed on .gov sources during
        research, so profiles display initials placeholders rather than unverified images. All names,
        offices, and jurisdictions are real and sourced — see each profile&rsquo;s Sources section.
      </p>
    </div>
  );
}
