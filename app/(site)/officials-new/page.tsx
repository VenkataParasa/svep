import * as React from "react";
import { CivicIntelligencePipeline } from "@/lib/aggregator-real";
import { AddressSearchForm } from "@/components/representatives/address-search-form";
import { OfficialsLevelFilter } from "@/components/representatives/officials-level-filter";
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
  const address = resolvedParams.address?.trim() || "";

  let districtDataRecord:
    | (Record<string, DistrictData> & { error?: string })
    | null = null;
  let error: string | null = null;

  if (address) {
    const pipeline = new CivicIntelligencePipeline(address);
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
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Elected Officials (Aggregated)", href: "/officials-new" },
        ]}
      />

      <div className="mb-8 mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Elected Officials & Incumbent Stances
          </h1>
          <p className="mt-2 w-full text-lg text-muted-foreground">
            Using the Civic Intelligence Pipeline to aggregate district
            boundaries, verify live incumbents, and infer policy behavior.
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Search Location</h2>
        <AddressSearchForm defaultAddress={address} />
        <p className="mt-2 text-sm text-muted-foreground"></p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!address && (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-8 text-center">
          <Info className="mb-4 size-10 text-muted-foreground" />
          <h3 className="text-lg font-medium">Enter a location</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Use a full address for precise officials, or a ZIP code for an
            approximate centroid lookup.
          </p>
        </div>
      )}

      {districtDataRecord &&
        Object.keys(districtDataRecord).length === 0 &&
        !error && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center bg-muted/20">
            <Info className="mb-4 h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground">
              No officials found
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mt-2">
              We could not resolve any districts or incumbents for the provided
              address. Please try providing a more specific street address.
            </p>
          </div>
        )}

      {districtDataRecord && Object.keys(districtDataRecord).length > 0 && (
        <OfficialsLevelFilter officials={districtDataRecord} />
      )}
    </div>
  );
}
