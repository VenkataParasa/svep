import { NextRequest, NextResponse } from "next/server";

const MICHIGAN_GEOJSON_URL =
  "https://raw.githubusercontent.com/unitedstates/districts/gh-pages/states/MI/shape.geojson";
const CENSUS_DISTRICT_QUERY =
  "https://tigerweb.geo.census.gov/arcgis/rest/services/Generalized_ACS2024/Legislative/MapServer/5/query";

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get("zip")?.trim();
  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: "A valid ZIP code is required." }, { status: 400 });
  }

  const apiKey = process.env.CICERO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Cicero API is not configured." }, { status: 503 });
  }

  try {
    const ciceroParams = new URLSearchParams({
      key: apiKey,
      format: "json",
      search_postal: zip,
      search_country: "US",
    });
    const ciceroResponse = await fetch(
      `https://app.cicerodata.com/v3.1/legislative_district?${ciceroParams}`,
      { next: { revalidate: 86400 } }
    );
    if (!ciceroResponse.ok) throw new Error(`Cicero returned ${ciceroResponse.status}.`);

    const ciceroData = await ciceroResponse.json();
    const districts = ciceroData.response?.results?.candidates?.[0]?.districts || [];
    const congressionalDistrict = districts.find(
      (district: { district_type?: string }) => district.district_type === "NATIONAL_LOWER"
    );
    const rawDistrictId = String(congressionalDistrict?.district_id || "");
    const numericDistrictId = rawDistrictId.match(/\d+/)?.[0];
    if (!numericDistrictId) throw new Error("No congressional district was resolved for this ZIP.");
    const districtNumber = String(Number(numericDistrictId) > 99
      ? Number(numericDistrictId) % 100
      : Number(numericDistrictId));

    const censusParams = new URLSearchParams({
      where: `GEOID='26${districtNumber.padStart(2, "0")}'`,
      outFields: "*",
      returnGeometry: "true",
      outSR: "4326",
      f: "geojson",
    });

    const [stateResponse, districtResponse] = await Promise.all([
      fetch(MICHIGAN_GEOJSON_URL, { next: { revalidate: 2592000 } }),
      fetch(`${CENSUS_DISTRICT_QUERY}?${censusParams}`, { next: { revalidate: 86400 } }),
    ]);
    if (!stateResponse.ok || !districtResponse.ok) {
      throw new Error("A map boundary source was unavailable.");
    }

    const state = await stateResponse.json();
    const district = await districtResponse.json();
    if (!district.features?.length) throw new Error("The congressional district boundary was not found.");

    return NextResponse.json(
      { state, district, districtNumber, stateName: "Michigan" },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load federal map data.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
