"use client";

import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  JurisdictionBoundaryMap,
  type BoundaryKind,
} from "@/components/dashboard/jurisdiction-boundary-map";

export function JurisdictionMapDialog({
  label,
  latitude,
  longitude,
  kind,
}: {
  label: string;
  latitude?: number | null;
  longitude?: number | null;
  kind: BoundaryKind;
}) {
  const canShow = Number.isFinite(latitude) && Number.isFinite(longitude);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={!canShow}
            aria-label={`View ${label} map`}
            title={canShow ? `View ${label} map` : `${label} map unavailable`}
            className="shrink-0 text-primary hover:bg-primary/10"
          />
        }
      >
        <Map className="size-4" />
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-4xl p-4 sm:max-w-4xl">
        <DialogHeader className="pr-8">
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            Zoomable jurisdiction boundary with the resolved location marked in
            green.
          </DialogDescription>
        </DialogHeader>
        {latitude != null && longitude != null ? (
          <JurisdictionBoundaryMap
            latitude={latitude}
            longitude={longitude}
            kind={kind}
            label={label}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
