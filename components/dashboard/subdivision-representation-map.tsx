"use client";

import * as React from "react";
import type { GeoJsonObject } from "geojson";
import type { Map as LeafletMap } from "leaflet";
import { MapIcon } from "lucide-react";

type MapKind = "state" | "local";

interface MapPayload {
  state: GeoJsonObject;
  senate?: GeoJsonObject;
  house?: GeoJsonObject;
  county?: GeoJsonObject;
  senateNumber?: string;
  houseNumber?: string;
  countyName?: string;
  error?: string;
}

export function SubdivisionRepresentationMap({ zip, kind }: { zip: string; kind: MapKind }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<LeafletMap | null>(null);
  const [selected, setSelected] = React.useState(false);
  const [details, setDetails] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;
    let revealed = false;

    async function initialize() {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;
      const map = L.map(containerRef.current, {
        center: [44.35, -85.6],
        zoom: 6,
        minZoom: 5,
        maxZoom: 13,
        maxBounds: [[41.2, -91], [49.2, -81]],
        maxBoundsViscosity: 1,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      mapRef.current = map;

      try {
        const response = await fetch(`/api/${kind === "state" ? "state" : "local"}-map-data?zip=${encodeURIComponent(zip)}`);
        const data: MapPayload = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load boundaries.");
        if (cancelled) return;

        const stateLayer = L.geoJSON(data.state, {
          style: { color: "#166534", weight: 2, fillColor: "#86efac", fillOpacity: 0.62 },
        }).addTo(map);
        const stateBounds = stateLayer.getBounds();
        map.setMaxBounds(stateBounds.pad(0.12));
        map.fitBounds(stateBounds, { padding: [20, 20], animate: false });
        map.setMinZoom(map.getBoundsZoom(stateBounds, false, L.point(20, 20)));
        stateLayer.bindTooltip(`Michigan — select to view ${kind === "state" ? "legislative districts" : "Wayne County"}`, { sticky: true });
        stateLayer.on("click", () => {
          if (revealed || cancelled) return;
          revealed = true;
          setSelected(true);
          stateLayer.setStyle({ fillOpacity: 0.12, weight: 1.5 });
          if (kind === "state" && data.senate && data.house) {
            const senateLayer = L.geoJSON(data.senate, { interactive: false, style: { color: "#1d4ed8", weight: 3, fillColor: "#60a5fa", fillOpacity: 0.48 } }).addTo(map);
            const houseLayer = L.geoJSON(data.house, { interactive: false, style: { color: "#9a3412", weight: 3, fillColor: "#fb923c", fillOpacity: 0.58 } }).addTo(map);
            setDetails(`State Senate District ${data.senateNumber} and State House District ${data.houseNumber}`);
            const focusedBounds = senateLayer.getBounds();
            focusedBounds.extend(houseLayer.getBounds());
            map.flyToBounds(focusedBounds, { padding: [36, 36], duration: 1.2 });
            return;
          } else if (data.county) {
            const countyLayer = L.geoJSON(data.county, { interactive: false, style: { color: "#6d28d9", weight: 3, fillColor: "#a78bfa", fillOpacity: 0.6 } }).addTo(map);
            map.flyToBounds(countyLayer.getBounds(), { padding: [24, 24], duration: 1.2 });
            setDetails(data.countyName || "County boundary");
            return;
          }
        });
      } catch (mapError) {
        setError(mapError instanceof Error ? mapError.message : "Unable to load boundaries.");
      }
    }

    initialize();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [kind, zip]);

  const title = kind === "state" ? "State legislative representation map" : "County representation map";
  return (
    <figure className="mb-3 overflow-hidden rounded-xl border border-border bg-muted/20">
      <figcaption className="flex items-start gap-2 border-b bg-muted/30 px-4 py-3">
        <MapIcon className="mt-0.5 size-4 shrink-0 text-primary" />
        <div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">{details || `Select Michigan to view ${kind === "state" ? "your State Senate and House districts" : "your county"}`}</p></div>
      </figcaption>
      <div className="relative"><div ref={containerRef} className="h-[380px] w-full bg-slate-100" />{error && <div className="absolute inset-x-4 bottom-4 z-[500] rounded-lg border bg-background/95 p-3 text-sm text-destructive shadow">{error}</div>}</div>
      <div className="flex flex-wrap gap-4 border-t px-4 py-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm border border-green-700 bg-green-300" /> Michigan</span>
        {selected && kind === "state" && <><span className="flex items-center gap-1.5"><span className="size-3 rounded-sm border border-blue-700 bg-blue-400" /> State Senate</span><span className="flex items-center gap-1.5"><span className="size-3 rounded-sm border border-orange-800 bg-orange-400" /> State House</span></>}
        {selected && kind === "local" && <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm border border-violet-800 bg-violet-400" /> Wayne County</span>}
      </div>
      {kind === "local" && <p className="border-t px-4 py-2 text-xs text-muted-foreground">Detroit City Council boundary detail remains available in the Your Location &amp; Jurisdiction map.</p>}
    </figure>
  );
}
