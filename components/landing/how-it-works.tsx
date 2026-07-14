"use client";

import { motion } from "framer-motion";
import { MapPin, LayoutDashboard, BookOpenCheck } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "1. Enter your address or ZIP code",
    description:
      "Tell us where you live in Detroit — we cover Downtown, Midtown, New Center, and the North End to start.",
  },
  {
    icon: LayoutDashboard,
    title: "2. Get your personalized dashboard",
    description:
      "See your exact jurisdiction, representatives at every level of government, and the issues most active in your area.",
  },
  {
    icon: BookOpenCheck,
    title: "3. Explore issues with full transparency",
    description:
      "Dig into plain-language summaries, related legislation, and always see exactly which official source backs each fact.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How it works</h2>
          <p className="mt-3 text-muted-foreground">Three steps to a clearer picture of your city.</p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <step.icon className="size-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
