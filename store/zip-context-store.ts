"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { zipCodes } from "@/data/jurisdictions";

interface ZipContextState {
  zip: string | null;
  setZip: (zip: string) => void;
  clearZip: () => void;
}

export const isValidZip = (zip: string): boolean =>
  (zipCodes as readonly string[]).includes(zip);

export const useZipContextStore = create<ZipContextState>()(
  persist(
    (set) => ({
      zip: null,
      setZip: (zip) => set({ zip }),
      clearZip: () => set({ zip: null }),
    }),
    { name: "svep-zip-context" }
  )
);
