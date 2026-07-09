import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { WhyThisInformationContent } from "@/components/transparency/why-this-information-content";

export const metadata: Metadata = {
  title: "Why This Information | City of Detroit Voter Education Platform",
};

export default function WhyThisInformationPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      }
    >
      <WhyThisInformationContent />
    </Suspense>
  );
}
