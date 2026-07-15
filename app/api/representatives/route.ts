import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const representatives = await prisma.representative.findMany({
    where: { id: { startsWith: "rep-cicero-" } },
    orderBy: [{ level: "asc" }, { office: "asc" }, { name: "asc" }],
  });
  return NextResponse.json({
    data: representatives,
    meta: { count: representatives.length, source: "database" },
  });
}
