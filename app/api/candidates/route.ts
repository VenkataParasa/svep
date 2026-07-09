import { NextResponse } from "next/server";
import { candidates } from "@/data/candidates";
import { simulateLatency } from "@/lib/mock-latency";

export async function GET() {
  const latencyMs = await simulateLatency();
  return NextResponse.json({ data: candidates, meta: { count: candidates.length, latencyMs } });
}
