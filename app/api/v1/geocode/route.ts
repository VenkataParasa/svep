import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Missing address parameter' }, { status: 400 });
  }

  const apiKey = process.env.GEOCODIO_API_KEY;

  if (apiKey) {
    try {
      const geocodioUrl = `https://api.geocod.io/v1.7/geocode?q=${encodeURIComponent(address)}&fields=cd,stateleg&api_key=${apiKey}`;
      const response = await fetch(geocodioUrl);
      
      if (!response.ok) {
        throw new Error(`Geocodio API responded with status ${response.status}`);
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        
        // Map Geocodio response to our standard format
        const standardAddress = {
          addressLine1: result.address_components.number + ' ' + result.address_components.street,
          city: result.address_components.city,
          state: result.address_components.state,
          zipCode: result.address_components.zip,
          zipPlus4: result.address_components.suffix,
        };

        const boundaries = {
          congressionalDistrict: result.fields.congressional_districts?.[0]?.district_number?.toString() || null,
          stateSenateDistrict: result.fields.state_legislative_districts?.senate?.[0]?.district_number?.toString() || null,
          stateHouseDistrict: result.fields.state_legislative_districts?.house?.[0]?.district_number?.toString() || null,
        };

        return NextResponse.json({
          address: standardAddress,
          boundaries,
          source: 'geocodio'
        });
      } else {
        return NextResponse.json({ error: 'No results found for that address' }, { status: 404 });
      }
    } catch (error) {
      console.error("Geocodio Error:", error);
      // Fallback to mock on network error
    }
  }

  // MOCK FALLBACK (for local dev without API key)
  console.log(`[Mock Geocode] Processing address: ${address}`);
  return NextResponse.json({
    address: {
      addressLine1: '3051 Miller Rd',
      city: 'Ann Arbor',
      state: 'MI',
      zipCode: '48103',
      zipPlus4: '1234',
    },
    boundaries: {
      congressionalDistrict: '6', // Debbie Dingell
      stateSenateDistrict: '14',  // Sue Shink
      stateHouseDistrict: '47',   // Carrie Rheingans
    },
    source: 'mock_fallback_no_api_key'
  });
}
