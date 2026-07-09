import { NextResponse } from "next/server";
import { auditRecords } from "@/data/audit-records";
import { simulateLatency } from "@/lib/mock-latency";

export async function GET() {
  const latencyMs = await simulateLatency();
  return NextResponse.json({
    data: auditRecords,
    meta: { count: auditRecords.length, latencyMs },
  });
}
