"use client";

import * as React from "react";
import { AggregatorOfficialCard, DistrictData } from "@/components/representatives/aggregator-official-card";

type GovernmentLevel = "local" | "state" | "federal";
type LevelFilter = GovernmentLevel | "all";

function getGovernmentLevel(key: string): GovernmentLevel {
  const [ocdId, officeTitle = ""] = key.split("#");
  if (ocdId === "ocd-division/country:us" || ocdId.includes("/cd:")) return "federal";
  if (ocdId.includes("/sldu:") || ocdId.includes("/sldl:")) return "state";

  const isLocal = ["/county:", "/place:", "/school_district:", "/ward:"].some((part) =>
    ocdId.includes(part)
  );
  if (ocdId.includes("/state:") && !isLocal) {
    return officeTitle === "Senator" ? "federal" : "state";
  }
  return "local";
}

export function OfficialsLevelFilter({ officials }: { officials: Record<string, DistrictData> }) {
  const [activeLevel, setActiveLevel] = React.useState<LevelFilter>("all");
  const allOfficials = React.useMemo(() => Object.entries(officials), [officials]);
  const tabs: { id: LevelFilter; label: string }[] = [
    { id: "local", label: "Local" },
    { id: "state", label: "State" },
    { id: "federal", label: "Federal" },
    { id: "all", label: "All" },
  ];

  const visibleOfficials = allOfficials
    .filter(([key]) => activeLevel === "all" || getGovernmentLevel(key) === activeLevel)
    .sort(([keyA, dataA], [keyB, dataB]) => {
      const weights = { local: 1, state: 2, federal: 3 };
      return weights[getGovernmentLevel(keyA)] - weights[getGovernmentLevel(keyB)] ||
        dataA.office_title.localeCompare(dataB.office_title);
    });

  return (
    <div className="space-y-6">
      <div aria-label="Filter officials by government level" className="inline-flex flex-wrap gap-1 rounded-lg border bg-muted p-1" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeLevel === tab.id;
          const count = tab.id === "all"
            ? allOfficials.length
            : allOfficials.filter(([key]) => getGovernmentLevel(key) === tab.id).length;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveLevel(tab.id)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-background/60 hover:text-foreground"}`}
            >
              {tab.label} <span className="ml-1 text-xs">({count})</span>
            </button>
          );
        })}
      </div>

      {visibleOfficials.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleOfficials.map(([key, data]) => (
            <AggregatorOfficialCard key={key} ocdId={key} data={data} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center">
          <p className="font-medium">No {activeLevel} officials found</p>
          <p className="mt-1 text-sm text-muted-foreground">No officials in this government level were returned for the selected address.</p>
        </div>
      )}
    </div>
  );
}
