"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  FileSearch,
  MapPin,
  ScrollText,
  ShieldQuestion,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { SourceList } from "@/components/shared/source-list";
import { getJurisdictionByZip } from "@/data/jurisdictions";
import { getIssueById } from "@/data/issues";
import { sources } from "@/data/sources";
import { DATA_RETRIEVED_DATE, NOT_AVAILABLE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export function WhyThisInformationContent() {
  const searchParams = useSearchParams();
  const zip = searchParams.get("zip");
  const issueId = searchParams.get("issue");

  const jurisdiction = zip ? getJurisdictionByZip(zip) : undefined;
  const issue = issueId ? getIssueById(issueId) : undefined;

  const governmentOffice = issue
    ? issue.relatedDepartments[0]?.name ?? NOT_AVAILABLE
    : jurisdiction
    ? jurisdiction.governmentOffice
    : NOT_AVAILABLE;

  const lastUpdated = issue?.lastUpdated ?? jurisdiction?.lastUpdated;

  const relatedSources = issue
    ? sources.filter((s) => issue.sourceIds.includes(s.id))
    : jurisdiction
    ? sources.filter((s) =>
        [
          "src-detroitmi-council",
          "src-detroit-opendata-districts",
          "src-mi-senate-chang",
          "src-mi-house-directory",
        ].includes(s.id)
      )
    : [];
  const relatedSourcesCount = relatedSources.length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Why This Information" }]} />
      <div className="mt-4 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldQuestion className="size-5.5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Why am I seeing this information?
          </h1>
          <p className="text-sm text-muted-foreground">
            Full transparency into how this platform personalizes and sources
            civic data.
          </p>
        </div>
      </div>

      <Card className="mt-6 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="size-4.5 text-primary" />
            Your Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">ZIP Code</span>
            <span className="font-medium">{zip ?? "Not provided"}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Jurisdiction</span>
            <span className="text-right font-medium">
              {jurisdiction
                ? `${jurisdiction.neighborhood}, ${jurisdiction.city}`
                : NOT_AVAILABLE}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Selected Issue</span>
            <span className="font-medium">
              {issue ? issue.title : "None selected"}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">
              Government Office Responsible
            </span>
            <span className="text-right font-medium">{governmentOffice}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Official Data Source</span>
            <span className="text-right font-medium">
              {relatedSourcesCount > 0
                ? `${relatedSourcesCount} cataloged source${
                    relatedSourcesCount === 1 ? "" : "s"
                  }`
                : NOT_AVAILABLE}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Date Retrieved</span>
            <span className="font-medium">
              {formatDate(DATA_RETRIEVED_DATE)}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="font-medium">
              {lastUpdated ? formatDate(lastUpdated) : NOT_AVAILABLE}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-5 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BadgeCheck className="size-4.5 text-primary" />
            Confidence Indicator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* {issue && (
            <ConfidenceBadge
              confidence={issue.confidence}
              note={issue.demoDataNote}
            />
          )} */}
          {/* {jurisdiction && (
            <ConfidenceBadge confidence={jurisdiction.councilDistrictConfidence} note={jurisdiction.demoDataNote} />
          )} */}
          {!issue && !jurisdiction && (
            <p className="text-sm text-muted-foreground">
              Select a ZIP code or issue to see its specific confidence rating.
            </p>
          )}
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Verified</span> means
            at least one official .gov, .senate.gov, or .house.gov source
            directly confirms this information.{" "}
            <span className="font-medium text-foreground">Demo Data</span> means
            the record is either a reasonable inference (e.g. a ZIP-to-district
            mapping based on narrative boundary descriptions rather than
            parcel-level GIS data) or illustrative placeholder content, and is
            labeled as such rather than presented as verified fact.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-5 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileSearch className="size-4.5 text-primary" />
            Why This Was Shown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {issue
              ? `This issue was surfaced because it's cataloged as active civic content relevant to Detroit ${
                  jurisdiction
                    ? `and specifically flagged as a top issue for ${jurisdiction.neighborhood}`
                    : "residents"
                }. Its summary, related legislation, and community impact are derived from the official sources listed below.`
              : jurisdiction
              ? `Your representatives and top issues were selected by matching ZIP code ${zip} to its city, state, and federal jurisdictions using the boundary descriptions cataloged in our data layer.`
              : "Provide a ZIP code or select an issue to see a specific explanation of how that content was matched and sourced."}
          </p>
        </CardContent>
      </Card>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <ScrollText className="size-5 text-primary" />
          Sources
        </h2>
        <div className="mt-4">
          <SourceList sources={relatedSources} />
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link
          href="/sources"
          className="font-medium text-primary hover:underline"
        >
          View full Source Transparency table →
        </Link>
        <Link
          href="/audit-trail"
          className="font-medium text-primary hover:underline"
        >
          View Audit Trail →
        </Link>
      </div>
    </div>
  );
}
