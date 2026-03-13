"use client";

import { useState } from "react";
import { Copy, RefreshCw, Zap, Network, BrainCircuit, Activity, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

export default function GhostModeIdeation() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<any>(null);

  const generateBlueprint = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await fetch("/api/swarm/ghost-mode/ideation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (data.success) {
        setBlueprint(data.blueprint);
      } else {
        alert("Ideation swarm failed: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("System error connecting to Ideation Swarm.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen pb-32">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-electric" />
          The X Viral Architect
        </h1>
        <p className="text-text-secondary mt-2 max-w-2xl">
          Ghost Mode Swarm: Input a seed topic. UMBRA will scrape live market sentiment from social algorithms and construct a mathematically optimized 30-day viral content blueprint.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INPUT COLUMN */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border border-glass-border relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-electric/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <label className="block text-sm font-bold tracking-widest text-text-secondary uppercase mb-3">Seed Topic</label>
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Biohacking for Founders"
              className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-3 text-white placeholder-text-secondary/50 focus:outline-none focus:border-electric transition-colors mb-6"
            />
            
            <button 
              onClick={generateBlueprint}
              disabled={loading || !topic}
              className="w-full relative group overflow-hidden rounded-xl bg-white text-midnight font-bold py-4 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Architecting Blueprint...</>
                ) : (
                  <><Network className="w-4 h-4" /> Synthesize 30-Day Plan</>
                )}
              </span>
            </button>
            {loading && <p className="text-xs text-electric text-center mt-3 animate-pulse">Scraping social algorithms...</p>}
          </div>

          <div className="glass-card p-6 border border-glass-border">
             <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> Swarm Logic</h3>
             <ul className="space-y-3 text-sm text-text-secondary text-xs">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Tavily Intelligence Sweep</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Sentiment Resonance Analysis</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Gemini Copywriting Injection</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Hook / Conversion Calculation</li>
             </ul>
          </div>
        </div>

        {/* OUTPUT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {!blueprint && !loading && (
            <div className="h-full min-h-[400px] border border-dashed border-glass-border rounded-xl flex flex-col items-center justify-center text-text-secondary p-8 text-center bg-onyx/10">
              <Zap className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm max-w-sm">
                Enter a core thesis or niche on the left. UMBRA will map out exactly what to post to dominate your industry's thought leadership.
              </p>
            </div>
          )}

          {blueprint && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Thesis */}
              <div className="glass-card p-6 border-l-4 border-l-electric border-y-glass-border border-r-glass-border bg-gradient-to-r from-electric/10 to-transparent">
                <h3 className="text-xs font-bold uppercase tracking-widest text-electric mb-2">Market Hijack Thesis</h3>
                <p className="text-white leading-relaxed">{blueprint.market_thesis}</p>
              </div>

              {/* Weeks */}
              {blueprint.weekly_blueprints?.map((week: any, idx: number) => (
                <div key={idx} className="glass-card p-px bg-gradient-to-br from-glass-border to-transparent rounded-xl">
                  <div className="bg-onyx rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-electric/10 border border-electric/30 flex items-center justify-center">
                        <CalendarDays className="w-5 h-5 text-electric" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Week {week.week_number}: {week.theme}</h4>
                        <p className="text-xs text-text-secondary">Execution Volume: 1x Thread, 2x LinkedIn</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* X Thread */}
                      <div className="group relative bg-[#0f0f0f] border border-glass-border rounded-lg p-4 transition-colors hover:border-electric/50">
                        <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-[#1DA1F2] uppercase">X Thread Hook</span>
                        <p className="text-sm text-gray-200 mt-2 pr-24">{week.x_thread_hook}</p>
                        <button onClick={() => copyToClipboard(week.x_thread_hook)} className="mt-3 text-xs text-text-secondary hover:text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy className="w-3 h-3" /> Copy Hook
                        </button>
                      </div>

                      {/* LI Post 1 */}
                      <div className="group relative bg-[#0f0f0f] border border-glass-border rounded-lg p-4 transition-colors hover:border-electric/50">
                        <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-[#0a66c2] uppercase">LinkedIn: B2B Hook</span>
                        <p className="text-sm text-gray-200 mt-2 pr-24">{week.linkedin_post_1}</p>
                        <button onClick={() => copyToClipboard(week.linkedin_post_1)} className="mt-3 text-xs text-text-secondary hover:text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy className="w-3 h-3" /> Copy Hook
                        </button>
                      </div>

                      {/* LI Post 2 */}
                      <div className="group relative bg-[#0f0f0f] border border-glass-border rounded-lg p-4 transition-colors hover:border-electric/50">
                        <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-[#0a66c2] uppercase">LinkedIn: Contrarian</span>
                        <p className="text-sm text-gray-200 mt-2 pr-24">{week.linkedin_post_2}</p>
                        <button onClick={() => copyToClipboard(week.linkedin_post_2)} className="mt-3 text-xs text-text-secondary hover:text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy className="w-3 h-3" /> Copy Hook
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}

            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
