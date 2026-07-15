"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Flag,
  Landmark,
  LoaderCircle,
  LocateFixed,
  Map,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { isValidZip, useZipContextStore } from "@/store/zip-context-store";

type District = {
  mapId: number | null;
  type: string;
  districtId: string;
  label: string;
  subtype: string | null;
  state: string | null;
  city: string | null;
  country: string | null;
  officialCount: number;
  officials: Array<{
    id: string | null;
    name: string;
    title: string;
    party: string;
    photoUrl: string;
    website: string | null;
  }>;
};

type JurisdictionResult = {
  query: { type: "coordinates" | "text"; value?: string };
  match: {
    formattedAddress: string;
    city: string;
    county: string;
    state: string;
    postalCode: string;
    country: string;
    latitude: number;
    longitude: number;
    score: number | null;
    partialMatch: boolean;
  };
  districts: District[];
  alternativeMatches: number;
};

type Level = "local" | "state" | "federal";

const levelDetails: Array<{
  id: Level;
  title: string;
  description: string;
  icon: typeof Landmark;
}> = [
  {
    id: "local",
    title: "Local jurisdictions",
    description: "Municipal and other local legislative districts closest to you.",
    icon: Building2,
  },
  {
    id: "state",
    title: "State jurisdictions",
    description: "State executive, Senate, and House districts containing your location.",
    icon: Landmark,
  },
  {
    id: "federal",
    title: "Federal jurisdictions",
    description: "National offices and congressional districts containing your location.",
    icon: Flag,
  },
];

function getLevel(type: string): Level {
  if (type.startsWith("NATIONAL")) return "federal";
  if (type.startsWith("STATE")) return "state";
  return "local";
}

function typeLabel(type: string) {
  const labels: Record<string, string> = {
    NATIONAL_EXEC: "National executive",
    NATIONAL_UPPER: "U.S. Senate",
    NATIONAL_LOWER: "U.S. House",
    STATE_EXEC: "State executive",
    STATE_UPPER: "State Senate",
    STATE_LOWER: "State House",
    LOCAL_EXEC: "Local executive",
    LOCAL: "Local legislature",
  };
  return labels[type] ?? type.toLowerCase().replaceAll("_", " ");
}

function rankDistrict(district: District) {
  const order = [
    "LOCAL_EXEC",
    "LOCAL",
    "STATE_EXEC",
    "STATE_UPPER",
    "STATE_LOWER",
    "NATIONAL_EXEC",
    "NATIONAL_UPPER",
    "NATIONAL_LOWER",
  ];
  const rank = order.indexOf(district.type);
  return rank === -1 ? order.length : rank;
}

export function JurisdictionExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location") ?? "";
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const [location, setLocation] = React.useState(locationParam);
  const [result, setResult] = React.useState<JurisdictionResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [locating, setLocating] = React.useState(false);
  const setResolvedLocation = useZipContextStore(
    (state) => state.setResolvedLocation,
  );

  React.useEffect(() => setLocation(locationParam), [locationParam]);

  React.useEffect(() => {
    if (!locationParam && !(lat && lon)) {
      setResult(null);
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams();
    if (lat && lon) {
      params.set("lat", lat);
      params.set("lon", lon);
    } else {
      params.set("location", locationParam);
    }

    setLoading(true);
    setError(null);
    fetch(`/api/legislative-districts?${params.toString()}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "Unable to resolve that location.");
        }
        const data = payload.data as JurisdictionResult;
        setResult(data);
        const resolvedZip = data.match.postalCode.match(/\b\d{5}\b/)?.[0] ?? null;
        setResolvedLocation(
          locationParam || data.match.formattedAddress,
          resolvedZip,
        );
      })
      .catch((fetchError) => {
        if (fetchError instanceof Error && fetchError.name !== "AbortError") {
          setResult(null);
          setError(fetchError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [locationParam, lat, lon, setResolvedLocation]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = location.trim();
    if (!value) {
      setError("Enter an address, ZIP code, or ZIP+4.");
      return;
    }
    router.push(`/jurisdictions?location=${encodeURIComponent(value)}`);
  }

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setError("Location detection is not supported by this browser.");
      return;
    }

    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        router.push(
          `/jurisdictions?lat=${coords.latitude.toFixed(6)}&lon=${coords.longitude.toFixed(6)}`,
        );
      },
      (geolocationError) => {
        setLocating(false);
        setError(
          geolocationError.code === geolocationError.PERMISSION_DENIED
            ? "Location permission was denied. Enter your address or ZIP code instead."
            : "Your current location could not be detected. Enter it manually instead.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  const dashboardZip = result?.match.postalCode.match(/\b\d{5}\b/)?.[0];

  return (
    <div className="space-y-8">
      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={submit} className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                type="text"
                autoComplete="street-address"
                placeholder="Full address, ZIP code, or ZIP+4"
                className="h-11 pl-9"
                aria-label="Address or ZIP code"
              />
            </div>
            <Button type="submit" className="h-11 gap-2" disabled={loading}>
              {loading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
              Find jurisdictions
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 gap-2"
              onClick={useCurrentLocation}
              disabled={locating}
            >
              {locating ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <LocateFixed className="size-4" />
              )}
              Use my location
            </Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            Location access is optional and requested only after you select “Use my location.”
          </p>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Location could not be resolved</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && !result && (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border bg-card">
          <div className="text-center text-muted-foreground">
            <LoaderCircle className="mx-auto size-7 animate-spin" />
            <p className="mt-3 text-sm">Matching your location to legislative boundaries…</p>
          </div>
        </div>
      )}

      {!loading && !result && !error && (
        <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-14 text-center">
          <Map className="mx-auto size-10 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Find every jurisdiction for your location</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Enter a postal code for an approximate match, a full address for a more precise match,
            or share your current coordinates for the most precise boundary lookup.
          </p>
        </div>
      )}

      {result && (
        <>
          <Card className="overflow-hidden rounded-2xl border-primary/20 bg-primary/[0.03] shadow-sm">
            <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">Cicero location match</Badge>
                  {result.match.score !== null && (
                    <Badge variant="outline">Match score {result.match.score}</Badge>
                  )}
                  {result.match.partialMatch && (
                    <Badge variant="destructive">Partial match</Badge>
                  )}
                </div>
                <h2 className="mt-3 text-xl font-semibold">{result.match.formattedAddress}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {[result.match.county, result.match.state, result.match.postalCode]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {result.alternativeMatches > 0 && (
                  <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                    Cicero found {result.alternativeMatches} alternative match
                    {result.alternativeMatches === 1 ? "" : "es"}; the highest-scoring match is shown.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {dashboardZip && isValidZip(dashboardZip) && (
                  <Button
                    variant="outline"
                    render={<Link href={`/dashboard?zip=${dashboardZip}`} />}
                  >
                    Open civic dashboard
                  </Button>
                )}
                <Button
                  render={
                    <Link
                    href={`/officials?zip=${encodeURIComponent(
                      result.match.formattedAddress || result.match.postalCode,
                    )}`}
                    />
                  }
                >
                  View elected officials
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            {levelDetails.map(({ id, title, description, icon: Icon }) => {
              const districts = result.districts
                .filter((district) => getLevel(district.type) === id)
                .sort((a, b) => rankDistrict(a) - rankDistrict(b));
              if (districts.length === 0) return null;

              return (
                <section key={id} aria-labelledby={`${id}-jurisdictions`}>
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h2 id={`${id}-jurisdictions`} className="text-xl font-semibold">
                        {title}
                      </h2>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {districts.map((district, index) => {
                      const isDetroitLocal =
                        id === "local" &&
                        (district.city?.toLowerCase().includes("detroit") ||
                          result.match.city.toLowerCase().includes("detroit"));
                      const visual =
                        id === "federal" && district.country === "US"
                          ? { src: "/us-flag.svg", alt: "United States flag" }
                          : id === "state" && district.state === "MI"
                            ? {
                                src: "/michigan-mark.svg",
                                alt: "Michigan geographic identifier",
                              }
                            : isDetroitLocal
                              ? {
                                  src: "/detroit-logo.png",
                                  alt: "City of Detroit logo",
                                }
                              : null;
                      return (
                        <Dialog
                          key={`${district.type}-${district.mapId ?? district.districtId}-${index}`}
                        >
                          <DialogTrigger
                            render={
                              <button
                                type="button"
                                className="group rounded-2xl text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                                aria-label={`View ${district.officialCount} officeholders for ${district.label}`}
                              />
                            }
                          >
                            <Card className="h-full overflow-hidden rounded-2xl border-border/80 shadow-sm transition group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-md">
                              <div className="relative flex aspect-[16/7] items-center justify-center overflow-hidden border-b bg-gradient-to-br from-primary/15 via-primary/5 to-background">
                                <div className="absolute -right-8 -top-10 size-32 rounded-full bg-primary/10" />
                                <div className="absolute -bottom-12 -left-8 size-28 rounded-full bg-primary/10" />
                                {visual ? (
                                  <div className="relative flex h-20 w-28 items-center justify-center rounded-xl border border-primary/15 bg-white p-3 shadow-sm">
                                    <Image
                                      src={visual.src}
                                      alt={visual.alt}
                                      fill
                                      sizes="112px"
                                      className="object-contain p-3"
                                    />
                                  </div>
                                ) : (
                                  <div className="relative flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-background/90 text-primary shadow-sm">
                                    <Building2 className="size-8" aria-hidden="true" />
                                  </div>
                                )}
                              </div>
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between gap-3">
                                  <Badge variant="outline">{typeLabel(district.type)}</Badge>
                                  {district.districtId && (
                                    <span className="text-xs text-muted-foreground">
                                      District {district.districtId}
                                    </span>
                                  )}
                                </div>
                                <CardTitle className="pt-2 text-base leading-snug">
                                  {district.label}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <p>
                                  {[district.city, district.state, district.subtype]
                                    .filter(Boolean)
                                    .join(" · ") || "Jurisdiction returned for this location"}
                                </p>
                                <div className="flex items-center justify-between border-t pt-3">
                                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                                    <Users className="size-4 text-primary" />
                                    {district.officialCount} officeholder
                                    {district.officialCount === 1 ? "" : "s"}
                                  </span>
                                  <span className="text-xs text-primary">View officials</span>
                                </div>
                              </CardContent>
                            </Card>
                          </DialogTrigger>
                          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{district.label}</DialogTitle>
                              <DialogDescription>
                                {typeLabel(district.type)} · {district.officialCount} elected
                                officeholder{district.officialCount === 1 ? "" : "s"}
                              </DialogDescription>
                            </DialogHeader>
                            {district.officials.length > 0 ? (
                              <div className="divide-y rounded-xl border">
                                {district.officials.map((official) => (
                                  <div
                                    key={`${official.id ?? official.name}-${official.title}`}
                                    className="flex items-center gap-3 p-3"
                                  >
                                    <PersonAvatar
                                      name={official.name}
                                      photoUrl={official.photoUrl}
                                      size="md"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold">{official.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {official.title}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {official.party}
                                      </p>
                                    </div>
                                    {official.website && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        render={
                                          <Link
                                            href={official.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          />
                                        }
                                      >
                                        Website
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
                                Cicero did not return an elected officeholder for this jurisdiction.
                              </p>
                            )}
                            <DialogFooter>
                              <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {result.districts.length === 0 && (
            <Alert>
              <AlertTitle>No legislative districts returned</AlertTitle>
              <AlertDescription>
                Cicero matched the location but did not return a covered legislative boundary.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}
