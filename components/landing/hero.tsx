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
            <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/5 text-primary">
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
            Enter your ZIP code to see your current officeholders, active candidates,
            and the civic issues affecting your area — every summary is built from
            official government records and links back to its sources.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mx-auto mt-9 max-w-xl"
          >
            <ZipSearchForm />
            <p className="mt-3 text-xs text-muted-foreground">
              This demonstration covers 37 Detroit-area ZIP codes (48201&ndash;48243).
              Street-address-level routing is planned for the production system.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
