"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useZipContextStore } from "@/store/zip-context-store";

export function ZipSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contextZip = useZipContextStore((state) => state.zip);
  
  // Initialize with URL param, fallback to context zip, or empty
  const initialZip = searchParams.get("zip") || contextZip || "";
  const [location, setLocation] = React.useState(initialZip);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      router.push(`/officials?zip=${encodeURIComponent(location.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          autoComplete="street-address"
          placeholder="Enter full address, ZIP code, or ZIP+4..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="pl-9 bg-background/50 backdrop-blur-sm border-border"
        />
      </div>
      <Button type="submit" variant="default" className="shadow-sm">
        Search
      </Button>
    </form>
  );
}
