"use client";

import * as React from "react";
import type { GeoJsonObject } from "geojson";
import type { Map as LeafletMap } from "leaflet";

export type BoundaryKind =
  | "city"
  | "county"
  | "council"
  | "stateHouse"
  | "stateSenate"
  | "congressional";

export function JurisdictionBoundaryMap({
  latitude,
  longitude,
  kind,
  label,
}: {
  latitude: number;
  longitude: number;
  kind: BoundaryKind;
  label: string;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<LeafletMap | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    async function initialize() {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;
      const map = L.map(containerRef.current, {
        center: [latitude, longitude],
        zoom: 9,
        minZoom: 4,
        maxZoom: 16,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      mapRef.current = map;

      try {
        const response = await fetch(
          `/api/jurisdiction-boundary?kind=${kind}&lat=${latitude}&lon=${longitude}`,
        );
        const payload = (await response.json()) as {
          boundary?: GeoJsonObject;
          error?: string;
        };
        if (!response.ok || !payload.boundary) {
          throw new Error(payload.error || "Jurisdiction boundary is unavailable.");
        }
        if (cancelled) return;
        const layer = L.geoJSON(payload.boundary, {
          style: {
            color: "#991b1b",
            weight: 3,
            fillColor: "#ef4444",
            fillOpacity: 0.3,
          },
        })
          .bindTooltip(label, { sticky: true })
          .addTo(map);
        map.fitBounds(layer.getBounds(), { padding: [28, 28], animate: false });
        L.circleMarker([latitude, longitude], {
          radius: 6,
          color: "#14532d",
          fillColor: "#22c55e",
          fillOpacity: 1,
          weight: 2,
        })
          .bindTooltip("Resolved location")
          .addTo(map);
      } catch (mapError) {
        setError(
          mapError instanceof Error
            ? mapError.message
            : "Jurisdiction boundary is unavailable.",
        );
      }
    }

    initialize();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [kind, label, latitude, longitude]);

  return (
    <div className="relative overflow-hidden rounded-xl border bg-muted/20">
      <div ref={containerRef} className="h-[min(65vh,520px)] w-full bg-slate-100" />
      {error && (
        <div className="absolute inset-x-4 bottom-4 z-[500] rounded-lg border bg-background/95 p-3 text-sm text-destructive shadow">
          {error}
        </div>
      )}
    </div>
  );
}
