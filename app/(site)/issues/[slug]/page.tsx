import { notFound } from "next/navigation";
import Link from "next/link";
import { Building2, FileStack, HelpCircle, Users2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IssueIcon } from "@/components/issues/issue-icon";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { RepresentativeListItem } from "@/components/representatives/representative-list-item";
import { LegislationCard } from "@/components/legislation/legislation-card";
import { SourceList } from "@/components/shared/source-list";
import { PublicDocumentsList } from "@/components/shared/public-documents-list";
import { formatDate } from "@/lib/utils";
import { prisma as db } from "@/lib/prisma";
import type {
  Confidence,
  Legislation,
  PublicDocument,
  Representative,
  Source,
} from "@/lib/types";

export async function generateStaticParams() {
  const issues = await db.issue.findMany({ select: { slug: true } });
  return issues.map((issue) => ({ slug: issue.slug }));
}

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const issue = await db.issue.findUnique({
    where: { slug },
    include: {
      departments: true,
      publicDocuments: true,
      representatives: true,
      sources: true,
      legislation: true,
    },
  });

  if (!issue) notFound();

  const relatedLegislation = issue.legislation;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[{ label: "Issues", href: "/issues" }, { label: issue.title }]}
      />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <IssueIcon name={issue.icon} className="size-7" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {issue.title}
            </h1>
            <p className="mt-1 max-w-2xl text-muted-foreground">
              {issue.summary}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {/* <ConfidenceBadge confidence={issue.confidence as unknown as Confidence} note={issue.demoDataNote || undefined} /> */}
              <span className="text-xs text-muted-foreground">
                Last updated {formatDate(issue.lastUpdated.toISOString())}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-xl"
          render={<Link href={`/why-this-information?issue=${issue.id}`} />}
        >
          <HelpCircle className="size-4" />
          Why am I seeing this?
        </Button>
      </div>

      <Card className="mt-8 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Plain-Language Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {issue.nlpSummaryHtml ? (
            <p
              className="leading-relaxed text-foreground/90"
              dangerouslySetInnerHTML={{ __html: issue.nlpSummaryHtml }}
            />
          ) : (
            <p className="leading-relaxed text-foreground/90">
              {issue.plainLanguageSummary}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-5 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Community Impact</CardTitle>
        </CardHeader>
        <CardContent>
          {issue.nlpCommunityImpactHtml ? (
            <p
              className="leading-relaxed text-foreground/90"
              dangerouslySetInnerHTML={{ __html: issue.nlpCommunityImpactHtml }}
            />
          ) : (
            <p className="leading-relaxed text-foreground/90">
              {issue.communityImpact}
            </p>
          )}
        </CardContent>
      </Card>

      {issue.departments.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Building2 className="size-5 text-primary" />
            Related Departments
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {issue.departments.map((dept) =>
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
            {relatedLegislation.map((leg) => {
              const formattedLeg = {
                ...leg,
                sponsors: JSON.parse(leg.sponsors),
                lastUpdated: leg.lastUpdated.toISOString(),
              };
              return (
                <LegislationCard
                  key={leg.id}
                  legislation={formattedLeg as unknown as Legislation}
                />
              );
            })}
          </div>
        </section>
      )}

      {issue.representatives.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Users2 className="size-5 text-primary" />
            Representatives Involved
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {issue.representatives.map((rep) => (
              <RepresentativeListItem
                key={rep.id}
                representative={rep as unknown as Representative}
              />
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
          <PublicDocumentsList
            documents={issue.publicDocuments as unknown as PublicDocument[]}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Sources</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Official references used to compile the information on this page.
        </p>
        <div className="mt-4">
          <SourceList sources={issue.sources as unknown as Source[]} />
        </div>
      </section>
    </div>
  );
}
