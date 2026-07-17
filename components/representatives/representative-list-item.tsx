import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { PartyBadge } from "@/components/shared/party-badge";
import type { Representative } from "@/lib/types";

export function RepresentativeListItem({
  representative,
  officeAsTag = false,
}: {
  representative: Pick<Representative, "id" | "name" | "office" | "party" | "photoUrl"> & { fallbackPhotoUrl?: string };
  officeAsTag?: boolean;
}) {
  const isDirectUrl = representative.photoUrl?.startsWith("http");
  const proxyUrl = representative.id ? `/api/representative-photo/${representative.id}` : undefined;
  
  const primaryUrl = representative.fallbackPhotoUrl 
    ? representative.photoUrl 
    : (isDirectUrl ? proxyUrl : representative.photoUrl);
    
  const secondaryUrl = representative.fallbackPhotoUrl 
    || (isDirectUrl ? representative.photoUrl : undefined);

  return (
    <Link
      href={`/representatives/${representative.id}`}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-accent/40"
    >
      <PersonAvatar
        name={representative.name}
        photoUrl={primaryUrl || undefined}
        fallbackUrl={secondaryUrl || undefined}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium">{representative.name}</span>
          <PartyBadge
            party={representative.party}
            className="h-5 px-1.5 text-[11px]"
          />
        </div>
        <p
          className={
            officeAsTag
              ? "mt-1.5 inline-flex max-w-full rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs font-medium text-muted-foreground"
              : "truncate text-sm text-muted-foreground"
          }
        >
          {representative.office}
        </p>
      </div>
      {/* <ConfidenceBadge confidence={representative.confidence} note={representative.demoDataNote} className="hidden sm:inline-flex" /> */}
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
