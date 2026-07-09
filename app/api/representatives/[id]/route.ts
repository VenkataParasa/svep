import { NextResponse } from "next/server";
import { getRepresentativeById } from "@/data/representatives";
import { simulateLatency } from "@/lib/mock-latency";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const latencyMs = await simulateLatency();
  const representative = getRepresentativeById(id);
  if (!representative) {
    return NextResponse.json({ error: "Representative not found" }, { status: 404 });
  }
  return NextResponse.json({ data: representative, meta: { latencyMs } });
}
