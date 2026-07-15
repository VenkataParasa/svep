import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground shadow-lg sm:px-16">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,white_0,transparent_45%)] opacity-10"
        />
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Your neighborhood. Your issues. Your vote.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-balance text-primary-foreground/85">
          Look up your address or ZIP code and see exactly who represents you and what&rsquo;s on the table.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            variant="secondary"
            className="gap-2 rounded-xl"
            render={<Link href="/#zip-search" />}
          >
            Get Started
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            render={<Link href="/issues" />}
          >
            Browse Issues
          </Button>
        </div>
      </div>
    </section>
  );
}
