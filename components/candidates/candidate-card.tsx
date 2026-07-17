import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { PartyBadge } from "@/components/shared/party-badge";
import type { Candidate } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<Candidate["status"], string> = {
  active:
    "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  withdrawn:
    "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300",
  incumbent:
    "border-blue-600/30 bg-blue-600/10 text-blue-700 dark:text-blue-400",
};

const statusLabel: Record<Candidate["status"], string> = {
  active: "Active Candidate",
  withdrawn: "Campaign Withdrawn",
  incumbent: "Incumbent",
};

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <Link href={`/candidates/${candidate.id}`} className="block h-full">
      <Card className="h-full rounded-2xl border-border/80 shadow-sm transition-shadow hover:shadow-md">
        <CardHeader className="flex-row items-start gap-3">
          <PersonAvatar
            name={candidate.name}
            photoUrl={`/api/candidate-photo/${candidate.id}`}
            fallbackUrl={candidate.photoUrl || undefined}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <div className="font-semibold">{candidate.name}</div>
            <p className="text-sm text-muted-foreground">{candidate.office}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <PartyBadge party={candidate.party} />
              <Badge
                variant="outline"
                className={cn("font-medium", statusStyles[candidate.status])}
              >
                {statusLabel[candidate.status]}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {candidate.positionSummary}
          </p>
          <div className="mt-3">
            {/* <ConfidenceBadge confidence={candidate.confidence} note={candidate.demoDataNote} /> */}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
