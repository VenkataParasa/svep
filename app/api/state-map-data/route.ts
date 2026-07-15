import { NextRequest, NextResponse } from "next/server";

const STATE_URL = "https://raw.githubusercontent.com/unitedstates/districts/gh-pages/states/MI/shape.geojson";
const LEGISLATIVE_URL = "https://tigerweb.geo.census.gov/arcgis/rest/services/Generalized_ACS2024/Legislative/MapServer";

function districtNumber(value: unknown): string | null {
  const number = String(value || "").match(/\d+/)?.[0];
  if (!number) return null;
  return String(Number(number) > 999 ? Number(number) % 1000 : Number(number));
}

function censusQuery(layer: number, number: string) {
  const params = new URLSearchParams({
    where: `GEOID='26${number.padStart(3, "0")}'`,
    outFields: "*",
    returnGeometry: "true",
    outSR: "4326",
    f: "geojson",
  });
  return `${LEGISLATIVE_URL}/${layer}/query?${params}`;
}

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get("zip")?.trim();
  const apiKey = process.env.CICERO_API_KEY;
  if (!zip || !/^\d{5}$/.test(zip)) return NextResponse.json({ error: "Valid ZIP required." }, { status: 400 });
  if (!apiKey) return NextResponse.json({ error: "Cicero API is not configured." }, { status: 503 });

  try {
    const params = new URLSearchParams({ key: apiKey, format: "json", search_postal: zip, search_country: "US" });
    const response = await fetch(`https://app.cicerodata.com/v3.1/legislative_district?${params}`, { next: { revalidate: 86400 } });
    if (!response.ok) throw new Error("Cicero district lookup failed.");
    const payload = await response.json();
    const districts = payload.response?.results?.candidates?.[0]?.districts || [];
    const senateNumber = districtNumber(districts.find((d: { district_type?: string }) => d.district_type === "STATE_UPPER")?.district_id);
    const houseNumber = districtNumber(districts.find((d: { district_type?: string }) => d.district_type === "STATE_LOWER")?.district_id);
    if (!senateNumber || !houseNumber) throw new Error("State legislative districts were not resolved.");

    const [stateResponse, senateResponse, houseResponse] = await Promise.all([
      fetch(STATE_URL, { next: { revalidate: 2592000 } }),
      fetch(censusQuery(8, senateNumber), { next: { revalidate: 86400 } }),
      fetch(censusQuery(9, houseNumber), { next: { revalidate: 86400 } }),
    ]);
    if (!stateResponse.ok || !senateResponse.ok || !houseResponse.ok) throw new Error("A Census map source was unavailable.");

    const [state, senate, house] = await Promise.all([stateResponse.json(), senateResponse.json(), houseResponse.json()]);
    if (!senate.features?.length || !house.features?.length) throw new Error("State district boundaries were not found.");
    return NextResponse.json({ state, senate, house, senateNumber, houseNumber });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load state maps." }, { status: 502 });
  }
}
