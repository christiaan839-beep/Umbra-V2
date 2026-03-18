"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe2, Rss, Megaphone, Search, Zap, Activity, CheckCircle2 } from "lucide-react";

// ⚡ SOVEREIGN MATRIX // OMNIPRESENCE COMMAND NODE ⚡
// This physically replaces an entire multi-disciplinary marketing firm
// (SEO Agency + Ad Agency + Social Media Agency) into a single Swarm interface.

export default function OmnipresenceNode() {
  const [activeTab, setActiveTab] = useState("ALL");

  const metrics = [
    { label: "Global Ad Bidding Nodes", val: "14 Active", icon: Zap, color: "text-emerald-500" },
    { label: "RAG Content Syndication", val: "482 Posts/mo", icon: Rss, color: "text-violet-500" },
    { label: "Keyword Domination Index", val: "99.4%", icon: Search, color: "text-cyan-500" },
  ];

  const streams = [
    { platform: "Google Performance Max", status: "Optimizing Bids", rsi: "+4.2%", icon: Globe2 },
    { platform: "LinkedIn B2B Ghost Fleet", status: "Executing Outreach", rsi: "+18.1%", icon: Megaphone },
    { platform: "X (Auto-Thread Matrix)", status: "Syndicating Content", rsi: "+8.4%", icon: Rss },
    { platform: "Programmatic SEO Crawler", status: "Indexing Target Blogs", rsi: "+12.9%", icon: Search },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 lg:p-8">
      {/* Elite Palantir Header */}
      <header className="border-b border-emerald-500/20 pb-8 flex items-end justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Globe2 className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
             <h1 className="text-3xl font-serif font-bold text-white">Omnipresence Matrix</h1>
             <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest mt-1">Multi-Vector Ad & Media Domination</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-500 font-mono text-[10px] uppercase font-bold tracking-widest">All Vectors Synchronized</span>
        </div>
      </header>

      {/* Mathematical Superiority Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {metrics.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
               className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10">
               <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                  <m.icon className="w-24 h-24 text-white" />
               </div>
               <m.icon className={`w-5 h-5 mb-4 ${m.color}`} />
               <div className="text-3xl font-mono tracking-tight font-bold text-white mb-1">{m.val}</div>
               <div className="text-xs uppercase tracking-widest text-neutral-500 font-bold">{m.label}</div>
            </motion.div>
         ))}
      </div>

      {/* Live Tactical Stream Dashboard */}
      <div className="bg-black/60 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 lg:p-8">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold font-serif text-white flex items-center gap-3">
               <Activity className="w-5 h-5 text-emerald-500" /> Live Swarm Deployments
            </h2>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] uppercase tracking-widest text-white font-bold transition-all">
               Override Master Budget
            </button>
         </div>

         <div className="space-y-4">
            {streams.map((s, i) => (
               <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + (i * 0.05) }}
                  className="flex items-center justify-between p-5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
                        <s.icon className="w-4 h-4 text-emerald-500" />
                     </div>
                     <div>
                        <div className="text-sm font-bold text-white mb-1">{s.platform}</div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {s.status}
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="text-emerald-500 font-mono font-bold text-sm">{s.rsi} ROI</div>
                     <div className="text-[9px] uppercase tracking-widest text-neutral-600 mt-1">Last 24h Yield</div>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
}
