import { NextRequest, NextResponse } from "next/server";

const STATE_URL = "https://raw.githubusercontent.com/unitedstates/districts/gh-pages/states/MI/shape.geojson";
const COUNTY_URL = "https://tigerweb.geo.census.gov/arcgis/rest/services/Generalized_ACS2024/State_County/MapServer/11/query";

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get("zip")?.trim();
  if (!zip || !/^\d{5}$/.test(zip)) return NextResponse.json({ error: "Valid ZIP required." }, { status: 400 });

  try {
    const countyParams = new URLSearchParams({
      where: "GEOID='26163'",
      outFields: "*",
      returnGeometry: "true",
      outSR: "4326",
      f: "geojson",
    });
    const [stateResponse, countyResponse] = await Promise.all([
      fetch(STATE_URL, { next: { revalidate: 2592000 } }),
      fetch(`${COUNTY_URL}?${countyParams}`, { next: { revalidate: 86400 } }),
    ]);
    if (!stateResponse.ok || !countyResponse.ok) throw new Error("A Census map source was unavailable.");
    const [state, county] = await Promise.all([stateResponse.json(), countyResponse.json()]);
    if (!county.features?.length) throw new Error("Wayne County boundary was not found.");
    return NextResponse.json({ state, county, countyName: "Wayne County" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load county map." }, { status: 502 });
  }
}
