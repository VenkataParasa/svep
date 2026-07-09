"use client";

import * as React from "react";
import { CheckCircle2, CircleAlert, CircleX, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auditRecords } from "@/data/audit-records";
import { cn, formatDateTime } from "@/lib/utils";

const statusIcon = { success: CheckCircle2, warning: CircleAlert, error: CircleX };
const statusColor = {
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  error: "text-red-600 dark:text-red-400",
};

export default function LogsPage() {
  const [query, setQuery] = React.useState("");

  const sorted = [...auditRecords].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const filtered = sorted.filter(
    (r) =>
      r.entityLabel.toLowerCase().includes(query.trim().toLowerCase()) ||
      r.source.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">System Logs</h1>
      <p className="mt-1 text-muted-foreground">
        Raw pipeline log entries backing the public Audit Trail view.
      </p>

      <div className="relative mt-6 max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search logs..." className="pl-9" />
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((record) => {
              const Icon = statusIcon[record.status];
              return (
                <TableRow key={record.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDateTime(record.timestamp)}
                  </TableCell>
                  <TableCell className="font-medium">{record.entityLabel}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">{record.stage}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">{record.source}</TableCell>
                  <TableCell className="text-muted-foreground">{record.version}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("gap-1 font-medium", statusColor[record.status])}>
                      <Icon className="size-3.5" />
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No log entries match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
