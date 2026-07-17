import type { Metadata } from "next";
import { Info, Vote } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { KnowYourBallotContent } from "@/components/candidates/know-your-ballot-content";

export const metadata: Metadata = {
  title: "Active Candidates | City of Detroit Voter Education Platform",
  description: "Review active candidates by upcoming election and office.",
};

export default function KnowYourBallotPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Active Candidates" }]} />

      <div className="mt-5 flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Vote className="size-6" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Active Candidates
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Explore active candidates running in upcoming Michigan elections.
            Filter the list by election and the office being contested.
          </p>
        </div>
      </div>

      {/* <div className="mt-5 flex gap-3 rounded-xl border border-blue-600/20 bg-blue-600/5 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-blue-700 dark:text-blue-400" />
        <p>
          Candidate information is a sourced snapshot and is not a live ballot feed. Confirm filing status and your exact ballot with the appropriate election authority.
        </p>
      </div> */}

      <KnowYourBallotContent />
    </div>
  );
}
