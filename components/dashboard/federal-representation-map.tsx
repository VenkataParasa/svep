"use client";

import * as React from "react";
import type { GeoJsonObject } from "geojson";
import type { GeoJSON as LeafletGeoJSON, Map as LeafletMap } from "leaflet";
import { MapIcon } from "lucide-react";

interface FederalMapData {
  state: GeoJsonObject;
  district: GeoJsonObject;
  districtNumber: string;
  stateName: string;
}

export function FederalRepresentationMap({ zip }: { zip: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<LeafletMap | null>(null);
  const stateLayerRef = React.useRef<LeafletGeoJSON | null>(null);
  const districtLayerRef = React.useRef<LeafletGeoJSON | null>(null);
  const [selected, setSelected] = React.useState(false);
  const [districtNumber, setDistrictNumber] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    async function initializeMap() {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [44.35, -85.6],
        zoom: 6,
        minZoom: 5,
        maxZoom: 12,
        zoomControl: true,
        maxBounds: [[41.2, -91], [49.2, -81]],
        maxBoundsViscosity: 1,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;

      try {
        const response = await fetch(`/api/federal-map-data?zip=${encodeURIComponent(zip)}`);
        const data: FederalMapData & { error?: string } = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load map boundaries.");
        if (cancelled) return;

        setDistrictNumber(data.districtNumber);
        const stateLayer = L.geoJSON(data.state, {
          style: {
            color: "#166534",
            weight: 2,
            fillColor: "#86efac",
            fillOpacity: 0.65,
          },
        }).addTo(map);
        const stateBounds = stateLayer.getBounds();
        map.setMaxBounds(stateBounds.pad(0.12));
        map.fitBounds(stateBounds, { padding: [20, 20], animate: false });
        map.setMinZoom(map.getBoundsZoom(stateBounds, false, L.point(20, 20)));
        stateLayer.bindTooltip("Michigan — select to view your congressional district", {
          sticky: true,
        });
        stateLayer.on("click", () => {
          if (cancelled) return;
          setSelected(true);
          stateLayer.setStyle({ fillOpacity: 0.18, weight: 1.5 });
          if (!districtLayerRef.current) {
            districtLayerRef.current = L.geoJSON(data.district, {
              interactive: false,
              style: {
                color: "#991b1b",
                weight: 3,
                fillColor: "#ef4444",
                fillOpacity: 0.62,
              },
            }).addTo(map);
          }
          map.flyToBounds(districtLayerRef.current.getBounds(), {
            padding: [36, 36],
            duration: 1.2,
          });
        });
        stateLayerRef.current = stateLayer;
      } catch (mapError) {
        setError(mapError instanceof Error ? mapError.message : "Unable to load map boundaries.");
      }
    }

    initializeMap();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      stateLayerRef.current = null;
      districtLayerRef.current = null;
    };
  }, [zip]);

  return (
    <figure className="mb-3 overflow-hidden rounded-xl border border-border bg-muted/20">
      <figcaption className="flex items-start gap-2 border-b border-border bg-muted/30 px-4 py-3">
        <MapIcon className="mt-0.5 size-4 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold">Federal representation map</p>
          <p className="text-xs text-muted-foreground">
            {selected && districtNumber
              ? `Michigan Congressional District ${districtNumber}, serving ZIP ${zip}`
              : "Select highlighted Michigan to view your congressional district"}
          </p>
        </div>
      </figcaption>
      <div className="relative">
        <div ref={containerRef} className="h-[420px] w-full bg-slate-100" aria-label="Interactive federal representation map" />
        {error && (
          <div className="absolute inset-x-4 bottom-4 z-[500] rounded-lg border border-destructive/30 bg-background/95 p-3 text-sm text-destructive shadow">
            {error}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm border border-green-700 bg-green-300" /> Michigan</span>
        {selected && <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm border-2 border-red-800 bg-red-400" /> Congressional district</span>}
      </div>
    </figure>
  );
}
