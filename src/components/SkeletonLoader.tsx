import React from "react";

/**
 * Reusable glassmorphic skeleton loading components.
 * Usage: <SkeletonCard /> or <SkeletonKPI count={4} />
 */

export function SkeletonPulse({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-xl ${className}`} style={style} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-4 w-24" />
        <SkeletonPulse className="h-8 w-8 rounded-xl" />
      </div>
      <SkeletonPulse className="h-8 w-32" />
      <SkeletonPulse className="h-3 w-full" />
      <SkeletonPulse className="h-3 w-3/4" />
    </div>
  );
}

export function SkeletonKPI({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-3">
          <SkeletonPulse className="h-3 w-20" />
          <SkeletonPulse className="h-7 w-16" />
          <SkeletonPulse className="h-2 w-12" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/5 flex gap-4">
        <SkeletonPulse className="h-4 w-32" />
        <SkeletonPulse className="h-4 w-24" />
        <SkeletonPulse className="h-4 w-20" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-white/5 flex gap-4 items-center">
          <SkeletonPulse className="h-3 w-40" />
          <SkeletonPulse className="h-3 w-20" />
          <SkeletonPulse className="h-3 w-16" />
          <SkeletonPulse className="h-6 w-6 rounded-lg ml-auto" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-4 w-28" />
        <SkeletonPulse className="h-6 w-20 rounded-lg" />
      </div>
      <div className="flex items-end gap-2 h-32">
        {[45, 72, 30, 85, 55, 90, 40, 65, 50, 78, 35, 60].map((h, i) => (
          <SkeletonPulse key={i} className="flex-1 rounded-t-lg" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="min-h-[calc(100vh-2rem)] flex flex-col gap-6 p-4 lg:p-8 z-10 relative animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonPulse className="h-6 w-48" />
          <SkeletonPulse className="h-3 w-32" />
        </div>
        <SkeletonPulse className="h-10 w-28 rounded-xl" />
      </div>
      <SkeletonKPI />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart />
        <SkeletonTable rows={4} />
      </div>
    </div>
  );
}
