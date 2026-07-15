import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: [],
    meta: {
      count: 0,
      source: "none",
      message: "No authoritative candidate provider is configured.",
    },
  });
}
