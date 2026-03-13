"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, DatabaseZap, RefreshCw, Layers, TerminalSquare, AlertTriangle, ShieldCheck, Cpu } from "lucide-react";

export default function MetaCognitionHub() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeAgent, setActiveAgent] = useState("Voice Swarm (Outbound)");
  const [evolutionLog, setEvolutionLog] = useState<any[]>([]);

  const triggerEvolutionCycle = async () => {
    setIsOptimizing(true);
    
    try {
        const res = await fetch("/api/swarm/optimizer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetAgent: activeAgent })
        });

        const data = await res.json();
        
        if (data.success) {
            setEvolutionLog(prev => [data.data, ...prev]);
        }
    } catch (e) {
        console.error("Evolution Cycle Failed", e);
    } finally {
        setIsOptimizing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-midnight text-white font-mono">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-glass-border pb-6">
            <div>
                <h1 className="text-3xl font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                    <Lightbulb className="text-electric w-8 h-8" />
                    Meta-Cognition
                </h1>
                <p className="text-text-secondary uppercase tracking-widest text-xs mt-2">RLHF Prompt Optimizer // Evolutionary Engine</p>
            </div>
            <div className="flex items-center gap-6">
                 <div className="flex flex-col items-end">
                     <span className="text-[10px] uppercase text-emerald-400 tracking-widest flex items-center gap-1">
                         <Cpu className="w-3 h-3" /> Swarm IQ
                     </span>
                     <span className="text-xl font-bold font-sans">184.2</span>
                 </div>
                 <div className="flex flex-col items-end">
                     <span className="text-[10px] uppercase text-text-secondary tracking-widest flex items-center gap-1">
                         <RefreshCw className="w-3 h-3" /> Evolution Cycles
                     </span>
                     <span className="text-xl font-bold font-sans text-electric">{evolutionLog.length + 42}</span>
                 </div>
            </div>
        </div>

        {/* Command Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Agent Selector & Trigger */}
            <div className="col-span-1 border border-glass-border bg-onyx/30 backdrop-blur-md rounded-xl p-6 h-fit">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-glass-border pb-4">
                    <DatabaseZap className="w-4 h-4 text-electric" /> Promethean Uplink
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="text-xs uppercase tracking-wider text-text-secondary block mb-3">Target Sub-Agent</label>
                        <div className="space-y-2">
                             {['Voice Swarm (Outbound)', 'Social Agent (Copywriter)', 'Meta Injector (Ads)'].map(agent => (
                                 <button 
                                     key={agent}
                                     onClick={() => setActiveAgent(agent)}
                                     className={`w-full p-3 rounded text-left text-xs uppercase tracking-wider transition-all border ${activeAgent === agent ? 'bg-electric/20 border-electric text-white glow-box' : 'bg-midnight/50 border-glass-border text-text-secondary hover:border-white/20'}`}
                                 >
                                     <Layers className="w-3 h-3 inline-block mr-2" /> {agent}
                                 </button>
                             ))}
                        </div>
                    </div>

                    <button 
                        onClick={triggerEvolutionCycle}
                        disabled={isOptimizing}
                        className="w-full py-4 mt-4 bg-gradient-to-r from-electric to-rose-glow rounded-md text-white font-bold uppercase tracking-wider text-xs hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(45,110,255,0.3)] hover:shadow-[0_0_30px_rgba(45,110,255,0.5)]"
                    >
                         {isOptimizing ? (
                             <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin text-white" /> Analyzing Telemetry...</span>
                         ) : (
                             <span className="flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4" /> Force Evolution Cycle</span>
                         )}
                    </button>
                    
                    <p className="text-[10px] text-text-secondary mt-4 text-center leading-relaxed">
                        Initializing this routine scans the God-Brain for recent failure states associated with the target agent, synthesizes the core flaw, and rewrites the internal agent system prompt dynamically.
                    </p>
                </div>
            </div>

            {/* Evolution Ledger UI */}
            <div className="col-span-1 lg:col-span-2 space-y-4 relative">
                <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                     <TerminalSquare className="w-4 h-4 text-electric" /> Evolution Ledger
                </h2>

                <AnimatePresence>
                    {evolutionLog.length === 0 && !isOptimizing && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 top-10 flex flex-col items-center justify-center border border-dashed border-glass-border rounded-xl text-text-secondary bg-midnight/30">
                              <Cpu className="w-12 h-12 mb-4 opacity-20" />
                              <p className="uppercase tracking-widest text-xs">Awaiting Execution Directive</p>
                         </motion.div>
                    )}

                    {evolutionLog.map((log: any) => (
                        <motion.div 
                            key={log.evolutionId}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-midnight/80 border border-electric/30 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(0,183,255,0.1)] relative"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-500 to-electric" />
                            
                            <div className="p-4 border-b border-glass-border flex items-center justify-between bg-white/5">
                                <span className="text-xs uppercase font-bold tracking-widest text-electric flex items-center gap-2">
                                    <Layers className="w-3 h-3" /> {log.agent}
                                </span>
                                <span className="text-[10px] text-text-secondary"># {log.evolutionId}</span>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Flaw Identification */}
                                <div>
                                    <h3 className="text-[10px] uppercase text-rose-500 tracking-widest flex items-center gap-1 font-bold mb-2">
                                        <AlertTriangle className="w-3 h-3" /> Critical Flaw Identified
                                    </h3>
                                    <p className="text-sm text-rose-300 font-sans leading-relaxed border-l-2 border-rose-500/50 pl-4">{log.criticalFlaw}</p>
                                </div>

                                {/* New Synthesized Prompt */}
                                <div>
                                    <h3 className="text-[10px] uppercase text-emerald-400 tracking-widest flex items-center gap-1 font-bold mb-2">
                                        <ShieldCheck className="w-3 h-3" /> Synthesized Prompt Matrix (Deployed)
                                    </h3>
                                    <div className="bg-black/50 border border-emerald-400/20 p-4 rounded text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed">
                                        {log.newPrompt}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isOptimizing && (
                     <div className="p-8 border border-glass-border border-dashed rounded-xl bg-midnight/30 flex items-center justify-center flex-col animate-pulse">
                         <DatabaseZap className="w-8 h-8 text-electric mb-4 animate-bounce" />
                         <p className="text-xs uppercase tracking-widest text-electric">Connecting to God-Brain Telemetry...</p>
                     </div>
                )}
            </div>
        </div>
    </div>
  );
}
