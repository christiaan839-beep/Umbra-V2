"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Search, Database, Activity, GitCommit, Target, Zap, Play, Workflow } from "lucide-react";

// Simulated Real-Time System Telemetry
const TELEMETRY_STREAM = [
    { node: "Ghost Mode", action: "Drafting SEO cluster for short-form AI video generation.", color: "text-purple-400", bg: "bg-purple-500/10", icon: Workflow },
    { node: "Ad-Buyer", action: "Allocating $250 to Meta learning phase. CPL projected at $22.40.", color: "text-blue-400", bg: "bg-blue-500/10", icon: Target },
    { node: "Cinematic Swarm", action: "Rendering final frame composite for VSL variant B. God-Brain logged.", color: "text-amber-400", bg: "bg-amber-500/10", icon: Play },
    { node: "Apex Engine", action: "Synthesized cross-swarm matrix. Injecting scaling weight to TikTok.", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: BrainCircuit },
    { node: "The Nexus", action: "Routing webhook trigger from Stripe to Onboarding sequence.", color: "text-electric", bg: "bg-electric/10", icon: Activity },
    { node: "Genesis Node", action: "Deep crawl completed for client domain. Sub-swarm provisioned.", color: "text-rose-glow", bg: "bg-rose-glow/10", icon: Zap }
];

export default function NeuralVisualizer() {
  const [mode, setMode] = useState<"stream" | "search">("stream");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Real-time Feed State
  const [liveStream, setLiveStream] = useState<typeof TELEMETRY_STREAM>([]);
  const streamEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the live feed
  useEffect(() => {
     if(mode === "stream" && streamEndRef.current) {
         streamEndRef.current.scrollIntoView({ behavior: "smooth" });
     }
  }, [liveStream, mode]);

  // Simulate incoming nodes appending logs
  useEffect(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
          setLiveStream(prev => {
              const newLog = TELEMETRY_STREAM[currentIndex % TELEMETRY_STREAM.length];
              currentIndex++;
              // Keep only the last 50 logs in memory
              return [...prev, { ...newLog, id: Date.now() + Math.random() }].slice(-50);
          });
      }, 3000); // New log every 3 seconds

      return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
      if(!searchQuery.trim() || isSearching) return;
      setIsSearching(true);
      setResults([]);

      try {
          const res = await fetch("/api/memory", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "recall", query: searchQuery })
          });
          const data = await res.json();
          if(data.results) setResults(data.results);
      } catch (e) {
          console.error("Semantic search failed.", e);
      } finally {
          setIsSearching(false);
      }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col max-w-6xl mx-auto space-y-6">
       
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
           <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-3">
                    <Activity className="w-3 h-3 animate-pulse" /> Live Telemetry
               </div>
               <h1 className="text-3xl font-bold font-serif text-white tracking-wide">The God-Brain</h1>
               <p className="text-sm text-text-secondary mt-1">Real-time visualization of the Sovereign AI System's core memory matrix.</p>
           </div>

           <div className="flex bg-onyx border border-glass-border rounded-lg p-1 shrink-0">
                <button 
                   onClick={() => setMode("stream")}
                   className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${mode === "stream" ? 'bg-electric text-white shadow-lg shadow-electric/20' : 'text-stone-400 hover:text-white'}`}
                >
                    <Activity className="w-4 h-4" /> Live Feed
                </button>
                <button 
                   onClick={() => setMode("search")}
                   className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${mode === "search" ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-stone-400 hover:text-white'}`}
                >
                    <Search className="w-4 h-4" /> Neural Query
                </button>
           </div>
       </div>

       {/* Main Terminal View */}
       <div className="flex-1 glass-card border border-glass-border overflow-hidden relative flex flex-col">
           {/* Scanline Overlay */}
           <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-20" />
           
           <AnimatePresence mode="wait">
               
               {/* MODE: LIVE FEED */}
               {mode === "stream" && (
                   <motion.div 
                       key="stream"
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                       className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 font-mono bg-black/40 relative"
                   >
                       {liveStream.length === 0 && <div className="text-stone-500 text-sm animate-pulse">Initializing neural uplink to God-Brain...</div>}
                       
                       {liveStream.map((log: any) => {
                           const Icon = log.icon;
                           return (
                               <motion.div 
                                   initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} 
                                   key={log.id} 
                                   className="flex gap-4 items-start group"
                               >
                                   <div className={`mt-1 p-1.5 rounded-sm bg-black/50 border border-glass-border ${log.color}`}>
                                       <Icon className="w-4 h-4" />
                                   </div>
                                   <div>
                                       <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${log.bg} ${log.color} border border-white/5`}>
                                                {log.node}
                                            </span>
                                            <span className="text-stone-600 text-xs">{new Date(log.id).toISOString()}</span>
                                       </div>
                                       <p className="text-stone-300 text-sm leading-relaxed">{log.action}</p>
                                   </div>
                               </motion.div>
                           )
                       })}
                       <div ref={streamEndRef} className="h-4" />
                   </motion.div>
               )}

               {/* MODE: SEARCH / RAG */}
               {mode === "search" && (
                   <motion.div 
                       key="search"
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                       className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col"
                   >
                       <div className="max-w-3xl mx-auto w-full space-y-8">
                           
                           {/* Query Input */}
                           <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <BrainCircuit className="h-5 w-5 text-blue-500 group-focus-within:text-electric transition-colors" />
                                </div>
                                <input 
                                    type="text" 
                                    className="block w-full pl-12 pr-24 py-4 border border-glass-border rounded-xl bg-onyx/50 text-white placeholder-text-secondary/50 focus:ring-1 focus:border-electric focus:bg-onyx transition-all font-mono text-sm"
                                    placeholder="Query semantic memory vectors... (e.g. 'high performing ad scripts')"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    autoFocus
                                />
                                <button 
                                    onClick={handleSearch}
                                    disabled={!searchQuery || isSearching}
                                    className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-colors"
                                >
                                    {isSearching ? 'Scanning...' : 'Extract'}
                                </button>
                           </div>

                           {/* Results */}
                           <div className="space-y-4">
                                {results.length === 0 && !isSearching && searchQuery.length > 0 && (
                                    <div className="text-center text-stone-500 text-sm font-mono mt-12 border border-dashed border-stone-800 p-8 rounded-xl">
                                        Awaiting extraction command.
                                    </div>
                                )}
                                {results.map((r: any, i: number) => (
                                    <motion.div 
                                        key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                        className="bg-onyx/40 border border-glass-border p-5 rounded-xl hover:border-blue-500/30 transition-colors group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-black border border-glass-border shrink-0 group-hover:border-blue-500/50 transition-colors">
                                                <Database className="w-4 h-4 text-blue-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                     <span className="text-[10px] uppercase tracking-widest text-stone-500 border border-stone-800 px-2 py-0.5 rounded-full">Score: {(r.score * 100).toFixed(2)}%</span>
                                                </div>
                                                <p className="text-sm text-stone-200 leading-relaxed font-mono">
                                                    {r.entry?.text || r.text || JSON.stringify(r)}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                           </div>

                       </div>
                   </motion.div>
               )}

           </AnimatePresence>
       </div>
    </div>
  );
}
