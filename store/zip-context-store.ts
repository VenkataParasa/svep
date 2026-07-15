"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ZipContextState {
  zip: string | null;
  location: string | null;
  setZip: (zip: string) => void;
  setLocation: (location: string) => void;
  setResolvedLocation: (location: string, zip: string | null) => void;
  clearZip: () => void;
}

export const isValidZip = (zip: string): boolean =>
  /^\d{5}$/.test(zip.trim());

export const useZipContextStore = create<ZipContextState>()(
  persist(
    (set) => ({
      zip: null,
      location: null,
      setZip: (zip) => set({ zip }),
      setLocation: (location) => set({ location }),
      setResolvedLocation: (location, zip) => set({ location, zip }),
      clearZip: () => set({ zip: null, location: null }),
    }),
    { name: "svep-zip-context" }
  )
);
