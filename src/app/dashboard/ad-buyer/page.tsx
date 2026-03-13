"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, DollarSign, Activity, Zap, ShieldAlert, ArrowUpRight, ArrowDownRight, Layers } from "lucide-react";

export default function AdBuyerTerminal() {
  const [budget, setBudget] = useState("5000");
  const [active, setActive] = useState(false);

  // Mock telemetry data
  const metrics = [
    { platform: "Meta Array", spend: "$2,105", roas: "3.4x", cpl: "$14.20", trend: "up", status: "scaling" },
    { platform: "TikTok Grid", spend: "$1,840", roas: "4.1x", cpl: "$9.80", trend: "up", status: "scaling" },
    { platform: "Google Search", spend: "$1,055", roas: "1.8x", cpl: "$45.00", trend: "down", status: "culling" }
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto flex flex-col min-h-[calc(100vh-6rem)]">
      <div className="mb-8 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Target className="w-3 h-3" /> Acquisition Swarm
          </div>
          <h1 className="text-3xl font-bold font-mono text-white tracking-tight">Autonomous Ad-Buyer</h1>
          <p className="text-sm text-[#8A95A5] mt-2 max-w-2xl font-mono uppercase tracking-widest">
            Capital Allocation Engine. Auto-scaling winners, culling losers.
          </p>
        </div>
        
        <div className="glass-card bg-[#0B0C10]/80 p-4 border border-glass-border text-right rounded-lg">
           <p className="text-[10px] text-[#5C667A] font-bold uppercase tracking-widest mb-1">Total System ROAS</p>
           <div className="text-2xl font-bold text-emerald-400 font-mono flex items-center justify-end gap-2">
              <TrendingUp className="w-5 h-5" /> 3.1x
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
         
         {/* Command Terminal */}
         <div className="lg:col-span-1 glass-card bg-[#0B0C10]/95 border border-glass-border p-6 flex flex-col">
            <h3 className="text-white font-bold mb-6 font-mono border-b border-glass-border pb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
               <DollarSign className="w-4 h-4 text-emerald-400" /> Capital Input
            </h3>

            <div className="space-y-6 flex-1">
               <div>
                 <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5C667A] mb-2">Daily Budget Allocation ($)</label>
                 <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-mono">$</span>
                   <input 
                     type="number" 
                     value={budget}
                     onChange={(e) => setBudget(e.target.value)}
                     disabled={active}
                     className="w-full bg-black/60 border border-glass-border rounded-lg pl-8 pr-4 py-4 text-xl text-white font-mono focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all shadow-inner font-bold"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5C667A] mb-2">Targeting Directive</label>
                 <select disabled={active} className="w-full bg-black/60 border border-glass-border rounded-lg px-4 py-3 text-sm text-white outline-none cursor-pointer appearance-none font-mono">
                   <option>God-Brain Lookalike (Max LTV)</option>
                   <option>Pixel Converters (High Intent)</option>
                   <option>Cold Outreach Retargeting (Omnipresence)</option>
                 </select>
               </div>

               <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                     <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                     <p className="text-[10px] text-amber-200/80 uppercase tracking-wider font-bold leading-relaxed">
                        Notice: The Ad-Buyer autonomously scales budgets by 15% every 4 hours for variants maintaining &gt; 2.5x ROAS, and kills variants dipping below 1.2x.
                     </p>
                  </div>
               </div>
            </div>

            <button 
              onClick={() => setActive(!active)}
              className={`mt-6 w-full py-4 font-bold text-xs uppercase tracking-[0.2em] rounded-lg flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]
                ${active 
                  ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'}`}
            >
              {active ? <><Activity className="w-4 h-4" /> Terminate Swarm</> : <><Zap className="w-4 h-4" /> Ignite Ad-Buyer</>}
            </button>
         </div>

         {/* Live Telemetry Matrix */}
         <div className="lg:col-span-2 flex flex-col gap-6">
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: "Active Nodes", val: "14" },
                 { label: "Avg CPL", val: "$12.40", color: "text-emerald-400" },
                 { label: "God-Brain Match", val: "94%" },
                 { label: "Next Reallocation", val: "00:45:12" }
               ].map((stat, i) => (
                 <div key={i} className="glass-card bg-[#0B0C10]/80 border border-glass-border p-4 rounded-lg flex flex-col justify-center">
                    <span className="text-[9px] text-[#5C667A] uppercase tracking-widest font-bold mb-1">{stat.label}</span>
                    <span className={`text-xl font-bold font-mono ${stat.color || 'text-white'}`}>{stat.val}</span>
                 </div>
               ))}
            </div>

            <div className="glass-card bg-[#0B0C10]/95 border border-glass-border p-6 rounded-lg flex-1 overflow-hidden flex flex-col">
               <h3 className="text-white font-bold mb-6 font-mono flex items-center gap-2 text-sm uppercase tracking-widest shrink-0">
                  <Layers className="w-4 h-4 text-[#5C667A]" /> Platform Telemetry
               </h3>

               <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar relative">
                 {!active && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0C10]/80 z-10 backdrop-blur-[1px]">
                       <Activity className="w-8 h-8 text-[#5C667A] mb-4" />
                       <span className="text-[10px] uppercase font-bold tracking-widest text-[#5C667A]">Swarm Offline: Awaiting Capital</span>
                    </div>
                 )}

                 {metrics.map((m, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="bg-black/40 border border-glass-border rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                   >
                     <div className="w-full md:w-auto">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${m.status === 'scaling' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                          <h4 className="text-sm font-bold text-white font-mono">{m.platform}</h4>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-[#5C667A] font-bold">Status: {m.status}</span>
                     </div>
                     
                     <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t border-glass-border md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                       <div className="text-right">
                         <span className="block text-[9px] text-[#5C667A] uppercase tracking-widest font-bold">Spend</span>
                         <span className="text-sm font-bold text-white font-mono">{m.spend}</span>
                       </div>
                       <div className="text-right">
                         <span className="block text-[9px] text-[#5C667A] uppercase tracking-widest font-bold">CPL</span>
                         <span className="text-sm font-bold text-white font-mono">{m.cpl}</span>
                       </div>
                       <div className="text-right">
                         <span className="block text-[9px] text-[#5C667A] uppercase tracking-widest font-bold">ROAS</span>
                         <span className={`text-sm font-bold font-mono flex items-center justify-end gap-1 ${m.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                           {m.roas}
                           {m.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                         </span>
                       </div>
                     </div>
                   </motion.div>
                 ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
