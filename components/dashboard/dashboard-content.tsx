"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Vote } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { LocationCard } from "@/components/dashboard/location-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RepresentativeListItem } from "@/components/representatives/representative-list-item";
import { CandidateCard } from "@/components/candidates/candidate-card";
import { IssueCard } from "@/components/issues/issue-card";
import { ZipSearchForm } from "@/components/landing/zip-search-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getJurisdictionByZip } from "@/data/jurisdictions";
import { getIssueById } from "@/data/issues";
import { candidates } from "@/data/candidates";
import { useZipContextStore, isValidZip } from "@/store/zip-context-store";
import type { GovLevel, Party } from "@/lib/types";

type OfficeLevelFilter = GovLevel | "all";

interface CurrentOfficial {
  id: string;
  name: string;
  office: string;
  level: GovLevel;
  party: Party;
  photoUrl: string;
}

export function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { zip: storedZip, setZip } = useZipContextStore();
  const queryZip = searchParams.get("zip");
  const [representatives, setRepresentatives] = React.useState<
    CurrentOfficial[]
  >([]);
  const [representativesLoading, setRepresentativesLoading] =
    React.useState(false);
  const [representativesError, setRepresentativesError] = React.useState<
    string | null
  >(null);
  const [officeLevelFilter, setOfficeLevelFilter] =
    React.useState<OfficeLevelFilter>("all");

  React.useEffect(() => {
    if (queryZip && isValidZip(queryZip) && queryZip !== storedZip) {
      setZip(queryZip);
    } else if (!queryZip && storedZip && isValidZip(storedZip)) {
      router.replace(`/dashboard?zip=${storedZip}`);
    }
  }, [queryZip, storedZip, setZip, router]);

  const activeZip = queryZip && isValidZip(queryZip) ? queryZip : null;

  React.useEffect(() => {
    if (!activeZip) return;
    const controller = new AbortController();
    setRepresentativesLoading(true);
    setRepresentativesError(null);

    fetch(`/api/current-officials?zip=${encodeURIComponent(activeZip)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok)
          throw new Error(
            payload.error || "Unable to retrieve current officials."
          );
        setRepresentatives(payload.data || []);
      })
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") {
          setRepresentatives([]);
          setRepresentativesError(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setRepresentativesLoading(false);
      });

    return () => controller.abort();
  }, [activeZip]);

  if (!activeZip) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold">
          Enter an address or ZIP code to see your dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          This demo covers 37 Detroit-area ZIP codes (48201&ndash;48243) — try
          48226 (Downtown) or 48219 (Northwest).
        </p>
        <ZipSearchForm className="mt-8" />
      </div>
    );
  }

  const jurisdiction = getJurisdictionByZip(activeZip)!;
  const visibleRepresentatives = representatives.filter(
    (representative) =>
      officeLevelFilter === "all" || representative.level === officeLevelFilter
  );
  const topIssues = jurisdiction.topIssueIds
    .map(getIssueById)
    .filter((i): i is NonNullable<typeof i> => Boolean(i));
  const activeCandidates = candidates.filter((c) => c.status !== "withdrawn");
  const otherCandidates = candidates.filter((c) => c.status === "withdrawn");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Dashboard" }]} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-4 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Your Civic Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Personalized for {jurisdiction.neighborhood} ({jurisdiction.zip})
          </p>
        </div>
        <Link
          href="/#zip-search"
          className="text-sm font-medium text-primary hover:underline"
        >
          Change ZIP code
        </Link>
      </motion.div>

      <div className="mt-6">
        <QuickActions zip={jurisdiction.zip} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <LocationCard jurisdiction={jurisdiction} />

        <Card className="rounded-2xl border-border/80 shadow-sm lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4.5 text-primary" />
                Your Representatives
              </CardTitle>
              <Select
                value={officeLevelFilter}
                onValueChange={(value) =>
                  setOfficeLevelFilter((value || "all") as OfficeLevelFilter)
                }
              >
                <SelectTrigger size="sm" className="w-32" aria-label="Filter representatives by level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="city">Local</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                  <SelectItem value="federal">Federal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {representativesLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading current officeholders…
              </p>
            ) : representativesError ? (
              <p className="text-sm text-destructive">{representativesError}</p>
            ) : visibleRepresentatives.length > 0 ? (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {visibleRepresentatives.map((rep) => (
                  <RepresentativeListItem key={rep.id} representative={rep} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No {officeLevelFilter === "all" ? "current" : officeLevelFilter === "city" ? "local" : officeLevelFilter} officeholders were returned for this ZIP code.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <section className="mt-10">
        <div className="flex items-center gap-2">
          <Vote className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">
            Active Candidates — 2026 Michigan Governor&rsquo;s Race
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Michigan&rsquo;s statewide election this cycle, since Gov. Whitmer is
          term-limited.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...activeCandidates, ...otherCandidates].map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Top Civic Issues in Your Area</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Based on recent activity and relevance to {jurisdiction.neighborhood}.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>
    </div>
  );
}
