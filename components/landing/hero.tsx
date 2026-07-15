"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ZipSearchForm } from "@/components/landing/zip-search-form";

export function Hero() {
  return (
    <section
      id="zip-search"
      className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/60 via-background to-background"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,var(--primary)_0,transparent_35%)] opacity-[0.08]"
      />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-5 border-primary/30 bg-primary/5 text-primary"
            >
              City of Detroit · Department of Elections
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Understand the issues shaping{" "}
            <span className="text-primary">your Detroit neighborhood</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground"
          >
            Enter your full address or ZIP code to see your current
            officeholders, legislative jurisdictions, and civic issues - every
            summary is built from official government records and links back to
            its sources.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mx-auto mt-9 max-w-xl"
          >
            <ZipSearchForm showGeolocation />
            <p className="mt-3 text-xs text-muted-foreground">
              Enter a ZIP code for an approximate match, or a full street
              address or ZIP+4 for more precise jurisdiction routing through
              Cicero. Device location is optional and requested only after you
              select “Use my location.”
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
