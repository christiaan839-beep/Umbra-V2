"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CopySlash, MapPin, Code2, ArrowRight, Swords, Sparkles, BrainCircuit, Play, Lock, CheckCircle2, FlaskConical } from "lucide-react";

export default function SkillForgePage() {
  const [activeTab, setActiveTab] = useState<"arena" | "library">("arena");
  const [testInput, setTestInput] = useState("Analyze this sales call transcript and extract the primary objection.");
  const [isTesting, setIsTesting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [lockedVariant, setLockedVariant] = useState<"A" | "B" | null>(null);

  const runTest = () => {
    if (!testInput || isTesting) return;
    setIsTesting(true);
    setTestComplete(false);
    setLockedVariant(null);
    
    // Simulate backend A/B evaluation
    setTimeout(() => {
      setIsTesting(false);
      setTestComplete(true);
    }, 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <FlaskConical className="w-3 h-3" /> Experimental
          </div>
          <h1 className="text-3xl font-bold font-mono text-white tracking-tight">The Skill Forge</h1>
          <p className="text-sm text-[#8A95A5] mt-2 max-w-2xl font-mono uppercase tracking-widest">
            A/B Test System Prompts & Lock Winning Variants
          </p>
        </div>

        <div className="flex bg-[#0B0C10]/80 border border-glass-border rounded-lg p-1 backdrop-blur-sm">
          <button 
            onClick={() => setActiveTab("arena")}
            className={`px-4 py-2 rounded-md text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === "arena" ? 'bg-rose-600/30 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)] border border-rose-500/40' : 'text-[#8A95A5] hover:text-white border border-transparent'}`}
          >
            <Swords className="w-4 h-4" /> The Arena
          </button>
          <button 
            onClick={() => setActiveTab("library")}
            className={`px-4 py-2 rounded-md text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === "library" ? 'bg-blue-600/30 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-blue-500/40' : 'text-[#8A95A5] hover:text-white border border-transparent'}`}
          >
            <Database className="w-4 h-4" /> Locked Skills
          </button>
        </div>
      </div>

      {activeTab === "arena" && (
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Input Panel */}
          <div className="glass-card border border-glass-border p-6 bg-[#0B0C10]/80 relative shrink-0">
             <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20 rounded-xl" />
             <div className="relative z-10">
               <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5C667A] mb-2">Test Data Payload</label>
               <div className="flex gap-4">
                 <input 
                   type="text" 
                   value={testInput}
                   onChange={e => setTestInput(e.target.value)}
                   className="flex-1 bg-black/60 border border-glass-border rounded-lg px-4 py-3 text-sm text-white font-mono focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 outline-none transition-all shadow-inner"
                 />
                 <button 
                   onClick={runTest}
                   disabled={isTesting || !testInput}
                   className="px-6 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:hover:bg-rose-600 text-white font-bold text-[10px] uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)]"
                 >
                   {isTesting ? (
                     <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Evaluating</>
                   ) : (
                     <><Play className="w-4 h-4" /> Fire Variants</>
                   )}
                 </button>
               </div>
             </div>
          </div>

          {/* Dual Arena View */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
            
            {/* Variant A */}
            <div className={`glass-card border-2 flex flex-col overflow-hidden transition-all duration-500 bg-[#0B0C10]/95 ${lockedVariant === "A" ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : lockedVariant === "B" ? 'border-glass-border/30 opacity-50' : 'border-glass-border hover:border-glass-border/80'}`}>
               <div className="p-4 border-b border-glass-border bg-black/40 flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                     <BrainCircuit className="w-4 h-4 text-blue-400" />
                   </div>
                   <div>
                     <h3 className="text-sm font-bold text-white font-mono">Variant A (Baseline)</h3>
                     <p className="text-[9px] text-[#5C667A] uppercase tracking-widest font-bold">Standard Prompting</p>
                   </div>
                 </div>
                 {testComplete && !lockedVariant && (
                   <button onClick={() => setLockedVariant("A")} className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors">
                     <Lock className="w-3 h-3" /> Lock A
                   </button>
                 )}
                 {lockedVariant === "A" && <div className="text-emerald-400 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest"><CheckCircle2 className="w-4 h-4" /> Winner</div>}
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 font-mono text-sm custom-scrollbar relative">
                  {!isTesting && !testComplete && (
                     <div className="absolute inset-0 flex items-center justify-center text-[#5C667A] text-[10px] uppercase tracking-widest font-bold">Awaiting Execution</div>
                  )}
                  {isTesting && (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-white/5 rounded w-3/4" />
                      <div className="h-4 bg-white/5 rounded w-full" />
                      <div className="h-4 bg-white/5 rounded w-5/6" />
                    </div>
                  )}
                  {testComplete && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#C1C8D4] space-y-4 leading-relaxed">
                      <p>The primary objection identified in the transcript relates to implementation timelines.</p>
                      <ul className="list-disc pl-5 space-y-2 text-stone-400 text-xs">
                        <li>Mentioned "we don't have engineering bandwidth" (03:14)</li>
                        <li>Expressed concern over "integration complexity" (05:22)</li>
                      </ul>
                      <div className="mt-8 pt-4 border-t border-glass-border border-dashed">
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-[#5C667A]">
                          <span>Latency: 1.2s</span>
                          <span>Tokens: 142</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
               </div>
            </div>

            {/* Variant B */}
            <div className={`glass-card border-2 flex flex-col overflow-hidden transition-all duration-500 bg-[#0B0C10]/95 ${lockedVariant === "B" ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : lockedVariant === "A" ? 'border-glass-border/30 opacity-50' : 'border-glass-border hover:border-glass-border/80'}`}>
               <div className="p-4 border-b border-glass-border bg-black/40 flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                     <Sparkles className="w-4 h-4 text-rose-400" />
                   </div>
                   <div>
                     <h3 className="text-sm font-bold text-white font-mono">Variant B (Challenger)</h3>
                     <p className="text-[9px] text-[#5C667A] uppercase tracking-widest font-bold">Chain-of-Thought + Persona</p>
                   </div>
                 </div>
                 {testComplete && !lockedVariant && (
                   <button onClick={() => setLockedVariant("B")} className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors">
                     <Lock className="w-3 h-3" /> Lock B
                   </button>
                 )}
                 {lockedVariant === "B" && <div className="text-emerald-400 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest"><CheckCircle2 className="w-4 h-4" /> Winner</div>}
               </div>

               <div className="flex-1 overflow-y-auto p-6 font-mono text-sm custom-scrollbar relative">
                  {!isTesting && !testComplete && (
                     <div className="absolute inset-0 flex items-center justify-center text-[#5C667A] text-[10px] uppercase tracking-widest font-bold">Awaiting Execution</div>
                  )}
                  {isTesting && (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-white/5 rounded w-full" />
                      <div className="h-4 bg-white/5 rounded w-5/6" />
                      <div className="h-4 bg-white/5 rounded w-4/6" />
                      <div className="h-4 bg-white/5 rounded w-full" />
                    </div>
                  )}
                  {testComplete && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#C1C8D4] space-y-4 leading-relaxed">
                      <div className="p-3 bg-black border border-glass-border rounded-lg mb-4 text-[#8A95A5] text-xs">
                        &gt; System: Analyzing psychological drivers behind objections...
                      </div>
                      <p className="font-bold text-white">Core Objection: Resource Paralysis (not budget).</p>
                      <p className="text-xs text-stone-300">The prospect isn't objecting to the price, but rather the internal political cost of allocating engineering resources. They fear the integration effort will stall other KPIs.</p>
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <p className="text-[10px] uppercase text-emerald-400 font-bold tracking-widest mb-1">Recommended Rebuttal</p>
                        <p className="text-xs text-emerald-100">"I completely understand the engineering bottleneck. That's why our protocol requires ZERO integration on your end. We operate fully autonomously outside your stack."</p>
                      </div>
                      <div className="mt-8 pt-4 border-t border-glass-border border-dashed">
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-[#5C667A]">
                          <span>Latency: 2.1s</span>
                          <span>Tokens: 384</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
               </div>
            </div>

          </div>
        </div>
      )}

      {/* Database icon proxy for compilation sake */}
      <div className="hidden"><Database /></div>

    </div>
  );
}

// Ensure Database icon exists in scope (added via direct import block above)
import { Database } from "lucide-react";
