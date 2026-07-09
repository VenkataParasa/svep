import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Landmark, Mail, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { PartyBadge } from "@/components/shared/party-badge";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { SourceList } from "@/components/shared/source-list";
import { PositionMethodology } from "@/components/shared/position-methodology";
import { representatives, getRepresentativeById } from "@/data/representatives";
import { getIssueById } from "@/data/issues";
import { sources } from "@/data/sources";
import { NOT_AVAILABLE } from "@/lib/constants";

export function generateStaticParams() {
  return representatives.map((r) => ({ id: r.id }));
}

const levelLabel: Record<(typeof representatives)[number]["level"], string> = {
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
  const representative = getRepresentativeById(id);
  if (!representative) notFound();

  const relatedSources = sources.filter((s) => representative.sourceIds.includes(s.id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Leaders & Candidates", href: "/leaders" }, { label: representative.name }]} />

      <div className="mt-4 flex flex-col items-start gap-5 sm:flex-row">
        <PersonAvatar name={representative.name} photoUrl={representative.photoUrl} size="xl" />
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold tracking-tight">{representative.name}</h1>
          <p className="mt-1 text-lg text-muted-foreground">{representative.office}</p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <PartyBadge party={representative.party} />
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {levelLabel[representative.level]} Level
            </span>
            <ConfidenceBadge confidence={representative.confidence} note={representative.demoDataNote} />
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Landmark className="size-4" />
            {representative.jurisdiction}
          </p>
        </div>
      </div>

      <Card className="mt-8 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Biography</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-foreground/90">{representative.bio || NOT_AVAILABLE}</p>
        </CardContent>
      </Card>

      <Card className="mt-5 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Responsibilities</CardTitle>
        </CardHeader>
        <CardContent>
          {representative.responsibilities.length === 0 ? (
            <p className="text-sm text-muted-foreground">{NOT_AVAILABLE}</p>
          ) : (
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground/90">
              {representative.responsibilities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="mt-5 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Current Initiatives</CardTitle>
        </CardHeader>
        <CardContent>
          {representative.initiatives.length === 0 ? (
            <p className="text-sm text-muted-foreground">{NOT_AVAILABLE}</p>
          ) : (
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground/90">
              {representative.initiatives.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="mt-5 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Issue Positions</CardTitle>
          <p className="text-sm text-muted-foreground">Only officially published positions are shown.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {representative.issuePositions.length === 0 && (
            <p className="text-sm text-muted-foreground">{NOT_AVAILABLE}</p>
          )}
          {representative.issuePositions.map((position) => {
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

      <Card className="mt-5 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 text-sm">
          {representative.contact.website && (
            <a
              href={representative.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              Official Website <ExternalLink className="size-3.5" />
            </a>
          )}
          {representative.contact.phone && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Phone className="size-4" />
              {representative.contact.phone}
            </span>
          )}
          {representative.contact.email && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Mail className="size-4" />
              {representative.contact.email}
            </span>
          )}
          {!representative.contact.website && !representative.contact.phone && !representative.contact.email && (
            <span className="text-muted-foreground">{NOT_AVAILABLE}</span>
          )}
        </CardContent>
      </Card>

      <PositionMethodology
        subjectName={representative.name}
        confidence={representative.confidence}
        demoDataNote={representative.demoDataNote}
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
