"use client";

import * as React from "react";
import { ChevronDown, Landmark, LockKeyhole } from "lucide-react";

// USA.gov-style official-website banner, adapted for the City of Detroit.
// This is the single strongest visual cue that a site is a government
// property, so it sits above the header on every public page.
export function GovBanner() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border-b border-primary/20 bg-[#0b3d7a] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2 py-1.5 text-left text-xs"
          aria-expanded={open}
        >
          <Landmark className="size-3.5 shrink-0" />
          <span>An official voter education service of the City of Detroit</span>
          <span className="hidden items-center gap-1 underline decoration-white/60 underline-offset-2 sm:flex">
            Here&rsquo;s how you know
            <ChevronDown className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} />
          </span>
        </button>
        {open && (
          <div className="grid grid-cols-1 gap-4 pb-3 pt-1 text-xs sm:grid-cols-2">
            <div className="flex gap-2.5">
              <Landmark className="mt-0.5 size-8 shrink-0 rounded-full bg-white/10 p-1.5" />
              <p>
                <span className="font-semibold">Official websites use .gov.</span>
                <br />
                <span className="text-white/80">
                  City of Detroit services are published at{" "}
                  <a
                    href="https://detroitmi.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    detroitmi.gov
                  </a>
                  . This demonstration platform cites official .gov sources on every page.
                </span>
              </p>
            </div>
            <div className="flex gap-2.5">
              <LockKeyhole className="mt-0.5 size-8 shrink-0 rounded-full bg-white/10 p-1.5" />
              <p>
                <span className="font-semibold">Transparent by design.</span>
                <br />
                <span className="text-white/80">
                  Every summary links to the public source documents it was built from — see the
                  Sources section on any page.
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
