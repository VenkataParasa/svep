import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const zip = searchParams.get("zip");
  
  if (!zip) return new NextResponse("Zip required", { status: 400 });
  
  const apiKey = process.env.CICERO_API_KEY;
  if (!apiKey) return new NextResponse("API key not configured", { status: 500 });
  
  try {
    // 1. Get the legislative districts for the ZIP
    const res = await fetch(`https://app.cicerodata.com/v3.1/legislative_district?search_postal=${zip}&search_country=US&format=json&key=${apiKey}`, { next: { revalidate: 86400 } });
    
    if (!res.ok) {
      return new NextResponse("Cicero API error", { status: 500 });
    }

    const data = await res.json();
    
    const results = data.response?.results?.candidates?.[0]?.districts;
    if (!results || results.length === 0) {
      return new NextResponse("Not found", { status: 404 });
    }
    
    interface CiceroDistrict {
      district_type: string;
      district_id: string;
      id: number;
    }
    
    // 2. Prefer City Council district (LOCAL but not At Large)
    let targetDistrict = results.find((d: CiceroDistrict) => d.district_type === 'LOCAL' && d.district_id !== 'At Large');
    
    // Fallback to City At Large
    if (!targetDistrict) targetDistrict = results.find((d: CiceroDistrict) => d.district_type === 'LOCAL');
    
    // Fallback to National Lower
    if (!targetDistrict) targetDistrict = results.find((d: CiceroDistrict) => d.district_type === 'NATIONAL_LOWER');
    
    // Fallback to any district
    if (!targetDistrict) targetDistrict = results[0];
    
    if (!targetDistrict || !targetDistrict.id) {
      return new NextResponse("Map not found", { status: 404 });
    }
    
    // 3. Get the map image - specify width and height for a nicer aspect ratio if supported
    // The API might accept width/height, but we'll request the default format=image
    const mapRes = await fetch(`https://app.cicerodata.com/v3.1/map/${targetDistrict.id}?format=image&key=${apiKey}`, { next: { revalidate: 86400 } });
    
    if (!mapRes.ok) {
      return new NextResponse("Failed to fetch map image", { status: 500 });
    }
    
    const buffer = await mapRes.arrayBuffer();
    
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mapRes.headers.get("content-type") || "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching map:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
