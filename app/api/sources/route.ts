import { NextResponse } from "next/server";
import { sources } from "@/data/sources";
import { simulateLatency } from "@/lib/mock-latency";

export async function GET() {
  const latencyMs = await simulateLatency();
  return NextResponse.json({ data: sources, meta: { count: sources.length, latencyMs } });
}
