import { NextResponse } from "next/server";
import type { ApiServiceStatus } from "@/lib/types";

const serviceConfig: Record<ApiServiceStatus["id"], { name: string; min: number; max: number }> = {
  government: { name: "Government API", min: 90, max: 260 },
  legislative: { name: "Legislative API", min: 150, max: 420 },
  election: { name: "Election API", min: 110, max: 340 },
};

function rollStatus(): ApiServiceStatus["status"] {
  const roll = Math.random();
  if (roll < 0.85) return "operational";
  if (roll < 0.97) return "degraded";
  return "outage";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceParam = searchParams.get("service") as ApiServiceStatus["id"] | null;

  const ids = serviceParam ? [serviceParam] : (Object.keys(serviceConfig) as ApiServiceStatus["id"][]);

  const results: ApiServiceStatus[] = [];
  for (const id of ids) {
    const config = serviceConfig[id];
    if (!config) continue;
    const latencyMs = Math.round(config.min + Math.random() * (config.max - config.min));
    await new Promise((resolve) => setTimeout(resolve, latencyMs));
    const status = rollStatus();
    results.push({
      id,
      name: config.name,
      status,
      latencyMs: status === "outage" ? config.max * 2 : latencyMs,
      lastChecked: new Date().toISOString(),
    });
  }

  if (serviceParam && results.length === 0) {
    return NextResponse.json({ error: `Unknown service '${serviceParam}'` }, { status: 400 });
  }

  return NextResponse.json({ data: serviceParam ? results[0] : results });
}
