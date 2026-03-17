"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Search, Copy, Code, LayoutTemplate, 
  BrainCircuit, Globe2, Target, CheckCircle2, ChevronRight, Download
} from "lucide-react";

export default function FunnelHackerPage() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<null | any>(null);

  const handleScan = () => {
    if (!url) return;
    setIsScanning(true);
    
    // Simulate God-Brain Deep Scan
    setTimeout(() => {
      setIsScanning(false);
      setResult({
        score: 94,
        speed: "340ms",
        platform: "ClickFunnels 2.0",
        urgency: "High (Countdown Timers Detected)",
        offer: "$1997 High-Ticket Coaching",
        components: [
          { name: "Hero VSL", type: "Video", score: 98 },
          { name: "Trust Badges", type: "Social Proof", score: 85 },
          { name: "Stacked Offer", type: "Pricing", score: 92 },
          { name: "Exit Intent Pop-up", type: "Lead Gen", score: 70 }
        ]
      });
    }, 3500);
  };

  return (
    <div className="p-8 h-screen flex flex-col overflow-hidden max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <BrainCircuit className="w-3 h-3" /> God-Brain Cartography
        </div>
        <h1 className="text-3xl font-bold serif-text text-white">Funnel Hacker</h1>
        <p className="text-sm text-stone-400 mt-2 max-w-2xl">
          Deploy the UMBRA Swarm to rip and clone competitor architectures. The AI breaks down their VSLs, decodes their offer stacks, and generates a higher-converting framework for you in seconds.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
        {/* Input Matrix */}
        <div className="glass-card p-6 border border-white/10 relative overflow-hidden mb-8">
           <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-transparent pointer-events-none" />
           <div className="relative z-10">
             <label className="text-xs font-bold uppercase tracking-widest text-[#5C667A] mb-3 block">Target URL Payload</label>
             <div className="flex flex-col md:flex-row gap-3">
               <div className="relative flex-1">
                 <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                 <input 
                   type="text" 
                   value={url}
                   onChange={(e) => setUrl(e.target.value)}
                   placeholder="https://competitor.com/landing-page"
                   className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm font-mono text-white placeholder:text-stone-600 focus:outline-none focus:border-purple-500/40 transition-all focus:ring-1 focus:ring-purple-500/20"
                 />
               </div>
               <button 
                 onClick={handleScan}
                 disabled={!url || isScanning}
                 className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                 {isScanning ? (
                   <>
                     <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                     Bypassing Security...
                   </>
                 ) : (
                   <>
                     <Zap className="w-4 h-4" /> Initialize Hack
                   </>
                 )}
               </button>
             </div>
           </div>
        </div>

        {/* Scan Results Layout */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
               {/* Left: Summary Metrics */}
               <div className="col-span-1 space-y-4">
                 <div className="glass-card p-5 border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Threat Matrix Score</span>
                    <div className="mt-2 flex items-baseline gap-2">
                       <span className="text-4xl font-black font-mono text-white">{result.score}</span>
                       <span className="text-sm text-stone-500">/100</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-2">Competitor funnel is highly optimized. Cloning recommended.</p>
                 </div>

                 <div className="glass-card p-5 border border-white/10">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 border-b border-white/5 pb-2">Telemetry Data</h3>
                   <div className="space-y-3">
                     <div className="flex justify-between items-center">
                       <span className="text-xs text-stone-500">Architecture</span>
                       <span className="text-xs font-mono text-white">{result.platform}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-xs text-stone-500">Core Offer</span>
                       <span className="text-[10px] font-bold tracking-wider text-[#00B7FF] bg-[#00B7FF]/10 px-2 py-0.5 rounded">{result.offer}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-xs text-stone-500">Load Speed</span>
                       <span className="text-xs font-mono text-emerald-400">{result.speed}</span>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Right: Component Breakdown */}
               <div className="col-span-1 lg:col-span-2 glass-card p-6 border border-white/10">
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                     <Code className="w-4 h-4 text-purple-400" /> Extracted Elements
                   </h3>
                   <button className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                     <Download className="w-3 h-3" /> Export to Page Builder
                   </button>
                 </div>

                 <div className="space-y-3">
                   {result.components.map((comp: any, idx: number) => (
                     <div key={idx} className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between group hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${comp.score > 90 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            <LayoutTemplate className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white leading-none">{comp.name}</h4>
                            <span className="text-[10px] font-mono text-stone-500 mt-1 block">{comp.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="text-right">
                             <span className="text-xs font-bold block text-white">{comp.score}%</span>
                             <span className="text-[9px] uppercase tracking-widest text-stone-500">AI Score</span>
                           </div>
                           <button className="p-2 bg-white/5 hover:bg-purple-500/20 text-stone-400 hover:text-purple-400 rounded-lg transition-colors shadow-inner border border-white/10 group-hover:border-purple-500/30">
                             <Copy className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                   ))}
                 </div>
                 
                 <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
                    <button className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-stone-200 transition-colors flex items-center gap-2">
                       Deploy Clone to UMBRA Servers <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!result && !isScanning && (
          <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-black/20 mt-8 opacity-50">
            <Search className="w-8 h-8 text-stone-600 mb-3" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Awaiting Target Parameters</span>
          </div>
        )}
      </div>
    </div>
  );
}
