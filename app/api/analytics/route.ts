import { NextResponse } from "next/server";
import { analyticsData } from "@/data/analytics";
import { simulateLatency } from "@/lib/mock-latency";

export async function GET() {
  const latencyMs = await simulateLatency();
  return NextResponse.json({ data: analyticsData, meta: { latencyMs } });
}
