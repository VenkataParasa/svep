"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarDays, ExternalLink, RotateCcw, Vote } from "lucide-react";
import { CandidateListItem } from "@/components/candidates/candidate-list-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { candidates, getRaceById, racesByZip } from "@/data/candidates";
import { getSourceById } from "@/data/sources";
import { formatDate } from "@/lib/utils";
import { useZipContextStore } from "@/store/zip-context-store";

const ALL = "all";

function isLegislativeOffice(office: string) {
  return /senator|representative|council|legislature/i.test(office);
}

function electionLabel(candidate: (typeof candidates)[number]) {
  const race = getRaceById(candidate.raceId);
  const electionName = candidate.election.includes("Primary")
    ? candidate.election
    : `${candidate.election} — ${candidate.office}`;
  return `${electionName} — ${formatDate(
    race?.primaryDate ?? candidate.electionDate
  )}`;
}

export function KnowYourBallotContent() {
  const storedZip = useZipContextStore((state) => state.zip);
  const [mounted, setMounted] = React.useState(false);
  const [today] = React.useState(() => new Date().toISOString().slice(0, 10));
  React.useEffect(() => setMounted(true), []);

  const relevantRaceIds = React.useMemo(
    () => new Set(storedZip ? racesByZip[storedZip] ?? [] : []),
    [storedZip]
  );
  const activeCandidates = React.useMemo(
    () =>
      candidates
        .filter(
          (candidate) =>
            candidate.status === "active" &&
            candidate.electionDate >= today &&
            isLegislativeOffice(candidate.office) &&
            relevantRaceIds.has(candidate.raceId)
        )
        .sort(
          (a, b) =>
            a.electionDate.localeCompare(b.electionDate) ||
            a.office.localeCompare(b.office) ||
            a.name.localeCompare(b.name)
        ),
    [relevantRaceIds, today]
  );
  const elections = React.useMemo(
    () =>
      [
        ...new Map(
          activeCandidates.map((candidate) => [candidate.election, candidate])
        ).values(),
      ]
        .map((candidate) => ({
          value: candidate.election,
          label: electionLabel(candidate),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [activeCandidates]
  );
  const offices = React.useMemo(
    () =>
      [
        ...new Set(activeCandidates.map((candidate) => candidate.office)),
      ].sort(),
    [activeCandidates]
  );
  const [election, setElection] = React.useState(ALL);
  const [office, setOffice] = React.useState(ALL);

  React.useEffect(() => {
    setElection(ALL);
    setOffice(ALL);
  }, [storedZip]);

  const visibleCandidates = activeCandidates.filter(
    (candidate) =>
      (election === ALL || candidate.election === election) &&
      (office === ALL || candidate.office === office)
  );
  const hasFilters = election !== ALL || office !== ALL;
  const visibleRaces = [...relevantRaceIds]
    .map((raceId) => getRaceById(raceId))
    .filter((race): race is NonNullable<typeof race> =>
      Boolean(race && isLegislativeOffice(race.officeTitle))
    )
    .map((race) => ({
      race,
      candidates: visibleCandidates.filter(
        (candidate) => candidate.raceId === race.id
      ),
    }))
    .filter(({ candidates: raceCandidates }) => raceCandidates.length > 0);

  if (!mounted) {
    return <div className="mt-6 min-h-64" />;
  }

  if (!storedZip || relevantRaceIds.size === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center">
        <Vote className="mx-auto size-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">
          {storedZip
            ? `No ballot coverage for ZIP ${storedZip}`
            : "Choose your location first"}
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
          {storedZip
            ? "The current candidate snapshot does not contain races mapped to this ZIP code."
            : "Enter an address or ZIP code so the platform can resolve the elections and offices relevant to your area."}
        </p>
        <Button className="mt-5" render={<Link href="/dashboard" />}>
          Go to Jurisdiction Dashboard
        </Button>
      </div>
    );
  }

  return (
    <>
      <Card className="mt-6 rounded-2xl border-border/80 shadow-sm">
        <CardContent className="grid gap-4 pt-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
          <div>
            <label
              className="mb-2 flex items-center gap-2 text-sm font-semibold"
              htmlFor="ballot-election-filter"
            >
              <CalendarDays className="size-4 text-primary" /> Upcoming Election
            </label>
            <Select
              value={election}
              onValueChange={(value) => setElection(value ?? ALL)}
            >
              <SelectTrigger
                id="ballot-election-filter"
                className="h-11 w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value={ALL}>All Upcoming Elections</SelectItem>
                {elections.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              className="mb-2 flex items-center gap-2 text-sm font-semibold"
              htmlFor="ballot-office-filter"
            >
              <Vote className="size-4 text-primary" /> Office
            </label>
            <Select
              value={office}
              onValueChange={(value) => setOffice(value ?? ALL)}
            >
              <SelectTrigger id="ballot-office-filter" className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value={ALL}>All offices</SelectItem>
                {offices.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 gap-2"
            disabled={!hasFilters}
            onClick={() => {
              setElection(ALL);
              setOffice(ALL);
            }}
          >
            <RotateCcw className="size-4" /> Reset
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {visibleCandidates.length}
          </span>{" "}
          active {visibleCandidates.length === 1 ? "candidate" : "candidates"}
          {storedZip && (
            <>
              {" "}
              for ZIP{" "}
              <span className="font-semibold text-foreground">{storedZip}</span>
            </>
          )}
        </p>
      </div>

      {visibleRaces.length > 0 ? (
        <Card className="mt-4 rounded-2xl border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Vote className="size-4.5 text-primary" />
              2026 Candidates on Your Ballot
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Active, currently-filed candidates for legislative offices in ZIP{" "}
              {storedZip}. Michigan&apos;s primary is August 4, 2026; the
              general election is November 3, 2026.
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {visibleRaces.map(({ race, candidates: raceCandidates }) => (
              <section key={race.id} aria-labelledby={`race-${race.id}`}>
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 id={`race-${race.id}`} className="text-sm font-semibold">
                    {race.officeTitle}
                    <span className="ml-1.5 font-normal text-muted-foreground">
                      — {race.jurisdiction}
                    </span>
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Primary {formatDate(race.primaryDate)} · General{" "}
                    {formatDate(race.generalDate)}
                  </span>
                </div>
                <p className="mb-2.5 text-xs text-muted-foreground">
                  {race.description}
                </p>
                <div className="space-y-2">
                  {raceCandidates.map((candidate) => (
                    <CandidateListItem
                      key={candidate.id}
                      candidate={candidate}
                    />
                  ))}
                </div>
                {race.rosterNote && (
                  <div className="mt-2 rounded-md bg-muted/40 p-2.5 text-xs text-muted-foreground">
                    <p>{race.rosterNote}</p>
                    {race.sourceIds && race.sourceIds.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-semibold text-foreground">
                          Sources:
                        </span>
                        {race.sourceIds
                          .map(getSourceById)
                          .filter(Boolean)
                          .map((source) => (
                            <a
                              key={source!.id}
                              href={source!.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                            >
                              {source!.name}
                              <ExternalLink className="size-3" />
                            </a>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </section>
            ))}
          </CardContent>
        </Card>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-border p-12 text-center">
          <Vote className="mx-auto size-10 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">
            No active candidates match
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Reset the filters or select a different election and office.
          </p>
        </div>
      )}
    </>
  );
}
