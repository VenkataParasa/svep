import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isSafeRemotePhoto(value: string) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    return (
      url.protocol === "https:" &&
      hostname !== "localhost" &&
      hostname !== "127.0.0.1" &&
      hostname !== "::1" &&
      !hostname.endsWith(".local")
    );
  } catch {
    return false;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const representative = await prisma.representative.findUnique({
    where: { id },
    select: { photoUrl: true },
  });
  const photoUrl = representative?.photoUrl?.trim();

  if (!photoUrl || !isSafeRemotePhoto(photoUrl)) {
    return new NextResponse("Photo not available.", { status: 404 });
  }

  try {
    const response = await fetch(photoUrl, {
      headers: {
        Accept: "image/avif,image/webp,image/png,image/jpeg,image/*",
        "User-Agent": "City-of-Detroit-Voter-Education-Platform/1.0",
      },
      next: { revalidate: 24 * 60 * 60 },
    });
    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || !contentType.startsWith("image/")) {
      return new NextResponse("Photo not available.", { status: 404 });
    }

    return new NextResponse(await response.arrayBuffer(), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error(`Unable to retrieve representative photo ${id}:`, error);
    return new NextResponse("Photo not available.", { status: 502 });
  }
}
