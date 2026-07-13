import * as React from "react";
import { CivicIntelligencePipeline } from "@/lib/aggregator-real";
import { AddressSearchForm } from "@/components/representatives/address-search-form";
import { AggregatorOfficialCard } from "@/components/representatives/aggregator-official-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata = {
  title: "Elected Officials (New API) | Civic Platform",
  description: "View elected officials and their inferred policy stances.",
};

import { DistrictData } from "@/components/representatives/aggregator-official-card";

export default async function OfficialsNewPage({
  searchParams,
}: {
  searchParams: Promise<{ address?: string }>;
}) {
  const resolvedParams = await searchParams;
  const address = resolvedParams.address || "49341";

  const pipeline = new CivicIntelligencePipeline(address);
  
  let districtDataRecord: (Record<string, DistrictData> & { error?: string }) | null = null;
  let error: string | null = null;

  try {
    const resultJsonString = await pipeline.run();
    districtDataRecord = JSON.parse(resultJsonString);
    if (districtDataRecord?.error) {
      error = districtDataRecord.error;
      districtDataRecord = null;
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      error = e.message;
    } else {
      error = "Failed to resolve data for this address.";
    }
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Elected Officials (Aggregated)", href: "/officials-new" }]} />
      
      <div className="mb-8 mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Elected Officials & Incumbent Stances
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
            Using the Civic Intelligence Pipeline to aggregate district boundaries, verify live incumbents, and infer policy behavior.
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Search Location</h2>
        <AddressSearchForm defaultAddress={address} />
        <p className="mt-2 text-sm text-muted-foreground">
          Showing results for: <span className="font-semibold text-foreground">{address}</span>
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {districtDataRecord && Object.keys(districtDataRecord).length === 0 && !error && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center bg-muted/20">
          <Info className="mb-4 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground">No officials found</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-2">
            We could not resolve any districts or incumbents for the provided address. Please try providing a more specific street address.
          </p>
        </div>
      )}

      {districtDataRecord && Object.keys(districtDataRecord).length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(districtDataRecord)
            .sort(([keyA, dataA], [keyB, dataB]) => {
              const getLevelWeight = (key: string, title: string) => {
                const ocdId = key.split('#')[0];
                if (ocdId === "ocd-division/country:us" || ocdId.includes("/cd:")) return 3; // Federal
                if (ocdId.includes("/sldu:") || ocdId.includes("/sldl:")) return 2; // State Leg
                
                const hasSubState = ocdId.includes("/county:") || ocdId.includes("/place:") || ocdId.includes("/school_district:") || ocdId.includes("/ward:");
                if (ocdId.includes("/state:") && !hasSubState) {
                  if (title.includes("Senator") && !title.includes("State")) return 3; // US Senator
                  return 2; // State Exec
                }
                return 1; // Local
              };

              const weightA = getLevelWeight(keyA, (dataA as DistrictData).office_title);
              const weightB = getLevelWeight(keyB, (dataB as DistrictData).office_title);
              
              if (weightA !== weightB) {
                return weightA - weightB; // Local(1) -> State(2) -> Federal(3)
              }
              return (dataA as DistrictData).office_title.localeCompare((dataB as DistrictData).office_title);
            })
            .map(([ocdId, data]) => (
            <AggregatorOfficialCard key={ocdId} ocdId={ocdId} data={data as DistrictData} />
          ))}
        </div>
      )}
    </div>
  );
}
