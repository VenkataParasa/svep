import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { PartyBadge } from "@/components/shared/party-badge";
import { Badge } from "@/components/ui/badge";
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

export function CandidateListItem({
  candidate,
}: {
  candidate: Pick<
    Candidate,
    "id" | "name" | "party" | "photoUrl" | "status" | "filingStatus"
  >;
}) {
  return (
    <Link
      href={`/candidates/${candidate.id}`}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-accent/40"
    >
      <PersonAvatar
        name={candidate.name}
        photoUrl={`/api/candidate-photo/${candidate.id}`}
        fallbackUrl={candidate.photoUrl || undefined}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium">{candidate.name}</span>
          <PartyBadge party={candidate.party} className="h-5 px-1.5 text-[11px]" />
        </div>
        <p className="mt-1.5 flex items-center gap-1.5">
          <Badge
            variant="outline"
            className={cn("h-5 px-1.5 text-[11px] font-medium", statusStyles[candidate.status])}
          >
            {candidate.status === "active" ? "Active Candidate" : candidate.status}
          </Badge>
          {candidate.filingStatus && (
            <span className="truncate text-xs text-muted-foreground">
              {candidate.filingStatus}
            </span>
          )}
        </p>
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
