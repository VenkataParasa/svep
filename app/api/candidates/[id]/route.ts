import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json(
    {
      error: "Candidate not found. No authoritative candidate provider is configured.",
      id,
    },
    { status: 404 },
  );
}
