import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] w-full text-center relative z-10 animate-fade-in">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,183,255,0.03),transparent_40%)] pointer-events-none" />
      
      <div className="relative">
        {/* Core Reactor Ring */}
        <div className="w-16 h-16 rounded-full border-4 border-[#00B7FF]/10 border-t-[#00B7FF] animate-spin shadow-[0_0_30px_rgba(0,183,255,0.3)]" />
        {/* Inner Reactor */}
        <div className="absolute inset-0 m-auto w-8 h-8 rounded-full border-4 border-purple-500/10 border-b-purple-500 animate-spin-reverse shadow-[0_0_20px_rgba(168,85,247,0.3)]" />
        <Loader2 className="absolute inset-0 m-auto w-4 h-4 text-white animate-pulse" />
      </div>

      <div className="mt-8 space-y-2">
        <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white font-mono flex items-center justify-center gap-2">
          Syncing Neuro-Link <span className="flex gap-0.5"><span className="w-1 h-1 bg-[#00B7FF] rounded-full animate-ping delay-75" /><span className="w-1 h-1 bg-[#00B7FF] rounded-full animate-ping delay-150" /><span className="w-1 h-1 bg-[#00B7FF] rounded-full animate-ping delay-300" /></span>
        </h3>
        <p className="text-[10px] uppercase tracking-widest text-[#5C667A] font-medium">
          Retrieving Data from SOVEREIGN Vector Matrix
        </p>
      </div>

      {/* Decorative Progress Bar Skeleton */}
      <div className="mt-6 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-transparent via-[#00B7FF] to-transparent w-full animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
      </div>
    </div>
  );
}
