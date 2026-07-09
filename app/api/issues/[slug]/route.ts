import { NextResponse } from "next/server";
import { getIssueBySlug } from "@/data/issues";
import { simulateLatency } from "@/lib/mock-latency";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const latencyMs = await simulateLatency();
  const issue = getIssueBySlug(slug);
  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }
  return NextResponse.json({ data: issue, meta: { latencyMs } });
}
