"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Activity, LineChart, Users, DollarSign, Play, Target, Wand2, TerminalSquare, AlertTriangle, ArrowRight } from "lucide-react";

export default function ApexStrategyHub() {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [apexData, setApexData] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const triggerSynthesis = async () => {
      setIsSynthesizing(true);
      setApexData(null);
      
      try {
          // Simulate deep god-brain processing latency
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          const res = await fetch("/api/swarm/apex/strategy", {
              method: "POST"
          });

          const data = await res.json();
          if (data.success) {
              setApexData(data.data);
          }
      } catch (error) {
          console.error("Apex Synthesis Failed:", error);
      } finally {
          setIsSynthesizing(false);
      }
  };

  const authorizeExecution = async () => {
      if(!apexData) return;
      setIsExecuting(true);
      // Simulate pushing the Matrix to The Nexus
      await new Promise(resolve => setTimeout(resolve, 2500));
      setIsExecuting(false);
      // Could route the user to /dashboard/nexus here or just show a success state.
      alert(`[NEXUS UPLINK] Matrix Deployment Authorized. Initiating ${apexData.workflowMatrix.length} Nodes.`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-midnight text-white font-mono">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-glass-border pb-6">
            <div>
                <h1 className="text-3xl font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                    <BrainCircuit className="text-electric w-8 h-8" />
                    The Apex Intelligence
                </h1>
                <p className="text-text-secondary uppercase tracking-widest text-xs mt-2">Strategic Command Node // AGI Directives</p>
            </div>
            
            <button 
                onClick={triggerSynthesis}
                disabled={isSynthesizing}
                 className="px-6 py-3 bg-midnight border border-electric/50 rounded-md text-electric font-bold uppercase tracking-wider text-xs hover:bg-electric/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_15px_rgba(45,110,255,0.15)]"
             >
                 {isSynthesizing ? <Activity className="w-4 h-4 animate-pulse" /> : <Wand2 className="w-4 h-4" />}
                 {isSynthesizing ? "Synthesizing Directives..." : "Force Synthesis Cycle"}
            </button>
        </div>

        {/* Global Telemetry Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-glass-border bg-onyx/30 backdrop-blur-md rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <h3 className="text-[10px] uppercase text-text-secondary tracking-widest mb-1 flex items-center gap-2"><DollarSign className="w-3 h-3 text-emerald-500" /> Treasury Signals</h3>
                <div className="flex items-baseline justify-between mt-3">
                     <span className="text-2xl font-bold font-sans tracking-tight">$124,500</span>
                     <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">MRR Active</span>
                </div>
            </div>

            <div className="border border-electric/30 bg-electric/5 backdrop-blur-md rounded-xl p-5 relative overflow-hidden shadow-[0_0_15px_rgba(45,110,255,0.05)]">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                <h3 className="text-[10px] uppercase text-text-secondary tracking-widest mb-1 flex items-center gap-2"><LineChart className="w-3 h-3 text-rose-500" /> Social Trajectory</h3>
                <div className="flex items-baseline justify-between mt-3">
                     <span className="text-2xl font-bold font-sans tracking-tight text-white">-4.5%</span>
                     <span className="text-xs text-rose-400 font-bold bg-rose-500/10 px-2 py-1 rounded">Engagement Alert</span>
                </div>
            </div>

            <div className="border border-glass-border bg-onyx/30 backdrop-blur-md rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                 <h3 className="text-[10px] uppercase text-text-secondary tracking-widest mb-1 flex items-center gap-2"><Users className="w-3 h-3 text-amber-500" /> Lead Qualification</h3>
                <div className="flex items-baseline justify-between mt-3">
                     <span className="text-2xl font-bold font-sans tracking-tight">8.5%</span>
                     <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded">SaaS Founders</span>
                </div>
            </div>
        </div>

        {/* Synthesis Status Area */}
        <div className="border border-glass-border bg-midnight/50 relative overflow-hidden rounded-xl min-h-[400px]">
            {isSynthesizing && (
                <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Activity className="w-12 h-12 text-electric animate-ping mb-6" />
                    <h2 className="text-xl font-bold tracking-[0.3em] uppercase text-electric mb-2">Apex Engine Active</h2>
                    <p className="text-xs text-text-secondary tracking-widest max-w-sm text-center leading-relaxed font-mono animate-pulse">
                        Aggregating global swarm state... Analyzing God-Brain logs... Formulating campaign directives to neutralize social engagement deficit...
                    </p>
                </div>
            )}

            {!isSynthesizing && !apexData && (
                <div className="flex flex-col items-center justify-center h-[400px] text-text-secondary opacity-50">
                    <BrainCircuit className="w-12 h-12 mb-4" />
                    <p className="uppercase tracking-widest text-xs">Waiting for Telemetry Triggers</p>
                </div>
            )}

            {/* Generated Directive Results */}
            <AnimatePresence>
                {!isSynthesizing && apexData && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 space-y-8"
                    >
                        {/* The Directive */}
                        <div>
                             <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-glass-border pb-2 text-rose-400">
                                <Target className="w-4 h-4 text-rose-400" /> Strategic Directive
                            </h3>
                            <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-lg relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-rose-400" />
                                <p className="text-sm leading-relaxed font-sans text-stone-200">
                                    "{apexData.directive}"
                                </p>
                            </div>
                        </div>

                        {/* Constructed Nexus Matrix */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-glass-border pb-2 text-electric">
                                <TerminalSquare className="w-4 h-4 text-electric" /> Constructed Nexus Matrix
                            </h3>
                            
                            <div className="flex items-center gap-3 overflow-x-auto pb-4">
                                {Array.isArray(apexData.workflowMatrix) && apexData.workflowMatrix.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center shrink-0 group">
                                         <div className="bg-onyx/80 border border-electric/30 p-4 rounded-lg w-48 shadow-[0_0_15px_rgba(45,110,255,0.05)] group-hover:border-electric transition-colors">
                                              <span className="text-[9px] uppercase tracking-widest text-electric mb-2 block">{item.type || 'Node'}</span>
                                              <span className="text-xs font-bold leading-tight block truncate">{item.label || JSON.stringify(item)}</span>
                                         </div>
                                         {i < apexData.workflowMatrix.length - 1 && (
                                             <ArrowRight className="w-4 h-4 text-text-secondary mx-3" />
                                         )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Human Authorization Override */}
                        <div className="pt-6 border-t border-glass-border flex justify-end">
                            <button 
                                onClick={authorizeExecution}
                                disabled={isExecuting}
                                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-md text-white font-bold uppercase tracking-[0.1em] text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            >
                                {isExecuting ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                                {isExecuting ? "Uplinking to Nexus..." : "Authorize Strategic Deployment"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    </div>
  );
}
