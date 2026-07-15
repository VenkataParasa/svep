"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useZipContextStore } from "@/store/zip-context-store";

export function AddressSearchForm({ defaultAddress }: { defaultAddress?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const globalZip = useZipContextStore((state) => state.zip);
  const setGlobalZip = useZipContextStore((state) => state.setZip);
  
  const initialAddress = defaultAddress || searchParams.get("address") || globalZip || "48226";
  const [address, setAddress] = React.useState(initialAddress);

  React.useEffect(() => {
    // If the URL has no address but we have a saved state, restore it (handles back-button to empty URL)
    if (!searchParams.has("address") && globalZip) {
      const params = new URLSearchParams(searchParams);
      params.set("address", globalZip);
      router.replace(`/officials-new?${params.toString()}`);
      return;
    }

    const currentParam = searchParams.get("address");
    if (defaultAddress) {
      setAddress(defaultAddress);
    } else if (currentParam) {
      setAddress(currentParam);
    }
  }, [defaultAddress, searchParams, globalZip, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      // The shared dashboard context stores ZIP codes only. Keep a full street
      // address in this page's URL without replacing the dashboard ZIP.
      if (/^\d{5}(?:-\d{4})?$/.test(address.trim())) {
        setGlobalZip(address.trim().slice(0, 5));
      }
      const params = new URLSearchParams(searchParams);
      params.set("address", address.trim());
      router.push(`/officials-new?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <div className="relative flex-1">
        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter full address, ZIP code, or ZIP+4..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="pl-9"
        />
      </div>
      <Button type="submit">
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
}
