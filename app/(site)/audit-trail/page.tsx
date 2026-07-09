import { CheckCircle2, CircleAlert, CircleX } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auditRecords } from "@/data/audit-records";
import type { AuditStage } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";

const stageOrder: AuditStage[] = ["retrieved", "verified", "processed", "displayed"];

const stageLabel: Record<AuditStage, string> = {
  retrieved: "Data Retrieved",
  verified: "Verified",
  processed: "Processed",
  displayed: "Displayed",
};

const statusIcon = {
  success: CheckCircle2,
  warning: CircleAlert,
  error: CircleX,
};

const statusColor = {
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  error: "text-red-600 dark:text-red-400",
};

export default function AuditTrailPage() {
  const grouped = new Map<string, typeof auditRecords>();
  for (const record of auditRecords) {
    const key = `${record.entityType}:${record.entityId}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(record);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Audit Trail" }]} />
      <div className="mt-4">
        <h1 className="text-3xl font-semibold tracking-tight">Audit Trail</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Full data lineage for a representative sample of records — from retrieval through
          verification, processing, and display.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {[...grouped.entries()].map(([key, records]) => {
          const sorted = [...records].sort(
            (a, b) => stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage)
          );
          return (
            <Card key={key} className="rounded-2xl border-border/80 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">{sorted[0].entityLabel}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="relative space-y-6 border-l border-border pl-6">
                  {sorted.map((record) => {
                    const Icon = statusIcon[record.status];
                    return (
                      <li key={record.id} className="relative">
                        <span
                          className={cn(
                            "absolute -left-[1.85rem] flex size-6 items-center justify-center rounded-full bg-background",
                            statusColor[record.status]
                          )}
                        >
                          <Icon className="size-5" />
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{stageLabel[record.stage]}</span>
                          <Badge variant="outline" className="text-xs">
                            {record.version}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">{record.source}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{formatDateTime(record.timestamp)}</p>
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
