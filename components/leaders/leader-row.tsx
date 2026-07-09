import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { PartyBadge } from "@/components/shared/party-badge";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import type { Confidence, Party } from "@/lib/types";

// Horizontal directory row: photo/avatar on one side, official
// information on the other. Photos are placeholder initials unless a
// directly-confirmed official image URL exists (none were confirmed
// during research — real names, no invented images).
export function LeaderRow({
  href,
  name,
  photoUrl,
  office,
  jurisdiction,
  party,
  confidence,
  demoDataNote,
  summary,
  tag,
}: {
  href: string;
  name: string;
  photoUrl?: string;
  office: string;
  jurisdiction: string;
  party: Party;
  confidence: Confidence;
  demoDataNote?: string;
  summary: string;
  tag?: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="rounded-2xl border-border/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center justify-center sm:w-32">
            <PersonAvatar name={name} photoUrl={photoUrl} size="xl" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-lg font-semibold">{name}</h3>
              <PartyBadge party={party} />
              {tag && <Badge variant="outline">{tag}</Badge>}
              <ConfidenceBadge confidence={confidence} note={demoDataNote} />
            </div>
            <p className="mt-0.5 font-medium text-primary">{office}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Landmark className="size-3.5 shrink-0" />
              {jurisdiction}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{summary}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
              View full profile
              <ArrowRight className="size-3.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
