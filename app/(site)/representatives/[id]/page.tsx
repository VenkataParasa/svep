import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Landmark, Mail, Phone, FileStack } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { PartyBadge } from "@/components/shared/party-badge";
import { SourceList } from "@/components/shared/source-list";
import { PositionMethodology } from "@/components/shared/position-methodology";
import { SourceCitation } from "@/components/shared/source-citation";
import { SocialIcon } from "@/components/shared/social-icon";
import { LegislationCard } from "@/components/legislation/legislation-card";
import { PublicDocumentsList } from "@/components/shared/public-documents-list";
import { prisma as db } from "@/lib/prisma";
import type {
  Confidence,
  Party,
  Source,
  Legislation,
  PublicDocument,
} from "@/lib/types";
import { NOT_AVAILABLE } from "@/lib/constants";
import { getIssueById } from "@/data/issues";

export async function generateStaticParams() {
  try {
    const reps = await db.representative.findMany({ select: { id: true } });
    return reps.map((r) => ({ id: r.id }));
  } catch (error) {
    console.warn("Could not fetch representatives for static generation. Returning empty list.");
    return [];
  }
}

const levelLabel: Record<string, string> = {
  federal: "Federal",
  state: "State",
  city: "City",
};

export default async function RepresentativeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id.startsWith("rep-cicero-")) notFound();

  const representative = await db.representative.findUnique({
    where: { id },
    include: {
      sources: true,
      issuePositions: true,
      issues: {
        include: {
          legislation: true,
          publicDocuments: true,
        },
      },
      metadata: {
        include: { source: true },
      },
    },
  });

  if (!representative) notFound();

  const socialLinks = (() => {
    try {
      return JSON.parse(representative.socialLinks ?? "[]") as Array<{
        label: string;
        url: string;
      }>;
    } catch {
      return [];
    }
  })();

  // Find metadata specifically for the biography if available
  const bioMeta = representative.metadata.find((m) => m.field === "bio");

  // Aggregate legislation and public documents from related issues
  const allLegislation = representative.issues.flatMap(
    (issue) => issue.legislation
  );
  const uniqueLegislation = Array.from(
    new Map(allLegislation.map((leg) => [leg.id, leg])).values()
  );

  const allDocuments = representative.issues.flatMap(
    (issue) => issue.publicDocuments
  );
  const uniqueDocuments = Array.from(
    new Map(allDocuments.map((doc) => [doc.id, doc])).values()
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Officeholders", href: "/leaders" },
          { label: representative.name },
        ]}
      />

      <div className="mt-4 flex flex-col items-start gap-5 sm:flex-row">
        <PersonAvatar
          name={representative.name}
          photoUrl={
            representative.photoUrl
              ? `/api/representative-photo/${representative.id}`
              : undefined
          }
          size="xl"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            {representative.name}
          </h1>
          <p className="mt-1 text-lg text-muted-foreground">
            {representative.office}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <PartyBadge party={representative.party as unknown as Party} />
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {levelLabel[representative.level]} Level
            </span>
            {/* <ConfidenceBadge confidence={representative.confidence as unknown as Confidence} note={representative.demoDataNote || undefined} /> */}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Landmark className="size-4" />
            {representative.jurisdiction}
          </p>
        </div>
      </div>

      <Card className="mt-8 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            Biography
            {bioMeta && (
              <SourceCitation
                field="Biography"
                sourceName={bioMeta.source.name}
                sourceUrl={bioMeta.source.url}
                confidenceScore={bioMeta.confidenceScore}
                lastUpdated={bioMeta.lastUpdated}
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {representative.nlpBioHtml ? (
            <p
              className="leading-relaxed text-foreground/90"
              dangerouslySetInnerHTML={{ __html: representative.nlpBioHtml }}
            />
          ) : (
            <p className="leading-relaxed text-foreground/90">
              {representative.bio || NOT_AVAILABLE}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-5 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Issue Positions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Only officially published positions are shown.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {representative.issuePositions.length === 0 && (
            <p className="text-sm text-muted-foreground">{NOT_AVAILABLE}</p>
          )}
          {representative.issuePositions.map((position) => {
            const issue = getIssueById(position.issueId);
            // In a real app we'd map this to a specific metadata record for this issue position.
            // For now, we'll pick the first source as a generic citation demo if a specific one isn't found.
            const positionMeta = representative.metadata.find(
              (m) => m.field === `issuePosition_${position.issueId}`
            );
            const fallbackSource = representative.sources[0];

            return (
              <div
                key={position.issueId}
                className="border-l-2 border-primary/40 pl-4"
              >
                <div className="flex items-center gap-2">
                  <Link
                    href={issue ? `/issues/${issue.slug}` : "/issues"}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {issue?.title ?? position.issueId}
                  </Link>
                  <SourceCitation
                    field={`Issue Position: ${issue?.title ?? position.issueId
                      }`}
                    sourceName={
                      positionMeta?.source.name || fallbackSource?.name
                    }
                    sourceUrl={positionMeta?.source.url || fallbackSource?.url}
                    confidenceScore={positionMeta?.confidenceScore || 90}
                    lastUpdated={
                      positionMeta?.lastUpdated || fallbackSource?.lastUpdated
                    }
                  />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {position.summary}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="mt-5 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 text-sm">
          {representative.contactWebsite && (
            <a
              href={representative.contactWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              Official Website <ExternalLink className="size-3.5" />
            </a>
          )}
          {representative.contactPhone && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Phone className="size-4" />
              {representative.contactPhone}
            </span>
          )}
          {representative.contactEmail && (
            <a
              href={`mailto:${representative.contactEmail}`}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary"
            >
              <Mail className="size-4" />
              {representative.contactEmail}
            </a>
          )}
          {socialLinks.map((social) => (
            <a
              key={`${social.label}-${social.url}`}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-primary/40 hover:bg-primary/10"
            >
              <SocialIcon platform={social.label} />
            </a>
          ))}
          {!representative.contactWebsite &&
            !representative.contactPhone &&
            !representative.contactEmail &&
            socialLinks.length === 0 && (
              <span className="text-muted-foreground">{NOT_AVAILABLE}</span>
            )}
        </CardContent>
      </Card>

      <PositionMethodology
        subjectName={representative.name}
        confidence={representative.confidence as unknown as Confidence}
        demoDataNote={representative.demoDataNote || undefined}
        sourceCount={representative.sources.length}
      />

      {uniqueLegislation.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Related Legislation</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Bills and legislation tied to the civic issues {representative.name}{" "}
            is involved in.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {uniqueLegislation.map((leg) => {
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

      {uniqueDocuments.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <FileStack className="size-5 text-primary" />
            Relevant Public Records
          </h2>
          <p className="mt-1 text-sm text-muted-foreground mb-4">
            Official documents, meeting minutes, and records related to their
            civic issues.
          </p>
          <PublicDocumentsList
            documents={uniqueDocuments as unknown as PublicDocument[]}
          />
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Sources</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Official references used to compile the information on this page.
        </p>
        <div className="mt-4">
          <SourceList sources={representative.sources as unknown as Source[]} />
        </div>
      </section>
    </div>
  );
}
