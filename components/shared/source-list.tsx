import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Source } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const verificationStyles: Record<Source["verificationStatus"], string> = {
  verified: "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  pending: "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400",
  unverified: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300",
};

export function SourceList({ sources, className }: { sources: Source[]; className?: string }) {
  if (sources.length === 0) {
    return <p className="text-sm text-muted-foreground">No sources cataloged for this record yet.</p>;
  }

  return (
    <ul className={cn("space-y-2", className)}>
      {sources.map((source) => (
        <li key={source.id}>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-accent/40"
          >
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-medium">
                {source.name}
                <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{source.url}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Updated {formatDate(source.lastUpdated)}</p>
            </div>
            <Badge variant="outline" className={cn("shrink-0 font-medium", verificationStyles[source.verificationStatus])}>
              {source.verificationStatus}
            </Badge>
          </a>
        </li>
      ))}
    </ul>
  );
}
