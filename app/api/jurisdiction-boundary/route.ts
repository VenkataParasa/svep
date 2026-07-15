import { NextRequest, NextResponse } from "next/server";

const TIGER_ROOT =
  "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb";
const DETROIT_COUNCIL =
  "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Council_Districts/FeatureServer/0/query";

const services = {
  county: [`${TIGER_ROOT}/State_County/MapServer/1/query`],
  city: [
    `${TIGER_ROOT}/Places_CouSub_ConCity_SubMCD/MapServer/4/query`,
    `${TIGER_ROOT}/Places_CouSub_ConCity_SubMCD/MapServer/3/query`,
    `${TIGER_ROOT}/Places_CouSub_ConCity_SubMCD/MapServer/1/query`,
  ],
  congressional: [`${TIGER_ROOT}/Legislative/MapServer/0/query`],
  stateSenate: [`${TIGER_ROOT}/Legislative/MapServer/1/query`],
  stateHouse: [`${TIGER_ROOT}/Legislative/MapServer/2/query`],
  council: [DETROIT_COUNCIL],
} as const;

type BoundaryKind = keyof typeof services;

function coordinate(value: string | null, min: number, max: number) {
  if (!value) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max
    ? number
    : null;
}

function queryUrl(service: string, latitude: number, longitude: number) {
  const params = new URLSearchParams({
    where: "1=1",
    geometry: `${longitude},${latitude}`,
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "*",
    returnGeometry: "true",
    outSR: "4326",
    f: "geojson",
  });
  return `${service}?${params}`;
}

export async function GET(request: NextRequest) {
  const kind = request.nextUrl.searchParams.get("kind") as BoundaryKind | null;
  const latitude = coordinate(request.nextUrl.searchParams.get("lat"), -90, 90);
  const longitude = coordinate(request.nextUrl.searchParams.get("lon"), -180, 180);
  if (!kind || !(kind in services) || latitude == null || longitude == null) {
    return NextResponse.json(
      { error: "A valid jurisdiction type, latitude, and longitude are required." },
      { status: 400 },
    );
  }

  try {
    for (const service of services[kind]) {
      const response = await fetch(queryUrl(service, latitude, longitude), {
        next: { revalidate: 24 * 60 * 60 },
      });
      if (!response.ok) continue;
      const boundary = await response.json();
      if (boundary.features?.length) {
        return NextResponse.json({
          boundary,
          source:
            kind === "council"
              ? "City of Detroit Open Data"
              : "U.S. Census Bureau TIGERweb",
        });
      }
    }

    return NextResponse.json(
      {
        error:
          kind === "council"
            ? "A local council boundary is not available from the supported municipal GIS source."
            : "No matching Census boundary was found for this location.",
      },
      { status: 404 },
    );
  } catch (error) {
    console.error(`${kind} boundary lookup failed:`, error);
    return NextResponse.json(
      { error: "The jurisdiction boundary service is unavailable." },
      { status: 502 },
    );
  }
}
