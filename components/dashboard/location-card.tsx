import { Building2, Landmark, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ZipJurisdiction } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function LocationCard({
  jurisdiction,
}: {
  jurisdiction: ZipJurisdiction;
}) {
  // const rows: { label: string; value: string; confidence?: "verified" | "demo-data"; note?: string }[] = [
  //   { label: "City", value: jurisdiction.city, confidence: "verified" },
  //   { label: "County", value: jurisdiction.county, confidence: "verified" },
  //   { label: "Council District", value: jurisdiction.councilDistrict, confidence: jurisdiction.councilDistrictConfidence },
  //   { label: "State House District", value: jurisdiction.stateHouseDistrict, confidence: jurisdiction.stateHouseConfidence },
  //   { label: "State Senate District", value: jurisdiction.stateSenateDistrict, confidence: jurisdiction.stateSenateConfidence },
  //   { label: "Congressional District", value: jurisdiction.congressionalDistrict, confidence: jurisdiction.congressionalConfidence },
  // ];
  const rows: { label: string; value: string; note?: string }[] = [
    { label: "City", value: jurisdiction.city },
    { label: "County", value: jurisdiction.county },
    { label: "Council District", value: jurisdiction.councilDistrict },
    { label: "State House District", value: jurisdiction.stateHouseDistrict },
    { label: "State Senate District", value: jurisdiction.stateSenateDistrict },
    {
      label: "Congressional District",
      value: jurisdiction.congressionalDistrict,
    },
  ];

  return (
    <Card className="rounded-2xl border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="size-4.5 text-primary" />
          Your Location & Jurisdiction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-xl bg-accent/40 p-3">
          <div className="text-2xl font-semibold">{jurisdiction.zip}</div>
          <div className="text-sm text-muted-foreground">
            {jurisdiction.neighborhood} · {jurisdiction.city} · {jurisdiction.county}
          </div>
        </div>

        <dl className="space-y-2.5">
          {rows.map((row, index) => (
            <div
              key={row.label}
              className={`flex items-start justify-between gap-3 text-sm ${
                index > 0 ? "border-t border-border/70 pt-2.5" : ""
              }`}
            >
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <Landmark className="size-3.5 shrink-0" />
                {row.label}
              </dt>
              <dd className="flex flex-col items-end gap-1 text-right font-medium">
                <span>{row.value}</span>
                {/* {row.confidence && (
                  <ConfidenceBadge
                    confidence={row.confidence}
                    note={row.note ?? jurisdiction.demoDataNote}
                  />
                )} */}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex items-start justify-between gap-3 border-t border-border pt-3 text-sm">
          <dt className="flex items-center gap-1.5 text-muted-foreground">
            <Building2 className="size-3.5 shrink-0" />
            Government Office
          </dt>
          <dd className="text-right font-medium">
            {jurisdiction.governmentOffice}
          </dd>
        </div>
        <p className="text-right text-xs text-muted-foreground">
          Last updated {formatDate(jurisdiction.lastUpdated)}
        </p>
      </CardContent>
    </Card>
  );
}
