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
import { getIssueById } from "@/data/issues";
import { sources } from "@/data/sources";
import { DATA_RETRIEVED_DATE, NOT_AVAILABLE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { useZipContextStore } from "@/store/zip-context-store";

export function WhyThisInformationContent() {
  const searchParams = useSearchParams();
  const zip = searchParams.get("zip");
  const issueId = searchParams.get("issue");
  const savedLocation = useZipContextStore((state) => state.location);

  const issue = issueId ? getIssueById(issueId) : undefined;

  const governmentOffice = issue
    ? issue.relatedDepartments[0]?.name ?? NOT_AVAILABLE
    : "Resolved dynamically through Cicero";

  const lastUpdated = issue?.lastUpdated;

  const relatedSources = issue
    ? sources.filter((s) => issue.sourceIds.includes(s.id))
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
              {savedLocation ?? zip ?? NOT_AVAILABLE}
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
          {!issue && !savedLocation && (
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
              ? "This issue is cataloged as active civic content. Its summary, related legislation, and community impact are derived from the sources listed below."
              : savedLocation
                ? `Your jurisdictions and representatives were resolved dynamically from ${savedLocation} through Cicero's address-level boundary matching.`
                : "Provide an address, ZIP code, or select an issue to see how that content was matched and sourced."}
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
