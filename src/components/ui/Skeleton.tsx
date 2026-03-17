"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-white/[0.04] rounded-lg ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card border border-glass-border p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
      <div className="space-y-2 mt-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
      <Skeleton className="h-10 w-full mt-4 rounded-xl" />
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-black/40 backdrop-blur-2xl border border-[#00B7FF]/10 rounded-2xl p-5">
      <Skeleton className="h-5 w-5 rounded mb-3" />
      <Skeleton className="h-7 w-20 mb-2" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass-card border border-glass-border overflow-hidden">
      <div className="px-6 py-4 border-b border-glass-border bg-black/40">
        <Skeleton className="h-4 w-32" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 border-b border-glass-border flex items-center gap-6">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/6" />
          <Skeleton className="h-3 w-1/5" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
