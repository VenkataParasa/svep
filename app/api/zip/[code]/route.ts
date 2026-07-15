import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  if (!/^\d{5}(?:-?\d{4})?$/.test(code)) {
    return NextResponse.json(
      { error: "A valid ZIP or ZIP+4 is required." },
      { status: 400 },
    );
  }

  const destination = new URL("/api/legislative-districts", request.url);
  destination.searchParams.set("location", code);
  return NextResponse.redirect(destination);
}
