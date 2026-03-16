export default function DashboardLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05]" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-48 bg-white/[0.05] rounded-lg" />
            <div className="h-3 w-72 bg-white/[0.03] rounded-lg" />
          </div>
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 backdrop-blur-xl"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05]" />
              <div className="h-4 w-28 bg-white/[0.05] rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/[0.03] rounded" />
              <div className="h-3 w-4/5 bg-white/[0.03] rounded" />
              <div className="h-3 w-3/5 bg-white/[0.02] rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Panel Skeleton */}
      <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 backdrop-blur-xl">
        <div className="h-4 w-40 bg-white/[0.05] rounded-lg mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 bg-white/[0.03] rounded w-full" style={{ width: `${100 - i * 15}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
