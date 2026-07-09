import { NextResponse } from "next/server";
import { representatives } from "@/data/representatives";
import { simulateLatency } from "@/lib/mock-latency";

export async function GET() {
  const latencyMs = await simulateLatency();
  return NextResponse.json({
    data: representatives,
    meta: { count: representatives.length, latencyMs },
  });
}
