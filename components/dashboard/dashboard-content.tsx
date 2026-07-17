"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { LocationCard } from "@/components/dashboard/location-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RepresentativeListItem } from "@/components/representatives/representative-list-item";
import { ZipSearchForm } from "@/components/landing/zip-search-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useZipContextStore } from "@/store/zip-context-store";
import type { GovLevel, Party, ZipJurisdiction } from "@/lib/types";

type OfficeLevelFilter = GovLevel | "all";

interface CurrentOfficial {
  id: string;
  name: string;
  office: string;
  level: GovLevel;
  party: Party;
  photoUrl: string;
}

type DynamicDistrict = {
  type: string;
  districtId: string;
  label: string;
  officials: Array<{
    id: string | null;
    name: string;
    title: string;
    party: string;
    photoUrl: string;
  }>;
};

type DynamicLocation = {
  match: {
    formattedAddress: string;
    city: string;
    county: string;
    state: string;
    postalCode: string;
    latitude: number | null;
    longitude: number | null;
  };
  districts: DynamicDistrict[];
};

function levelFromDistrict(type: string): GovLevel {
  if (type.startsWith("NATIONAL")) return "federal";
  if (type.startsWith("STATE")) return "state";
  return "city";
}

function partyFromCicero(value: string): Party {
  const party = value.toLowerCase();
  if (party.includes("democrat")) return "Democratic";
  if (party.includes("republican")) return "Republican";
  if (party.includes("independent")) return "Independent";
  if (party.includes("nonpartisan") || party.includes("unknown"))
    return "Nonpartisan";
  return "Other";
}

function districtLabel(districts: DynamicDistrict[], type: string) {
  return (
    districts.find((district) => district.type === type)?.label ??
    "Not returned by Cicero"
  );
}

function districtTarget(
  districts: DynamicDistrict[],
  predicate: (district: DynamicDistrict) => boolean
) {
  const district = districts.find(predicate);
  return district ? { label: district.label } : undefined;
}

function officeWithJurisdiction(
  title: string,
  district: DynamicDistrict,
): string {
  const districtId = district.districtId.trim();
  const label = district.label.trim();
  const isAtLarge = /at[ -]?large/i.test(`${districtId} ${label}`);

  if (district.type === "LOCAL" && isAtLarge) {
    return `${title} - At Large`;
  }

  const jurisdiction = label || districtId;
  return jurisdiction ? `${title} - ${jurisdiction}` : title;
}

function getOfficeRank(level: GovLevel, office: string): number {
  const title = office.toLowerCase();

  // Resolve titles whose names contain a higher office title before applying
  // the general substring-based hierarchy below.
  if (level === "federal") {
    if (title.includes("vice president")) return 1;
    if (title.includes("president")) return 0;
  }
  if (level === "state") {
    if (title.includes("lieutenant governor")) return 1;
    if (title.includes("governor")) return 0;
  }
  if (level === "city") {
    if (title.includes("council president pro tem")) return 3;
    if (title.includes("council president")) return 2;
  }

  const hierarchy: Record<GovLevel, string[]> = {
    city: [
      "mayor",
      "county executive",
      "council president",
      "council president pro tem",
      "city council",
      "council member",
      "county commissioner",
      "city clerk",
      "county clerk",
      "treasurer",
      "school board",
    ],
    state: [
      "governor",
      "lieutenant governor",
      "attorney general",
      "secretary of state",
      "state treasurer",
      "state senator",
      "senator",
      "state representative",
      "representative",
    ],
    federal: ["president", "vice president", "senator", "representative"],
  };

  const rank = hierarchy[level].findIndex((officeName) =>
    title.includes(officeName)
  );
  return rank === -1 ? hierarchy[level].length : rank;
}

export function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    zip: storedZip,
    location: storedLocation,
    setResolvedLocation,
  } = useZipContextStore();
  const queryLocation = searchParams.get("location")?.trim() || "";
  const legacyZip = searchParams.get("zip")?.trim() || "";
  const latitude = searchParams.get("lat")?.trim() || "";
  const longitude = searchParams.get("lon")?.trim() || "";
  const hasCoordinates = Boolean(latitude && longitude);
  const locationInput =
    queryLocation || legacyZip || storedLocation || storedZip || "";
  const [representatives, setRepresentatives] = React.useState<
    CurrentOfficial[]
  >([]);
  const [representativesLoading, setRepresentativesLoading] =
    React.useState(false);
  const [representativesError, setRepresentativesError] = React.useState<
    string | null
  >(null);
  const [jurisdiction, setJurisdiction] =
    React.useState<ZipJurisdiction | null>(null);
  const [officeLevelFilter, setOfficeLevelFilter] =
    React.useState<OfficeLevelFilter>("all");

  React.useEffect(() => {
    if (!queryLocation && !legacyZip && !hasCoordinates && locationInput) {
      router.replace(
        `/dashboard?location=${encodeURIComponent(locationInput)}`
      );
    }
  }, [queryLocation, legacyZip, hasCoordinates, locationInput, router]);

  React.useEffect(() => {
    if (!locationInput && !hasCoordinates) return;
    const controller = new AbortController();
    setRepresentativesLoading(true);
    setRepresentativesError(null);

    const lookupParams = new URLSearchParams();
    if (hasCoordinates) {
      lookupParams.set("lat", latitude);
      lookupParams.set("lon", longitude);
    } else {
      lookupParams.set("location", locationInput);
    }
    fetch(`/api/legislative-districts?${lookupParams.toString()}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok)
          throw new Error(
            payload.error || "Unable to retrieve current officials."
          );
        const location = payload.data as DynamicLocation;
        const seenOfficials = new Set<string>();
        const officials = location.districts.flatMap((district) =>
          district.officials.flatMap((official) => {
            const key = official.id ?? `${official.name}-${official.title}`;
            if (seenOfficials.has(key)) return [];
            seenOfficials.add(key);
            return [
              {
              id: key,
              name: official.name,
              office: officeWithJurisdiction(official.title, district),
                level: levelFromDistrict(district.type),
                party: partyFromCicero(official.party),
                photoUrl: official.photoUrl,
              },
            ];
          })
        );
        const resolvedZip =
          location.match.postalCode.match(/\b\d{5}\b/)?.[0] ?? null;
        setResolvedLocation(
          queryLocation || legacyZip || location.match.formattedAddress,
          resolvedZip
        );
        setRepresentatives(officials);
        setJurisdiction({
          zip: resolvedZip ?? legacyZip.match(/\b\d{5}\b/)?.[0] ?? "",
          city: location.match.city || "Location returned by Cicero",
          county: location.match.county || "Not returned by Cicero",
          neighborhood: location.match.formattedAddress,
          councilDistrict:
            location.districts.find(
              (district) =>
                district.type === "LOCAL" &&
                district.districtId.toLowerCase() !== "at large"
            )?.label ?? districtLabel(location.districts, "LOCAL"),
          councilDistrictConfidence: "verified",
          congressionalDistrict: districtLabel(
            location.districts,
            "NATIONAL_LOWER"
          ),
          congressionalConfidence: "verified",
          stateSenateDistrict: districtLabel(location.districts, "STATE_UPPER"),
          stateSenateConfidence: "verified",
          stateHouseDistrict: districtLabel(location.districts, "STATE_LOWER"),
          stateHouseConfidence: "verified",
          representativeIds: officials.map((official) => official.id),
          topIssueIds: [],
          governmentOffice: "Cicero legislative district service",
          lastUpdated: new Date().toISOString(),
          latitude: location.match.latitude,
          longitude: location.match.longitude,
          mapTargets: {
            city: districtTarget(
              location.districts,
              (district) =>
                district.type === "LOCAL_EXEC" ||
                (district.type === "LOCAL" &&
                  district.districtId.toLowerCase() === "at large")
            ),
            county: { label: location.match.county || "County" },
            council: districtTarget(
              location.districts,
              (district) =>
                district.type === "LOCAL" &&
                district.districtId.toLowerCase() !== "at large"
            ),
            stateHouse: districtTarget(
              location.districts,
              (district) => district.type === "STATE_LOWER"
            ),
            stateSenate: districtTarget(
              location.districts,
              (district) => district.type === "STATE_UPPER"
            ),
            congressional: districtTarget(
              location.districts,
              (district) => district.type === "NATIONAL_LOWER"
            ),
          },
        });
      })
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") {
          setRepresentatives([]);
          setJurisdiction(null);
          setRepresentativesError(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setRepresentativesLoading(false);
      });

    return () => controller.abort();
  }, [
    hasCoordinates,
    latitude,
    legacyZip,
    locationInput,
    longitude,
    queryLocation,
    setResolvedLocation,
  ]);

  if (!locationInput && !hasCoordinates) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold">
          Enter an address or ZIP code to see your dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter any U.S. street address, ZIP code, or ZIP+4. A full address
          produces more precise jurisdiction matching than a ZIP centroid.
        </p>
        <ZipSearchForm className="mt-8" />
      </div>
    );
  }

  const visibleRepresentatives = representatives.filter(
    (representative) =>
      officeLevelFilter === "all" || representative.level === officeLevelFilter
  );
  const representativeLevels: { level: GovLevel; label: string }[] = [
    { level: "city", label: "Local" },
    { level: "state", label: "State" },
    { level: "federal", label: "Federal" },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Dashboard" }]} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-4 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Your Jurisdiction Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Personalized for{" "}
            {jurisdiction?.neighborhood ?? locationInput ?? "your location"}
          </p>
        </div>
      </motion.div>

      <div className="mt-6 rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
        <div className="mb-3">
          <h2 className="text-sm font-semibold">Search another location</h2>
          <p className="text-xs text-muted-foreground">
            Enter any U.S. street address, ZIP code, or ZIP+4 to update your
            dashboard.
          </p>
        </div>
        <ZipSearchForm destination="dashboard" />
      </div>

      <div className="mt-6">
        <QuickActions
          zip={jurisdiction?.zip ?? storedZip ?? ""}
          address={
            hasCoordinates
              ? jurisdiction?.neighborhood ?? storedLocation
              : locationInput
          }
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {jurisdiction ? (
          <LocationCard jurisdiction={jurisdiction} />
        ) : (
          <Card className="rounded-2xl border-border/80 p-6 text-sm text-muted-foreground">
            Resolving the exact jurisdiction for this location…
          </Card>
        )}

        <Card className="rounded-2xl border-border/80 shadow-sm lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4.5 text-primary" />
                Your Representatives
              </CardTitle>
              <Tabs
                value={officeLevelFilter}
                onValueChange={(value) =>
                  setOfficeLevelFilter((value || "all") as OfficeLevelFilter)
                }
              >
                <TabsList aria-label="Filter representatives by level">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="city">Local</TabsTrigger>
                  <TabsTrigger value="state">State</TabsTrigger>
                  <TabsTrigger value="federal">Federal</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {representativesLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading current officeholders…
              </p>
            ) : representativesError ? (
              <p className="text-sm text-destructive">{representativesError}</p>
            ) : visibleRepresentatives.length > 0 ? (
              <div className="space-y-6">
                {representativeLevels.map(({ level, label }) => {
                  const levelRepresentatives = visibleRepresentatives
                    .filter((representative) => representative.level === level)
                    .sort((representativeA, representativeB) => {
                      const rankDifference =
                        getOfficeRank(level, representativeA.office) -
                        getOfficeRank(level, representativeB.office);
                      return (
                        rankDifference ||
                        representativeA.office.localeCompare(
                          representativeB.office
                        )
                      );
                    });
                  if (levelRepresentatives.length === 0) return null;

                  return (
                    <section
                      key={level}
                      aria-labelledby={`representative-level-${level}`}
                    >
                      <div className="mb-2.5 flex items-center gap-3">
                        <h3
                          id={`representative-level-${level}`}
                          className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          {label}
                        </h3>
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs text-muted-foreground">
                          {levelRepresentatives.length}
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {levelRepresentatives.map((representative) => (
                          <RepresentativeListItem
                            key={representative.id}
                            representative={representative}
                            officeAsTag
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No{" "}
                {officeLevelFilter === "all"
                  ? "current"
                  : officeLevelFilter === "city"
                  ? "local"
                  : officeLevelFilter}{" "}
                officeholders were returned for this ZIP code.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
