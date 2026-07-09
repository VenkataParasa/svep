import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchPageContent } from "@/components/search/search-page-content";

export const metadata: Metadata = {
  title: "Search | City of Detroit Voter Education Platform",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
