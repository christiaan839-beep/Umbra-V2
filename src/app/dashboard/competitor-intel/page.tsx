"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, Target, Skull, BrainCircuit, ShieldAlert, Cpu, Activity, Play } from "lucide-react";

export default function CompetitorIntelPage() {
  const [targetUrl, setTargetUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "scraping" | "analyzing" | "complete">("idle");

  const executeIntelSweep = () => {
    if (!targetUrl) return;
    setStatus("scraping");
    setTimeout(() => setStatus("analyzing"), 3000);
    setTimeout(() => setStatus("complete"), 7500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#050505] text-white">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Skull className="w-3 h-3" /> NemoClaw Competitor Annihilation
        </div>
        <h1 className="text-3xl font-bold font-sans tracking-tight mb-2 flex items-center gap-3">
          Competitor Intel Engine
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl">
          Powered by Nemotron and NemoClaw. Input a competitor's domain. The swarm will scrape their entire funnel, identify their core pricing model, extract their weaknesses, and generate a superior "God-Offer" to steal their market share.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Setup */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-white/10 p-6 bg-white/[0.02]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-300 mb-6 flex items-center gap-2">
              <Target className="w-4 h-4 text-red-400" /> Target Lock
            </h3>
            
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2 block">Competitor Domain URL</label>
                  <input 
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-red-500/50 outline-none font-mono"
                    placeholder="https://rival-agency.com"
                  />
               </div>
            </div>

            <button 
              onClick={executeIntelSweep}
              disabled={status !== "idle" || !targetUrl}
              className="w-full mt-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)] flex justify-center items-center gap-2"
            >
              <Radar className="w-4 h-4" /> Commence Infiltration
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <BrainCircuit className="w-6 h-6 mx-auto mb-2 text-neutral-500" />
                <h4 className="text-xl font-bold text-white mb-1">NeMo</h4>
                <p className="text-[9px] text-neutral-500 font-mono uppercase">Guardrails Off</p>
             </div>
             <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <Cpu className="w-6 h-6 mx-auto mb-2 text-neutral-500" />
                <h4 className="text-xl font-bold text-white mb-1">Crawl</h4>
                <p className="text-[9px] text-neutral-500 font-mono uppercase">Deep Scraping</p>
             </div>
          </div>
        </div>

        {/* Right Col: Console */}
        <div className="lg:col-span-8">
           <div className="h-full min-h-[550px] flex flex-col rounded-2xl bg-black border border-red-500/20 overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.05)]">
               <div className="h-12 border-b border-red-500/20 bg-red-500/5 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-500" />
                    <span className="text-[10px] font-mono text-red-400 tracking-widest uppercase">Live Reconnaissance Telemetry</span>
                  </div>
                  {status === "scraping" || status === "analyzing" ? (
                     <div className="flex items-center gap-2 text-[9px] text-red-500 font-mono uppercase tracking-widest font-bold animate-pulse">
                         Extracting DOM...
                     </div>
                  ) : status === "complete" ? (
                    <div className="flex items-center gap-2 text-[9px] text-red-500 font-mono uppercase tracking-widest font-bold">
                       <ShieldAlert className="w-3 h-3" /> Target Compromised
                    </div>
                  ) : null}
               </div>

               <div className="p-6 flex-1 bg-[url('/noise.png')] bg-repeat opacity-95 overflow-y-auto custom-scrollbar">
                  {status === "idle" && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                       <Radar className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                       <p className="text-neutral-600 font-mono text-xs uppercase tracking-widest max-w-sm">
                         Awaiting Target URL...<br/><br/>
                         The swarm will index their sitemap, extract pricing tables, analyze their VSL transcripts, and expose their market positioning flaws.
                       </p>
                    </div>
                  )}

                  <AnimatePresence>
                     {status === "scraping" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-xl mx-auto space-y-4 font-mono text-xs text-red-400/80 mt-10">
                           <p className="animate-pulse">&gt; Initiating headless browser swarm...</p>
                           <p className="animate-pulse delay-75">&gt; Bypassing Cloudflare bot protection...</p>
                           <p className="animate-pulse delay-150">&gt; Dumping full DOM structure and tracking pixels...</p>
                           <p className="animate-pulse delay-200">&gt; Ripping CSS stylesheets to identify high-converting elements...</p>
                        </motion.div>
                     )}

                     {status === "analyzing" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-xl mx-auto space-y-4 font-mono text-xs text-amber-400/80 mt-10">
                           <p className="text-red-500">&gt; Target acquired: 142 DOM nodes extracted.</p>
                           <p className="animate-pulse">&gt; Routing text corpus to Llama-3.3-70B via NemoClaw...</p>
                           <p className="animate-pulse delay-75">&gt; Extracting "Core Offer" semantics...</p>
                           <p className="animate-pulse delay-150">&gt; Identifying logic gaps and unfulfilled promises...</p>
                        </motion.div>
                     )}

                     {status === "complete" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                 <span className="text-[9px] text-neutral-500 font-bold tracking-widest uppercase mb-1 block">Their Pricing</span>
                                 <span className="text-lg font-mono text-rose-400">$3,500/mo Retainer</span>
                              </div>
                              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                 <span className="text-[9px] text-neutral-500 font-bold tracking-widest uppercase mb-1 block">Traffic Source</span>
                                 <span className="text-lg font-mono text-white">Cold Email + Meta Ads</span>
                              </div>
                           </div>

                           <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-5">
                              <div className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-rose-500/10 pb-2">
                                 <ShieldAlert className="w-3 h-3" /> Critical Weaknesses Identified
                              </div>
                              <ul className="space-y-3 font-mono text-xs text-rose-200">
                                 <li className="flex gap-2"><span>1.</span> They promise "Leads" but do not offer AI appointment setting. Their clients still have to manually call the leads. High churn risk.</li>
                                 <li className="flex gap-2"><span>2.</span> They use basic stock imagery. They have zero video case studies. Low trust metrics.</li>
                                 <li className="flex gap-2"><span>3.</span> They cap their ad spend management at $10k/mo, indicating they lack enterprise capacity.</li>
                              </ul>
                           </div>

                           <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                              <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-emerald-500/20 pb-2">
                                 <Target className="w-3 h-3" /> Auto-Generated "God Offer" (To Destroy Them)
                              </div>
                              <p className="text-sm font-sans leading-relaxed text-emerald-50 italic">
                                 "While they charge you $3,500 a month just to run basic Facebook ads and hand you a spreadsheet of cold numbers—we deploy a localized Sovereign AI Supercomputer into your business. For a flat licensing fee, our system runs the ads, instantly calls every lead within 4 seconds using an Audio2Face deepfake clone, and books the appointment directly onto your calendar while you sleep. We don't sell 'leads'. We install autonomous revenue infrastructure."
                              </p>
                           </div>

                           <button className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                             <Play className="w-4 h-4" /> Pipe God-Offer to Landing Page Generator
                           </button>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}
