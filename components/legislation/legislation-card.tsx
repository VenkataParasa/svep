import { ScrollText } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import type { Legislation } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const statusStyles: Record<Legislation["status"], string> = {
  introduced:
    "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300",
  "in committee":
    "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400",
  passed: "border-blue-600/30 bg-blue-600/10 text-blue-700 dark:text-blue-400",
  "signed into law":
    "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  enacted:
    "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
};

export function LegislationCard({ legislation }: { legislation: Legislation }) {
  return (
    <Card className="rounded-2xl border-border/80 shadow-sm">
      <CardHeader className="flex-row items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ScrollText className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">
            {legislation.billNumber}
          </p>
          <h3 className="font-semibold">{legislation.title}</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {legislation.nlpSummaryHtml ? (
          <p
            className="text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: legislation.nlpSummaryHtml }}
          />
        ) : (
          <p className="text-sm text-muted-foreground">{legislation.summary}</p>
        )}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className={statusStyles[legislation.status]}>
            {legislation.status}
          </Badge>
          {/* <ConfidenceBadge confidence={legislation.confidence} note={legislation.demoDataNote} /> */}
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Sponsors: </span>
          {legislation.sponsors.join(", ")}
        </div>
        <div className="text-xs text-muted-foreground">
          Last updated {formatDate(legislation.lastUpdated)}
        </div>
      </CardContent>
    </Card>
  );
}
