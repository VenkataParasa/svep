"use client";

import * as React from "react";
import Link from "next/link";
import { Activity, FileStack, ListChecks, Users, Vote } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMockDataStore } from "@/store/mock-data-store";
import { sources } from "@/data/sources";
import type { ApiServiceStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<ApiServiceStatus["status"], string> = {
  operational: "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  degraded: "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400",
  outage: "border-red-600/30 bg-red-600/10 text-red-700 dark:text-red-400",
};

export default function AdminDashboardPage() {
  const issues = useMockDataStore((s) => s.issues);
  const candidates = useMockDataStore((s) => s.candidates);
  const representatives = useMockDataStore((s) => s.representatives);
  const [services, setServices] = React.useState<ApiServiceStatus[] | null>(null);

  React.useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((json) => setServices(json.data))
      .catch(() => setServices(null));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Overview of platform content and system health.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Issues" value={issues.length} icon={ListChecks} href="/admin/issues" />
        <StatCard label="Representatives" value={representatives.length} icon={Users} href="/admin/representatives" />
        <StatCard label="Candidates" value={candidates.length} icon={Vote} href="/admin/candidates" />
        <StatCard label="Cataloged Sources" value={sources.length} icon={FileStack} href="/admin/metadata" />
      </div>

      <Card className="mt-6 rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="size-4.5 text-primary" />
            API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!services ? (
            <p className="text-sm text-muted-foreground">Checking service status...</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {services.map((service) => (
                <div key={service.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{service.name}</span>
                    <Badge variant="outline" className={cn("font-medium", statusStyles[service.status])}>
                      {service.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{service.latencyMs}ms latency</p>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/api-monitor" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            View full API Monitor →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
