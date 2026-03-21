import { DashboardSkeleton } from "@/components/ui/Skeleton";

/**
 * Dashboard Loading State — shows shimmer skeleton while page loads.
 * This is a Next.js convention that automatically wraps pages in Suspense.
 */
export default function DashboardLoading() {
  return <DashboardSkeleton />;
}
