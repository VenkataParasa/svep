"use client";

import * as React from "react";
import { toast } from "sonner";
import { Activity, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ApiServiceStatus } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";

const statusStyles: Record<ApiServiceStatus["status"], string> = {
  operational: "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  degraded: "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400",
  outage: "border-red-600/30 bg-red-600/10 text-red-700 dark:text-red-400",
};

export default function ApiMonitorPage() {
  const [services, setServices] = React.useState<ApiServiceStatus[]>([]);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const [syncing, setSyncing] = React.useState(false);

  const refreshService = React.useCallback(async (id: ApiServiceStatus["id"]) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/health?service=${id}`);
      const json = await res.json();
      setServices((prev) => {
        const others = prev.filter((s) => s.id !== id);
        return [...others, json.data].sort((a, b) => a.id.localeCompare(b.id));
      });
    } finally {
      setLoadingId(null);
    }
  }, []);

  const refreshAll = React.useCallback(async () => {
    const res = await fetch("/api/health");
    const json = await res.json();
    setServices(json.data);
  }, []);

  React.useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  async function handleSync() {
    setSyncing(true);
    await refreshAll();
    setSyncing(false);
    toast.success("All services synced");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">API Monitor</h1>
          <p className="mt-1 text-muted-foreground">
            Live status for the platform&rsquo;s mock backend services.
          </p>
        </div>
        <Button className="gap-2" onClick={handleSync} disabled={syncing}>
          <Zap className={cn("size-4", syncing && "animate-pulse")} />
          {syncing ? "Syncing..." : "Sync All"}
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Activity className="size-4.5 text-primary" />
                  {service.name}
                </span>
                <Badge variant="outline" className={cn("font-medium", statusStyles[service.status])}>
                  {service.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Latency</span>
                <span className="text-2xl font-semibold">{service.latencyMs}ms</span>
              </div>
              <p className="text-xs text-muted-foreground">Last checked {formatDateTime(service.lastChecked)}</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5"
                onClick={() => refreshService(service.id)}
                disabled={loadingId === service.id}
              >
                <RefreshCw className={cn("size-3.5", loadingId === service.id && "animate-spin")} />
                Refresh
              </Button>
            </CardContent>
          </Card>
        ))}
        {services.length === 0 &&
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-48 animate-pulse rounded-2xl border-border/80 bg-muted/40" />
          ))}
      </div>
    </div>
  );
}
