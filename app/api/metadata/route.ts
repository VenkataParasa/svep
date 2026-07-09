import { NextResponse } from "next/server";
import { metadataFields } from "@/data/metadata";
import { simulateLatency } from "@/lib/mock-latency";

export async function GET() {
  const latencyMs = await simulateLatency();
  return NextResponse.json({
    data: metadataFields,
    meta: { count: metadataFields.length, latencyMs },
  });
}
