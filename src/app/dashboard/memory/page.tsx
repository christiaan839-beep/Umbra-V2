"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Search, Database, Activity, Target, Zap, Play, Workflow, Upload, FileAudio, FileVideo, FileText, CheckCircle2, BarChart2 } from "lucide-react";

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
  const [mode, setMode] = useState<"stream" | "search" | "ingest">("stream");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Real-time Feed State
  const [liveStream, setLiveStream] = useState<typeof TELEMETRY_STREAM>([]);
  const streamEndRef = useRef<HTMLDivElement>(null);

  // Ingest State
  const [ingestStatus, setIngestStatus] = useState<"idle" | "uploading" | "analyzing" | "complete">("idle");
  const [fileName, setFileName] = useState("");

  // Auto-scroll the live feed
  useEffect(() => {
     if (mode === "stream" && streamEndRef.current) {
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
              return [...prev, { ...newLog, id: Date.now() + Math.random() }].slice(-50);
          });
      }, 3000);

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

  const simulateIngest = (name: string) => {
      setFileName(name);
      setIngestStatus("uploading");
      setTimeout(() => setIngestStatus("analyzing"), 1500);
      setTimeout(() => setIngestStatus("complete"), 4500);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col max-w-6xl mx-auto space-y-6 p-6">
       
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
           <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-3">
                    <Database className="w-3 h-3" /> Core Memory
               </div>
               <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-1">God-Brain V2</h1>
               <p className="text-sm text-[#8A95A5] uppercase tracking-widest font-bold">Multimodal Vector Subsystem</p>
           </div>

           <div className="flex bg-[#0B0C10] border border-glass-border rounded-lg p-1 shrink-0 backdrop-blur-sm">
                <button 
                   onClick={() => setMode("stream")}
                   className={`px-4 py-2 rounded-md text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${mode === "stream" ? 'bg-electric/20 text-white shadow-[0_0_15px_rgba(0,183,255,0.2)] border border-electric/30' : 'text-[#8A95A5] hover:text-white border border-transparent'}`}
                >
                    <Activity className="w-4 h-4" /> Live Feed
                </button>
                <button 
                   onClick={() => setMode("search")}
                   className={`px-4 py-2 rounded-md text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${mode === "search" ? 'bg-blue-600/30 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-blue-500/40' : 'text-[#8A95A5] hover:text-white border border-transparent'}`}
                >
                    <Search className="w-4 h-4" /> Query
                </button>
                <button 
                   onClick={() => { setMode("ingest"); setIngestStatus("idle"); }}
                   className={`px-4 py-2 rounded-md text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${mode === "ingest" ? 'bg-emerald-600/30 text-white shadow-[0_0_15px_rgba(5,150,105,0.3)] border border-emerald-500/40' : 'text-[#8A95A5] hover:text-white border border-transparent'}`}
                >
                    <Upload className="w-4 h-4" /> Ingest
                </button>
           </div>
       </div>

       {/* Main Terminal View */}
       <div className="flex-1 glass-card overflow-hidden relative flex flex-col border border-glass-border bg-[#0B0C10]/80">
           {/* Scanline Overlay */}
           <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-30" />
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,183,255,0.03),transparent_70%)] pointer-events-none" />
           
           <AnimatePresence mode="wait">
               
               {/* MODE: LIVE FEED */}
               {mode === "stream" && (
                   <motion.div 
                       key="stream"
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                       className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 font-mono relative z-20 custom-scrollbar"
                   >
                       {liveStream.length === 0 && <div className="text-[#8A95A5] text-xs uppercase tracking-widest font-bold animate-pulse">Initializing neural uplink...</div>}
                       
                       {liveStream.map((log: any) => {
                           const Icon = log.icon;
                           return (
                               <motion.div 
                                   initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} 
                                   key={log.id} 
                                   className="flex gap-4 items-start group"
                               >
                                   <div className={`mt-1 p-2 rounded-lg bg-black border border-glass-border ${log.color} shadow-lg shadow-black/50`}>
                                       <Icon className="w-4 h-4" />
                                   </div>
                                   <div>
                                       <div className="flex items-center gap-3 mb-1">
                                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${log.bg} ${log.color} border border-white/5`}>
                                                {log.node}
                                            </span>
                                            <span className="text-[#5C667A] text-[10px]">{new Date(log.id).toISOString()}</span>
                                       </div>
                                       <p className="text-[#C1C8D4] text-xs leading-relaxed max-w-3xl">{log.action}</p>
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
                       className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col z-20 relative"
                   >
                       <div className="max-w-3xl mx-auto w-full space-y-8 mt-8">
                           
                           {/* Query Input */}
                           <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-blue-500 group-focus-within:text-electric transition-colors" />
                                </div>
                                <input 
                                    type="text" 
                                    className="block w-full pl-14 pr-32 py-5 border border-glass-border rounded-xl bg-black/60 text-white placeholder-text-secondary/50 focus:ring-1 focus:border-electric focus:bg-black transition-all font-mono text-sm shadow-[0_0_30px_rgba(0,183,255,0.05)]"
                                    placeholder="Query semantic memory vectors..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    autoFocus
                                />
                                <button 
                                    onClick={handleSearch}
                                    disabled={!searchQuery || isSearching}
                                    className="absolute right-3 top-3 bottom-3 bg-blue-600/80 hover:bg-blue-500 text-white px-6 rounded-lg text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 transition-colors border border-blue-400/30"
                                >
                                    {isSearching ? 'Scanning...' : 'Extract'}
                                </button>
                           </div>

                           {/* Results */}
                           <div className="space-y-4">
                                {results.length === 0 && !isSearching && searchQuery.length > 0 && (
                                    <div className="text-center text-[#5C667A] text-[10px] uppercase tracking-widest font-bold mt-12 border border-dashed border-glass-border p-8 rounded-xl bg-black/30">
                                        Awaiting extraction command.
                                    </div>
                                )}
                                {results.map((r: any, i: number) => (
                                    <motion.div 
                                        key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                        className="bg-black/40 border border-glass-border p-5 rounded-xl hover:border-blue-500/30 transition-colors group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-[#0B0C10] border border-glass-border shrink-0 group-hover:border-blue-500/50 transition-colors shadow-lg">
                                                <Database className="w-4 h-4 text-blue-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-3">
                                                     <span className="text-[9px] uppercase tracking-widest text-[#5C667A] border border-glass-border/50 px-2 py-0.5 rounded">Score: {(r.score * 100).toFixed(2)}%</span>
                                                </div>
                                                <p className="text-xs text-[#C1C8D4] leading-relaxed font-mono">
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

               {/* MODE: INGEST */}
               {mode === "ingest" && (
                   <motion.div 
                       key="ingest"
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                       className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col justify-center items-center z-20 relative custom-scrollbar"
                   >
                      <div className="max-w-2xl w-full">
                          
                          {ingestStatus === "idle" && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                              className="bg-black/40 border-[3px] border-dashed border-glass-border hover:border-emerald-500/30 transition-colors p-16 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer shadow-2xl"
                            >
                                <div className="w-20 h-20 bg-[#0B0C10] border border-glass-border rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(52,211,153,0.1)] group-hover:shadow-[0_0_40px_rgba(52,211,153,0.2)]">
                                    <Upload className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 font-mono">Multimodal Memory Ingestion</h3>
                                <p className="text-sm text-[#8A95A5] mb-8 max-w-sm">Drop .mp3 (sales calls), .mp4 (video ads), or text documents to embed into the God-Brain.</p>
                                
                                <div className="flex gap-4">
                                  <button onClick={() => simulateIngest("discovery_call_feb24.mp3")} className="px-4 py-2 bg-black border border-glass-border hover:border-emerald-500/50 rounded-lg text-xs font-bold text-[#C1C8D4] transition-colors flex items-center gap-2">
                                      <FileAudio className="w-4 h-4 text-emerald-400" /> Test Audio
                                  </button>
                                  <button onClick={() => simulateIngest("vsl_variant_c.mp4")} className="px-4 py-2 bg-black border border-glass-border hover:border-rose-500/50 rounded-lg text-xs font-bold text-[#C1C8D4] transition-colors flex items-center gap-2">
                                      <FileVideo className="w-4 h-4 text-rose-400" /> Test Video
                                  </button>
                                </div>
                            </motion.div>
                          )}

                          <AnimatePresence>
                            {ingestStatus !== "idle" && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="bg-black/60 border border-glass-border rounded-xl overflow-hidden shadow-2xl"
                                >
                                    <div className="p-6 border-b border-glass-border flex items-center justify-between bg-[#0B0C10]/80">
                                      <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg border ${fileName.endsWith('mp3') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                          {fileName.endsWith('mp3') ? <FileAudio className="w-6 h-6" /> : <FileVideo className="w-6 h-6" />}
                                        </div>
                                        <div>
                                          <p className="text-sm font-bold text-white font-mono">{fileName}</p>
                                          <p className="text-[10px] text-[#8A95A5] uppercase tracking-widest font-bold mt-1">
                                            {ingestStatus === "uploading" ? "1. Generating Embeddings..." : ingestStatus === "analyzing" ? "2. Extracting Sentiment Topology..." : "3. Ingestion Complete"}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      {ingestStatus === "complete" ? (
                                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                      ) : (
                                        <div className="w-6 h-6 border-2 border-glass-border border-t-electric rounded-full animate-spin" />
                                      )}
                                    </div>

                                    {(ingestStatus === "analyzing" || ingestStatus === "complete") && (
                                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                           <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#5C667A] flex items-center gap-2">
                                              <BarChart2 className="w-3 h-3" /> Timeline Sentiment Analysis
                                           </h4>
                                           <span className="text-[10px] text-emerald-400 font-mono">Gemini 1.5 Pro</span>
                                        </div>
                                        
                                        {/* Visualization Graph mockup */}
                                        <div className="h-32 flex items-end gap-1.5 mt-8 relative pl-8 pb-4">
                                           {/* Y Axis */}
                                           <div className="absolute left-0 inset-y-0 w-6 flex flex-col justify-between text-[8px] text-[#5C667A] font-mono pb-4">
                                             <span>+1</span>
                                             <span>0</span>
                                             <span>-1</span>
                                           </div>
                                           {/* X Axis */}
                                           <div className="absolute inset-x-8 bottom-0 flex justify-between text-[8px] text-[#5C667A] font-mono">
                                              <span>0:00</span>
                                              <span>0:30</span>
                                              <span>1:00</span>
                                              <span>1:30</span>
                                           </div>

                                           {/* Data Bars */}
                                           {[0.2, 0.4, 0.8, 0.9, 0.6, 0.1, -0.3, -0.6, -0.2, 0.3, 0.7, 0.9, 1.0, 0.8, 0.5, 0.2].map((v, i) => (
                                             <motion.div 
                                                key={i} 
                                                initial={{ height: "50%" }} 
                                                animate={{ height: `${(v + 1) * 50}%` }}
                                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                                className={`flex-1 rounded-sm w-full relative group ${v > 0 ? 'bg-emerald-500' : 'bg-rose-500'} ${ingestStatus === "analyzing" ? 'animate-pulse' : ''} ${v > 0.8 ? 'shadow-[0_0_10px_rgba(16,185,129,0.8)]' : ''}`}
                                             >
                                                {/* Tooltip mockup */}
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-glass-border px-2 py-1 rounded text-[8px] font-mono text-white opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap">
                                                  Score: {v.toFixed(2)}
                                                </div>
                                             </motion.div>
                                           ))}
                                        </div>

                                        {ingestStatus === "complete" && (
                                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 pt-4 border-t border-glass-border grid grid-cols-2 gap-4">
                                              <div>
                                                <p className="text-[9px] uppercase tracking-widest text-[#5C667A] mb-1">Key Insight</p>
                                                <p className="text-xs text-[#C1C8D4] leading-relaxed">High engagement peak at 1:15 perfectly correlates with the "Transformation Hook". Negative dip at 0:45 matches price introduction.</p>
                                              </div>
                                              <div className="text-right">
                                                <button onClick={() => setIngestStatus("idle")} className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded text-[10px] uppercase tracking-widest font-bold transition-colors">
                                                  Ingest Next File
                                                </button>
                                              </div>
                                           </motion.div>
                                        )}
                                      </motion.div>
                                    )}
                                </motion.div>
                            )}
                          </AnimatePresence>
                      </div>
                   </motion.div>
               )}

           </AnimatePresence>
       </div>
    </div>
  );
}
