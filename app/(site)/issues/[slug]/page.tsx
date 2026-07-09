import { notFound } from "next/navigation";
import Link from "next/link";
import { Building2, FileStack, HelpCircle, Users2, Vote } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IssueIcon } from "@/components/issues/issue-icon";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { RepresentativeListItem } from "@/components/representatives/representative-list-item";
import { CandidateCard } from "@/components/candidates/candidate-card";
import { LegislationCard } from "@/components/legislation/legislation-card";
import { SourceList } from "@/components/shared/source-list";
import { PublicDocumentsList } from "@/components/shared/public-documents-list";
import { issues, getIssueBySlug } from "@/data/issues";
import { getRepresentativeById } from "@/data/representatives";
import { getCandidateById } from "@/data/candidates";
import { getLegislationById } from "@/data/legislation";
import { sources } from "@/data/sources";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return issues.map((issue) => ({ slug: issue.slug }));
}

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);
  if (!issue) notFound();

  const relatedLegislation = issue.legislationIds.map(getLegislationById).filter((l): l is NonNullable<typeof l> => Boolean(l));
  const relatedReps = issue.representativeIds.map(getRepresentativeById).filter((r): r is NonNullable<typeof r> => Boolean(r));
  const relatedCandidates = issue.candidateIds.map(getCandidateById).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const relatedSources = sources.filter((s) => issue.sourceIds.includes(s.id));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Issues", href: "/issues" }, { label: issue.title }]} />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <IssueIcon name={issue.icon} className="size-7" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{issue.title}</h1>
            <p className="mt-1 max-w-2xl text-muted-foreground">{issue.summary}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ConfidenceBadge confidence={issue.confidence} note={issue.demoDataNote} />
              <span className="text-xs text-muted-foreground">Last updated {formatDate(issue.lastUpdated)}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl" render={<Link href={`/why-this-information?issue=${issue.id}`} />}>
          <HelpCircle className="size-4" />
          Why am I seeing this?
        </Button>
      </div>

      <Card className="mt-8 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Plain-Language Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-foreground/90">{issue.plainLanguageSummary}</p>
        </CardContent>
      </Card>

      <Card className="mt-5 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Community Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-foreground/90">{issue.communityImpact}</p>
        </CardContent>
      </Card>

      {issue.relatedDepartments.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Building2 className="size-5 text-primary" />
            Related Departments
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {issue.relatedDepartments.map((dept) =>
              dept.url ? (
                <a
                  key={dept.name}
                  href={dept.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-accent/40"
                >
                  {dept.name}
                </a>
              ) : (
                <span
                  key={dept.name}
                  className="rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-sm font-medium text-muted-foreground"
                >
                  {dept.name}
                </span>
              )
            )}
          </div>
        </section>
      )}

      {relatedLegislation.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Related Legislation</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relatedLegislation.map((leg) => (
              <LegislationCard key={leg.id} legislation={leg} />
            ))}
          </div>
        </section>
      )}

      {relatedReps.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Users2 className="size-5 text-primary" />
            Representatives Involved
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {relatedReps.map((rep) => (
              <RepresentativeListItem key={rep.id} representative={rep} />
            ))}
          </div>
        </section>
      )}

      {relatedCandidates.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Vote className="size-5 text-primary" />
            Candidates Involved
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relatedCandidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <FileStack className="size-5 text-primary" />
          Public Documents
        </h2>
        <div className="mt-4">
          <PublicDocumentsList documents={issue.publicDocuments} />
        </div>
      </section>

      <section className="mt-10">
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
