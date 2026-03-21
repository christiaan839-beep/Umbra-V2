"use client";

/**
 * SKELETON — Reusable shimmer loading component.
 * Use across all dashboard pages for perceived instant loading.
 */
export function Skeleton({ className = "", variant = "line" }: { className?: string; variant?: "line" | "circle" | "card" }) {
  const base = "animate-pulse bg-white/[0.06] rounded";
  
  if (variant === "circle") {
    return <div className={`${base} rounded-full ${className}`} />;
  }
  
  if (variant === "card") {
    return (
      <div className={`${base} rounded-2xl p-6 space-y-4 ${className}`}>
        <div className="h-4 bg-white/[0.04] rounded w-1/3" />
        <div className="h-3 bg-white/[0.04] rounded w-full" />
        <div className="h-3 bg-white/[0.04] rounded w-2/3" />
        <div className="h-8 bg-white/[0.04] rounded w-1/2 mt-4" />
      </div>
    );
  }

  return <div className={`${base} h-4 ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-48" />
        ))}
      </div>
    </div>
  );
}

export function AgentCardSkeleton() {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="w-10 h-10" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton variant="circle" className="w-3 h-3" />
      </div>
      <Skeleton className="h-1 w-full" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
