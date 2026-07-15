import { NextResponse } from "next/server";

const CICERO_BASE_URL = "https://app.cicerodata.com/v3.1";

type CiceroDistrict = {
  district_type?: string;
  district_id?: string | number;
};

type CiceroCandidate = {
  match_addr?: string;
  match_streetaddr?: string;
  match_city?: string;
  match_region?: string;
  match_postal?: string;
  districts?: CiceroDistrict[];
};

type CiceroResponse = {
  response?: {
    errors?: Array<{ message?: string }>;
    results?: {
      candidates?: CiceroCandidate[];
    };
  };
};

function districtId(candidate: CiceroCandidate, type: string) {
  const district = candidate.districts?.find(
    (item) => item.district_type === type,
  );
  return district?.district_id?.toString() ?? null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("address")?.trim();

  if (!location) {
    return NextResponse.json(
      { error: "Missing address parameter" },
      { status: 400 },
    );
  }

  const apiKey = process.env.CICERO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Cicero is not configured on this server." },
      { status: 503 },
    );
  }

  const ciceroParams = new URLSearchParams({
    format: "json",
    key: apiKey,
    search_country: "US",
  });
  const postalMatch = location.match(/^\d{5}(?:-\d{4})?$/);
  ciceroParams.set(postalMatch ? "search_postal" : "search_loc", location);

  try {
    const response = await fetch(
      `${CICERO_BASE_URL}/legislative_district?${ciceroParams.toString()}`,
      { next: { revalidate: 60 * 60 } },
    );
    const data = (await response.json()) as CiceroResponse;

    if (!response.ok) {
      throw new Error(`Cicero responded with status ${response.status}`);
    }

    const apiError = data.response?.errors?.[0]?.message;
    if (apiError) {
      return NextResponse.json({ error: apiError }, { status: 400 });
    }

    const candidate = data.response?.results?.candidates?.[0];
    if (!candidate) {
      return NextResponse.json(
        { error: "No results found for that address or ZIP code." },
        { status: 404 },
      );
    }

    const zipCode = candidate.match_postal?.match(/\b\d{5}\b/)?.[0];
    if (!zipCode) {
      return NextResponse.json(
        { error: "Cicero did not return a ZIP code for that location." },
        { status: 422 },
      );
    }

    const zipPlus4 =
      candidate.match_postal?.match(/\b\d{5}-(\d{4})\b/)?.[1] ??
      location.match(/\b\d{5}-(\d{4})\b/)?.[1] ??
      null;

    return NextResponse.json({
      address: {
        addressLine1: candidate.match_streetaddr ?? candidate.match_addr ?? "",
        city: candidate.match_city ?? "",
        state: candidate.match_region ?? "",
        zipCode,
        zipPlus4,
      },
      boundaries: {
        congressionalDistrict: districtId(candidate, "NATIONAL_LOWER"),
        stateSenateDistrict: districtId(candidate, "STATE_UPPER"),
        stateHouseDistrict: districtId(candidate, "STATE_LOWER"),
      },
      source: "cicero",
    });
  } catch (error) {
    console.error("Cicero location lookup failed:", error);
    return NextResponse.json(
      { error: "The address service is temporarily unavailable." },
      { status: 502 },
    );
  }
}
