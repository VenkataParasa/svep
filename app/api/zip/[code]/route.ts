import { NextResponse } from "next/server";
import { getJurisdictionByZip } from "@/data/jurisdictions";
import { simulateLatency } from "@/lib/mock-latency";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const latencyMs = await simulateLatency();
  const jurisdiction = getJurisdictionByZip(code);
  if (!jurisdiction) {
    return NextResponse.json(
      { error: `ZIP code ${code} is not covered by this demo.` },
      { status: 404 }
    );
  }
  return NextResponse.json({ data: jurisdiction, meta: { latencyMs } });
}
