import { NextResponse } from "next/server";
import { searchAll } from "@/lib/search";
import { simulateLatency } from "@/lib/mock-latency";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const latencyMs = await simulateLatency(60, 220);
  const results = searchAll(q);
  return NextResponse.json({ data: results, meta: { count: results.length, latencyMs } });
}
