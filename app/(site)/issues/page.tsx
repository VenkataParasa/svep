import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getLiveIssues } from "@/lib/live-issues";
import { LiveIssuesClient } from "@/components/issues/live-issues-client";

export const metadata = {
  title: "Civic Issues | Live API Integration",
  description: "Explore civic issues with recent legislation and news coverage.",
};

export const dynamic = "force-dynamic";

export default async function IssuesPage() {
  const issues = await getLiveIssues();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Civic Issues (Live)" }]} />
      <Suspense fallback={<div className="mt-8 text-center text-muted-foreground">Loading...</div>}>
        <LiveIssuesClient initialIssues={issues} />
      </Suspense>
    </div>
  );
}
