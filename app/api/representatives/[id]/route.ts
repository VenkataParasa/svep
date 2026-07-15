import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id.startsWith("rep-cicero-")) {
    return NextResponse.json({ error: "Representative not found" }, { status: 404 });
  }
  const representative = await prisma.representative.findUnique({
    where: { id },
    include: { sources: true, issues: true, issuePositions: true },
  });
  if (!representative) {
    return NextResponse.json({ error: "Representative not found" }, { status: 404 });
  }
  return NextResponse.json({ data: representative, meta: { source: "database" } });
}
