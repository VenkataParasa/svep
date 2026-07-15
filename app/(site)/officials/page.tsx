import * as React from "react";
import { ZipSearchForm } from "@/components/representatives/zip-search-form";
import { CiceroOfficialCard, CiceroOfficial } from "@/components/representatives/cicero-official-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Info, MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

async function getCiceroOfficials(location: string): Promise<CiceroOfficial[]> {
  const apiKey = process.env.CICERO_API_KEY;
  if (!apiKey) {
    throw new Error("Cicero API Key is not configured.");
  }
  
  const isPostalCode = /^\d{5}(?:-\d{4})?$/.test(location.trim());
  const params = new URLSearchParams({ format: "json", key: apiKey, max: "200" });
  if (isPostalCode) {
    params.set("search_postal", location.trim());
    params.set("search_country", "US");
  } else {
    params.set("search_loc", location.trim());
  }
  const url = `https://app.cicerodata.com/v3.1/official?${params.toString()}`;
  
  // Next.js caches each URL separately, so repeated searches for the same ZIP
  // reuse the response while a new ZIP triggers a Cicero API request.
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch from Cicero API: ${res.statusText}`);
  }
  
  const data = await res.json();
  const candidates = data.response?.results?.candidates;
  
  if (!candidates || candidates.length === 0) {
    return [];
  }
  
  const fetchedOfficials = candidates[0].officials || [];
  // Filter out appointed officials (those with an empty election_frequency)
  return fetchedOfficials.filter((o: CiceroOfficial) => o.office?.chamber?.election_frequency !== "");
}

export const metadata = {
  title: "Elected Officials | City of Detroit",
  description: "Find your elected officials using the Cicero API.",
};

export default async function OfficialsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const zipParam = params.zip as string | undefined;
  const categoryParam = (params.category as string) || "all";
  
  let officials: CiceroOfficial[] = [];
  let error: string | null = null;
  
  try {
    if (zipParam) officials = await getCiceroOfficials(zipParam);
  } catch (e: unknown) {
    if (e instanceof Error) {
      error = e.message;
    } else {
      error = String(e);
    }
  }

  // Filter officials based on selected category
  let filteredOfficials = officials;
  if (categoryParam === "federal") {
    const electedFederalTitles = ["President", "Vice President", "Senator", "Representative"];
    filteredOfficials = officials.filter(o => 
      o.office.district?.district_type?.startsWith("NATIONAL") &&
      electedFederalTitles.includes(o.office.title)
    );
  } else if (categoryParam === "state_exec") {
    const electedStateExecTitles = ["Governor", "Lieutenant Governor", "Secretary of State", "Attorney General"];
    filteredOfficials = officials.filter(o => 
      o.office.district?.district_type === "STATE_EXEC" &&
      electedStateExecTitles.includes(o.office.title)
    );
  } else if (categoryParam === "state_leg") {
    filteredOfficials = officials.filter(o => o.office.district?.district_type === "STATE_LOWER" || o.office.district?.district_type === "STATE_UPPER");
  } else if (categoryParam === "local") {
    filteredOfficials = officials.filter(o => {
      const type = o.office.district?.district_type;
      const isLocalType = type && !type.startsWith("NATIONAL") && !type.startsWith("STATE");
      const isNonpartisan = !o.party || o.party === "Nonpartisan" || o.party === "Unknown";
      return isLocalType || isNonpartisan;
    });
  }

  const categories = [
    { id: "all", label: "All Officials" },
    { id: "federal", label: "Federal Officials" },
    { id: "state_exec", label: "State Executives" },
    { id: "state_leg", label: "State Legislature" },
    { id: "local", label: "Local Government" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-[1400px]">
      <Breadcrumbs items={[{ label: "Elected Officials" }]} />
      <div className="mb-10 mt-6 space-y-3 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Elected Officials
        </h1>
        <p className="text-lg text-muted-foreground mx-auto max-w-2xl">
          Discover your federal, state, and local elected officials representing your area.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Nav Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <nav className="flex flex-col gap-2 text-sm font-medium">
              {categories.map(cat => {
                const isActive = categoryParam === cat.id;
                const linkParams = new URLSearchParams();
                if (zipParam) linkParams.set("zip", zipParam);
                if (cat.id !== "all") linkParams.set("category", cat.id);
                const href = `/officials?${linkParams.toString()}`;
                return (
                  <Link 
                    key={cat.id}
                    href={href} 
                    className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {cat.label}
                    {isActive && <ChevronRight className="h-4 w-4" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error Loading Officials</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {zipParam && !error && filteredOfficials.length === 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>No Results</AlertTitle>
              <AlertDescription>
                We couldn&apos;t find any officials for this category at <strong>{zipParam}</strong>.
              </AlertDescription>
            </Alert>
          )}

          {zipParam && !error && filteredOfficials.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between lg:hidden">
                <h2 className="text-xl font-bold tracking-tight">
                  Officials for {zipParam}
                </h2>
                <Badge variant="outline">{filteredOfficials.length} Found</Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredOfficials.map((official) => (
                  <CiceroOfficialCard key={official.id} official={official} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Search Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-card p-6 shadow-sm flex flex-col gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Search Location</h3>
              <ZipSearchForm />
            </div>

            {zipParam && !error && officials.length > 0 && (
              <div className="pt-6 border-t border-border/50">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Currently Viewing</h4>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 rounded-full bg-primary/10 items-center justify-center text-primary">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-none">{zipParam}</p>
                    <p className="text-xs text-muted-foreground mt-1">{filteredOfficials.length} officials found</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
