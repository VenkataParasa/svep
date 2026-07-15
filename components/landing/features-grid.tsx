"use client";

import { motion } from "framer-motion";
import {
  FileSearch,
  Landmark,
  ShieldCheck,
  Sparkles,
  MapPinned,
  Vote,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "Personalized by precise location",
    description:
      "See the exact representatives, districts, and issues relevant to your specific address — not a one-size-fits-all civics lesson.",
  },
  {
    icon: FileSearch,
    title: "Issue-first civic education",
    description:
      "Start from the civic issues you care about — housing, safety, transit — and see who's acting on them, instead of the other way around.",
  },
  {
    icon: ShieldCheck,
    title: "Full source transparency",
    description:
      "Every fact links back to an official source with a verification status, so you always know where the information came from.",
  },
  {
    icon: Landmark,
    title: "Real representatives & legislation",
    description:
      "Backed by current officeholders and real Michigan legislation — pulled from official .gov sources wherever possible.",
  },
  {
    icon: MapPinned,
    title: "Address-level jurisdiction matching",
    description:
      "Use a full address or coordinates for exact boundary matching, while ZIP-only searches remain clearly approximate.",
  },
  {
    icon: Vote,
    title: "Built for every voter",
    description:
      "Plain-language summaries, accessible design, and a clear audit trail make civic information usable for everyone.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Civic information, done right
        </h2>
        <p className="mt-3 text-muted-foreground">
          Everything you need to understand — and act on — the issues that shape your city.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: idx * 0.05 }}
          >
            <Card className="h-full rounded-2xl border-border/80 shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="size-5.5" />
                </div>
                <CardTitle className="mt-3 text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
