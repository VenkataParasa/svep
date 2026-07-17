import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  BriefcaseBusiness,
  ExternalLink,
  FileStack,
  FileText,
  Globe2,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Scale,
  Share2,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { PartyBadge } from "@/components/shared/party-badge";
import { SourceList } from "@/components/shared/source-list";
import { PositionMethodology } from "@/components/shared/position-methodology";
import { SourceCitation } from "@/components/shared/source-citation";
import { SocialIcon } from "@/components/shared/social-icon";
import { ExpandableBiography } from "@/components/shared/expandable-biography";
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
import { formatDate } from "@/lib/utils";
import {
  representativeJurisdictionLabel,
  representativeOfficeLabel,
} from "@/lib/representative-office";
import { getIssueById } from "@/data/issues";
import { getSourceById } from "@/data/sources";

export async function generateStaticParams() {
  try {
    const reps = await db.representative.findMany({ select: { id: true } });
    return reps.map((r) => ({ id: r.id }));
  } catch (error) {
    console.warn(
      "Could not fetch representatives for static generation. Returning empty list."
    );
    return [];
  }
}

const levelLabel: Record<string, string> = {
  federal: "Federal",
  state: "State",
  city: "City",
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

  const profileSources = (() => {
    const merged = new Map<string, Source>();
    for (const source of representative.sources as unknown as Source[]) {
      merged.set(source.id, source);
    }

    const ciceroSource = getSourceById("src-cicero-api");
    if (ciceroSource) merged.set(ciceroSource.id, ciceroSource);

    // Detroit's website is authoritative for Detroit municipal offices, but
    // should not be presented as the authority for state or federal offices.
    const isDetroitMunicipalOfficial =
      representative.level === "city" &&
      /detroit/i.test(
        `${representative.jurisdiction} ${representative.office}`,
      );
    if (isDetroitMunicipalOfficial) {
      const office = representative.office.toLowerCase();
      const detroitSourceId = office.includes("mayor")
        ? "src-detroitmi-mayor"
        : office.includes("council")
          ? "src-detroitmi-council"
          : "src-detroitmi-contact";
      const detroitSource = getSourceById(detroitSourceId);
      if (detroitSource) merged.set(detroitSource.id, detroitSource);
    }

    return [...merged.values()];
  })();

  const officeDetails = {
    office: representative.office,
    level: representative.level,
    jurisdiction: representative.jurisdiction,
    district: representative.district,
  };

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

  const address = [
    representative.addressLine1,
    representative.addressLine2,
    [representative.city, representative.state, representative.zipCode]
      .filter(Boolean)
      .join(" "),
  ]
    .filter(Boolean)
    .join(", ");
  const lastUpdated = representative.sources
    .map((source) => source.lastUpdated)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Officeholders", href: "/leaders" },
          { label: representative.name },
        ]}
      />

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)_320px] xl:grid-cols-[300px_minmax(0,1fr)_340px]">
        <Card className="overflow-hidden rounded-2xl border-border/80 shadow-sm lg:sticky lg:top-24">
          <CardContent className="flex flex-col items-center px-6 pt-2 text-center">
            <PersonAvatar
              name={representative.name}
              photoUrl={
                representative.photoUrl
                  ? `/api/representative-photo/${representative.id}`
                  : undefined
              }
              fallbackUrl={representative.photoUrl || undefined}
              size="xl"
              className="size-44 rounded-2xl sm:size-52 [&_[data-slot=avatar-fallback]]:rounded-2xl [&_[data-slot=avatar-image]]:rounded-2xl"
            />
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-primary">
              {representative.name}
            </h1>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <PartyBadge party={representative.party as unknown as Party} />
              <Badge
                variant="outline"
                className="gap-1 border-primary/25 bg-primary/5 text-primary"
              >
                <BadgeCheck className="size-3.5" /> Current officeholder
              </Badge>
            </div>
            <div className="mt-7 w-full space-y-5 border-t border-border pt-6 text-left">
              <ProfileDetail
                icon={BriefcaseBusiness}
                label="Office"
                value={representativeOfficeLabel(officeDetails)}
              />
              <ProfileDetail
                icon={Landmark}
                label="Jurisdiction"
                value={representativeJurisdictionLabel(officeDetails)}
              />
              <ProfileDetail
                icon={MapPin}
                label="Government level"
                value={`${
                  levelLabel[representative.level] ?? representative.level
                } level`}
              />
            </div>
          </CardContent>
        </Card>

        <main className="space-y-5">
          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-primary">
                <UserRound className="size-5" /> Biography
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
              <ExpandableBiography text={representative.bio || NOT_AVAILABLE} />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-primary">
                <Scale className="size-5" /> Issue Positions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Only officially published positions are shown.
              </p>
            </CardHeader>
            <CardContent>
              {representative.issuePositions.length === 0 ? (
                <p className="text-sm text-muted-foreground">{NOT_AVAILABLE}</p>
              ) : (
                <div className="divide-y divide-border">
                  {representative.issuePositions.map((position) => {
                    const issue = getIssueById(position.issueId);
                    const positionMeta = representative.metadata.find(
                      (m) => m.field === `issuePosition_${position.issueId}`
                    );
                    const fallbackSource = representative.sources[0];
                    return (
                      <div
                        key={position.issueId}
                        className="flex gap-3 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Landmark className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <Link
                              href={issue ? `/issues/${issue.slug}` : "/issues"}
                              className="font-semibold text-primary hover:underline"
                            >
                              {issue?.title ?? position.issueId}
                            </Link>
                            <SourceCitation
                              field={`Issue Position: ${
                                issue?.title ?? position.issueId
                              }`}
                              sourceName={
                                positionMeta?.source.name ||
                                fallbackSource?.name
                              }
                              sourceUrl={
                                positionMeta?.source.url || fallbackSource?.url
                              }
                              confidenceScore={
                                positionMeta?.confidenceScore || 90
                              }
                              lastUpdated={
                                positionMeta?.lastUpdated ||
                                fallbackSource?.lastUpdated
                              }
                            />
                          </div>
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
                <UserRound className="size-5" /> Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {representative.contactEmail && (
                <ProfileDetail
                  icon={Mail}
                  label="Email"
                  value={representative.contactEmail}
                />
              )}
              {representative.contactPhone && (
                <ProfileDetail
                  icon={Phone}
                  label="Phone"
                  value={representative.contactPhone}
                />
              )}
              {address && (
                <ProfileDetail icon={MapPin} label="Address" value={address} />
              )}
              {!representative.contactEmail &&
                !representative.contactPhone &&
                !address && (
                  <p className="text-sm text-muted-foreground">
                    {NOT_AVAILABLE}
                  </p>
                )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-primary">
                <Globe2 className="size-5" /> Website
              </CardTitle>
            </CardHeader>
            <CardContent>
              {representative.contactWebsite ? (
                <a
                  href={representative.contactWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-2 break-all text-sm font-medium text-primary hover:underline"
                >
                  <span>{representative.contactWebsite}</span>
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
                <Share2 className="size-5" /> Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {socialLinks.length > 0 ? (
                socialLinks.map((social) => (
                  <a
                    key={`${social.label}-${social.url}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-primary/40 hover:bg-primary/10"
                  >
                    <SocialIcon platform={social.label} className="size-5" />
                  </a>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{NOT_AVAILABLE}</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-primary">
                <FileText className="size-5" /> Official Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SourceList
                sources={profileSources}
              />
            </CardContent>
          </Card>
        </aside>
      </div>

      <PositionMethodology
        subjectName={representative.name}
        confidence={representative.confidence as unknown as Confidence}
        demoDataNote={representative.demoDataNote || undefined}
        sourceCount={profileSources.length}
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

      {/* <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <ShieldCheck className="size-5 shrink-0 text-primary" />
          <p>Information is collected from linked public sources for voter education. Verify details through the official sources above.</p>
        </div>
        {lastUpdated && <p className="shrink-0">Data updated {formatDate(lastUpdated.toISOString())}</p>}
      </div> */}
    </div>
  );
}
