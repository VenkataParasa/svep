import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-6 w-56" />
      <Skeleton className="mt-4 h-10 w-96 max-w-full" />
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Skeleton className="h-48 rounded-2xl lg:col-span-1" />
        <Skeleton className="h-48 rounded-2xl lg:col-span-2" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
