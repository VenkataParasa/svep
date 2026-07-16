import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  BriefcaseBusiness,
  CalendarClock,
  ExternalLink,
  FileText,
  Globe2,
  Landmark,
  ScrollText,
  Scale,
  UserRound,
  Vote,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { PartyBadge } from "@/components/shared/party-badge";
import { SourceList } from "@/components/shared/source-list";
import { PositionMethodology } from "@/components/shared/position-methodology";
import { LegislationCard } from "@/components/legislation/legislation-card";
import { getCandidateById, getRaceById } from "@/data/candidates";
import { getSourceById } from "@/data/sources";
import { getIssueById } from "@/data/issues";
import { getLegislationById } from "@/data/legislation";
import type { Source } from "@/lib/types";
import { NOT_AVAILABLE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-static";

const statusLabel: Record<string, string> = {
  active: "Active Candidate",
  withdrawn: "Campaign Withdrawn",
  incumbent: "Incumbent",
};

const statusStyles: Record<string, string> = {
  active:
    "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  withdrawn:
    "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300",
  incumbent:
    "border-blue-600/30 bg-blue-600/10 text-blue-700 dark:text-blue-400",
};

function ProfileDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm font-medium leading-snug">
          {value}
        </p>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const candidate = getCandidateById(id);
  return {
    title: candidate
      ? `${candidate.name} — Candidate Profile | City of Detroit Voter Education Platform`
      : "Candidate Not Found",
  };
}

export default async function CandidateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = getCandidateById(id);
  if (!candidate) notFound();

  const race = getRaceById(candidate.raceId);
  const sources = candidate.sourceIds
    .map((sourceId) => getSourceById(sourceId))
    .filter((source): source is Source => Boolean(source));
  const sponsoredLegislation = (candidate.legislationIds ?? [])
    .map((legislationId) => getLegislationById(legislationId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Jurisdiction Dashboard", href: "/dashboard" },
          { label: candidate.name },
        ]}
      />

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)_320px] xl:grid-cols-[300px_minmax(0,1fr)_340px]">
        <Card className="overflow-hidden rounded-2xl border-border/80 shadow-sm lg:sticky lg:top-24">
          <CardContent className="flex flex-col items-center px-6 pt-2 text-center">
            <PersonAvatar
              name={candidate.name}
              photoUrl={candidate.photoUrl || undefined}
              size="xl"
              className="size-44 rounded-2xl sm:size-52 [&_[data-slot=avatar-fallback]]:rounded-2xl [&_[data-slot=avatar-image]]:rounded-2xl"
            />
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-primary">
              {candidate.name}
            </h1>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <PartyBadge party={candidate.party} />
              <Badge
                variant="outline"
                className={`gap-1 ${statusStyles[candidate.status]}`}
              >
                <Vote className="size-3.5" />
                {statusLabel[candidate.status] ?? candidate.status}
              </Badge>
            </div>
            <div className="mt-7 w-full space-y-5 border-t border-border pt-6 text-left">
              <ProfileDetail
                icon={BriefcaseBusiness}
                label="Office sought"
                value={candidate.office}
              />
              <ProfileDetail
                icon={Landmark}
                label="Jurisdiction"
                value={candidate.jurisdiction}
              />
              {candidate.filingStatus && (
                <ProfileDetail
                  icon={CalendarClock}
                  label="Filing status"
                  value={candidate.filingStatus}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <main className="space-y-5">
          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-primary">
                <UserRound className="size-5" /> Campaign Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-6 text-muted-foreground">
                {candidate.positionSummary || NOT_AVAILABLE}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-primary">
                <Scale className="size-5" /> Issue Positions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Only publicly documented positions are shown.
              </p>
            </CardHeader>
            <CardContent>
              {candidate.issuePositions.length === 0 ? (
                <p className="text-sm text-muted-foreground">{NOT_AVAILABLE}</p>
              ) : (
                <div className="divide-y divide-border">
                  {candidate.issuePositions.map((position) => {
                    const issue = getIssueById(position.issueId);
                    return (
                      <div
                        key={position.issueId}
                        className="flex gap-3 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Landmark className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={issue ? `/issues/${issue.slug}` : "/issues"}
                            className="font-semibold text-primary hover:underline"
                          >
                            {issue?.title ?? position.issueId}
                          </Link>
                          <p className="mt-1 leading-6 text-muted-foreground">
                            {position.summary}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        <aside className="space-y-5">
          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-primary">
                <Vote className="size-5" /> Election
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfileDetail
                icon={FileText}
                label="Race"
                value={candidate.election}
              />
              {race && (
                <>
                  <ProfileDetail
                    icon={CalendarClock}
                    label="Primary election"
                    value={formatDate(race.primaryDate)}
                  />
                  <ProfileDetail
                    icon={CalendarClock}
                    label="General election"
                    value={formatDate(race.generalDate)}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-primary">
                <Globe2 className="size-5" /> Campaign Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {candidate.officialLinks.website ? (
                <a
                  href={candidate.officialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-2 break-all text-sm font-medium text-primary hover:underline"
                >
                  <span>{candidate.officialLinks.website}</span>
                  <ExternalLink className="mt-0.5 size-4 shrink-0" />
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">{NOT_AVAILABLE}</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-primary">
                <FileText className="size-5" /> Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SourceList sources={sources} />
            </CardContent>
          </Card>
        </aside>
      </div>

      <PositionMethodology
        subjectName={candidate.name}
        confidence={candidate.confidence}
        demoDataNote={candidate.demoDataNote}
        sourceCount={sources.length}
      />

      {sponsoredLegislation.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <ScrollText className="size-5 text-primary" />
            Related Legislation
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Bills and resolutions {candidate.name} has personally sponsored or
            cosponsored as a current or former legislator.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sponsoredLegislation.map((item) => (
              <LegislationCard key={item.id} legislation={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
