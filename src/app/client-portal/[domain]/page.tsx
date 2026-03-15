import { Suspense } from "react";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { whitelabelConfig } from "@/db/schema";
import { Activity, MessageCircle, MapPin, Zap, Target, CheckCircle2, Shield } from "lucide-react";

interface Props {
  params: Promise<{ domain: string }>;
}

// Ensure dynamic rendering
export const dynamic = "force-dynamic";

async function getClientConfig(domain: string) {
  const config = await db.query.whitelabelConfig.findFirst({
    where: eq(whitelabelConfig.domain, domain),
  });
  return config || null;
}

export default async function WhiteLabelPortal({ params }: Props) {
  const resolvedParams = await params;
  const config = await getClientConfig(resolvedParams.domain);

  if (!config) {
    notFound();
  }

  return (
    <div 
      className="min-h-screen font-sans text-neutral-200"
      style={{
        backgroundColor: "#050505", // Deep midnight base
        backgroundImage: `radial-gradient(circle at top right, ${config.primaryColor}15, transparent 40%)` // Subtle brand glow
      }}
    >
      {/* Branded Top Bar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {config.logoUrl ? (
               <img src={config.logoUrl} alt={config.agencyName} className="h-8 object-contain" />
             ) : (
               <div 
                 className="w-8 h-8 rounded flex items-center justify-center font-bold text-white shadow-lg"
                 style={{ backgroundColor: config.primaryColor || '#00B7FF' }}
               >
                 <Shield className="w-4 h-4" />
               </div>
             )}
             <span className="text-sm font-bold tracking-widest uppercase text-white hidden sm:block">
               {config.agencyName} — Command Center
             </span>
          </div>
          <div className="flex items-center gap-4">
             <div 
               className="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
               style={{ 
                 borderColor: `${config.primaryColor}30`, 
                 backgroundColor: `${config.primaryColor}10`,
                 color: config.primaryColor || '#00B7FF' 
               }}
             >
               <span 
                 className="w-1.5 h-1.5 rounded-full animate-pulse" 
                 style={{ backgroundColor: config.primaryColor || '#00B7FF' }}
               />
               Systems Nominal
             </div>
             {config.supportEmail && (
               <a href={`mailto:${config.supportEmail}`} className="text-xs text-neutral-500 hover:text-white transition-colors">Support</a>
             )}
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Live Campaign Intelligence</h1>
          <p className="text-sm text-neutral-500">Node Authentication: <span className="font-mono text-white/50">{config.tenantId}</span></p>
        </div>

        {/* Client Side Components for Real-time metrics */}
        <Suspense fallback={<div className="h-64 animate-pulse bg-white/5 rounded-xl border border-white/10" />}>
           <WhiteLabelKPIGrid clientId={config.tenantId} primaryColor={config.primaryColor || '#00B7FF'} />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Autonomous Action Log Feed */}
          <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden h-[600px] flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between shrink-0">
               <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                 <Activity className="w-4 h-4" /> Live Execution Stream
               </h2>
               <span 
                 className="text-[10px] px-2 py-1 rounded uppercase tracking-wider font-bold"
                 style={{ backgroundColor: `${config.primaryColor}15`, color: config.primaryColor || '#00B7FF' }}
               >
                 A.I. Pipeline
               </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar relative">
               <div className="absolute left-9 top-8 bottom-8 w-px bg-white/10" />
               <Suspense fallback={<div className="text-sm text-neutral-500 animate-pulse">Syncing Telemetry...</div>}>
                 <WhiteLabelLogFeed clientId={config.tenantId} primaryColor={config.primaryColor || '#00B7FF'} />
               </Suspense>
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
               <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Deployed Engines</h3>
               <div className="space-y-3">
                 {[
                   { name: "Local SEO Network", status: "Active" },
                   { name: "Omnichannel Closer", status: "Listening" },
                   { name: "Competitor Intel", status: "Scraping" },
                   { name: "Media Synthesis", status: "Generating" }
                 ].map((sys, i) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                     <span className="text-sm text-neutral-300 font-medium">{sys.name}</span>
                     <span 
                       className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5"
                       style={{ color: config.primaryColor || '#00B7FF' }}
                     >
                       <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: config.primaryColor || '#00B7FF' }} /> 
                       {sys.status}
                     </span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <div 
                  className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                  style={{ backgroundColor: config.primaryColor || '#00B7FF' }}
                />
                <h3 className="text-lg font-bold text-white mb-2 relative z-10">Expand Your Monopoly</h3>
                <p className="text-xs text-neutral-400 mb-6 leading-relaxed relative z-10">
                  Your AI engines are currently localized. Request an infrastructure upgrade to dominate state-wide territories before your competitors do.
                </p>
                <button 
                  className="w-full py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] relative z-10 text-white"
                  style={{ backgroundColor: config.primaryColor || '#00B7FF' }}
                >
                  Request Market Expansion
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// Client Components for Real-Time Fetching
// (These would ideally be in a separate file, but kept here for phase velocity)
// ==========================================

import WhiteLabelKPIGrid from "./WhiteLabelKPIGrid";
import WhiteLabelLogFeed from "./WhiteLabelLogFeed";
