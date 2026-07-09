import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, ExternalLink, FileCheck2, Landmark, Vote } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { PartyBadge } from "@/components/shared/party-badge";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { SourceList } from "@/components/shared/source-list";
import { PositionMethodology } from "@/components/shared/position-methodology";
import { candidates, getCandidateById } from "@/data/candidates";
import { getIssueById } from "@/data/issues";
import { sources } from "@/data/sources";
import { NOT_AVAILABLE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return candidates.map((c) => ({ id: c.id }));
}

const statusLabel: Record<(typeof candidates)[number]["status"], string> = {
  active: "Active Candidate",
  withdrawn: "Campaign Withdrawn",
  incumbent: "Incumbent",
};

export default async function CandidateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = getCandidateById(id);
  if (!candidate) notFound();

  const relatedSources = sources.filter((s) => candidate.sourceIds.includes(s.id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Leaders & Candidates", href: "/leaders" }, { label: candidate.name }]} />

      <div className="mt-4 flex flex-col items-start gap-5 sm:flex-row">
        <PersonAvatar name={candidate.name} photoUrl={candidate.photoUrl} size="xl" />
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold tracking-tight">{candidate.name}</h1>
          <p className="mt-1 text-lg text-muted-foreground">{candidate.office}</p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <PartyBadge party={candidate.party} />
            <Badge variant="outline">{statusLabel[candidate.status]}</Badge>
            <ConfidenceBadge confidence={candidate.confidence} note={candidate.demoDataNote} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Landmark className="size-4" />
              {candidate.jurisdiction}
            </span>
            <span className="flex items-center gap-1.5">
              <Vote className="size-4" />
              {candidate.election}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              Election Date: {formatDate(candidate.electionDate)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card className="rounded-2xl border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileCheck2 className="size-4.5 text-primary" />
              Filing Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/90">{candidate.filingStatus ?? NOT_AVAILABLE}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle>Official Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {candidate.officialLinks.website && (
              <a
                href={candidate.officialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Official Website <ExternalLink className="size-3.5" />
              </a>
            )}
            {candidate.officialLinks.campaignSite && (
              <a
                href={candidate.officialLinks.campaignSite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Campaign Site <ExternalLink className="size-3.5" />
              </a>
            )}
            {!candidate.officialLinks.website && !candidate.officialLinks.campaignSite && (
              <p className="text-sm text-muted-foreground">{NOT_AVAILABLE}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Position Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-foreground/90">{candidate.positionSummary || NOT_AVAILABLE}</p>
        </CardContent>
      </Card>

      <Card className="mt-5 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Issue Positions</CardTitle>
          <p className="text-sm text-muted-foreground">Only officially published positions are shown.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {candidate.issuePositions.length === 0 && (
            <p className="text-sm text-muted-foreground">{NOT_AVAILABLE}</p>
          )}
          {candidate.issuePositions.map((position) => {
            const issue = getIssueById(position.issueId);
            return (
              <div key={position.issueId} className="border-l-2 border-primary/40 pl-4">
                <Link
                  href={issue ? `/issues/${issue.slug}` : "/issues"}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  {issue?.title ?? position.issueId}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">{position.summary}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <PositionMethodology
        subjectName={candidate.name}
        confidence={candidate.confidence}
        demoDataNote={candidate.demoDataNote}
        sourceCount={relatedSources.length}
      />

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Sources</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Official references used to compile the information on this page.
        </p>
        <div className="mt-4">
          <SourceList sources={relatedSources} />
        </div>
      </section>
    </div>
  );
}
