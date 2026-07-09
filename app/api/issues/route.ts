import { NextResponse } from "next/server";
import { issues } from "@/data/issues";
import { simulateLatency } from "@/lib/mock-latency";

export async function GET() {
  const latencyMs = await simulateLatency();
  return NextResponse.json({ data: issues, meta: { count: issues.length, latencyMs } });
}
