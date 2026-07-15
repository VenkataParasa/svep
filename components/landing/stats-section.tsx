"use client";

import { motion } from "framer-motion";
import { issues } from "@/data/issues";
import { sources } from "@/data/sources";

const stats = [
  { label: "Location coverage", value: "U.S." },
  { label: "Elected officials", value: "Live" },
  { label: "Civic issue categories", value: `${issues.length}` },
  { label: "Cataloged official sources", value: `${sources.length}+` },
];

export function StatsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-6 rounded-2xl border border-border bg-card p-8 shadow-sm sm:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.07 }}
            className="text-center"
          >
            <div className="text-3xl font-semibold text-primary sm:text-4xl">{stat.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
