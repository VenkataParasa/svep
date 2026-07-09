import { NextResponse } from "next/server";
import { getCandidateById } from "@/data/candidates";
import { simulateLatency } from "@/lib/mock-latency";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const latencyMs = await simulateLatency();
  const candidate = getCandidateById(id);
  if (!candidate) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }
  return NextResponse.json({ data: candidate, meta: { latencyMs } });
}
