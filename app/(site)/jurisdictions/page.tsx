import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JurisdictionExplorer } from "@/components/jurisdictions/jurisdiction-explorer";

export const metadata = {
  title: "Your Legislative Jurisdictions | City of Detroit",
  description:
    "Match an address, ZIP code, ZIP+4, or current location to local, state, and federal legislative jurisdictions.",
};

export default function JurisdictionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Legislative Jurisdictions" }]} />
      <div className="mb-8 mt-5 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Location-based personalization
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Your legislative jurisdictions
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          See the local, state, and federal legislative boundaries that contain your location.
          A full address or current coordinates provides a more precise result than a ZIP code alone.
        </p>
      </div>
      <Suspense>
        <JurisdictionExplorer />
      </Suspense>
    </div>
  );
}
