import { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export const metadata: Metadata = {
  title:
    "Your Jurisdiction Dashboard | City of Detroit Voter Education Platform",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
