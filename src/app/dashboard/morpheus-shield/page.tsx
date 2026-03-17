"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, AlertTriangle, Fingerprint, Activity, Network, Database, Hexagon, Lock } from "lucide-react";

export default function MorpheusShieldPage() {
  const [pipelineState, setPipelineState] = useState<"idle" | "scanning" | "detected" | "blocked">("idle");

  const triggerScan = () => {
    setPipelineState("scanning");
    setTimeout(() => {
      setPipelineState("detected");
    }, 4500);

    setTimeout(() => {
      setPipelineState("blocked");
    }, 8000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#050505] text-white">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Hexagon className="w-3 h-3" /> Morpheus Cybersecurity
        </div>
        <h1 className="text-3xl font-bold font-sans tracking-tight mb-2 flex items-center gap-3">
          Morpheus Fraud Sentinel
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl">
          Powered by the NVIDIA Morpheus AI framework. Ingests millions of live network packets and API telemetry streams to detect anomalous behavior, financial fraud payloads, and unauthorized Zero-Day exfiltration attempts in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Setup */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-white/10 p-6 bg-white/[0.02]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-300 mb-6 flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" /> Sensor Intake
            </h3>
            
            <div className="border border-dashed border-white/20 rounded-xl p-8 text-center bg-black/40 mb-6 group">
               <Database className="w-8 h-8 text-neutral-600 mx-auto mb-3 group-hover:text-cyan-400 transition-colors" />
               <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Stripe API Webhooks</p>
               <p className="text-[10px] text-cyan-500 font-mono mt-2 animate-pulse">420 mb/s Flow Rate</p>
            </div>

            <button 
              onClick={triggerScan}
              disabled={pipelineState !== "idle"}
              className="w-full mt-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] flex justify-center items-center gap-2"
            >
              <Activity className="w-4 h-4" /> Initialize Packet Swarm
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <Fingerprint className="w-6 h-6 mx-auto mb-2 text-neutral-500" />
                <h4 className="text-xl font-bold text-white mb-1">0ms</h4>
                <p className="text-[9px] text-neutral-500 font-mono uppercase">Detection Lag</p>
             </div>
             <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <Lock className="w-6 h-6 mx-auto mb-2 text-neutral-500" />
                <h4 className="text-xl font-bold text-white mb-1">Air-Gap</h4>
                <p className="text-[9px] text-neutral-500 font-mono uppercase">Node Status</p>
             </div>
          </div>
        </div>

        {/* Right Col: Console */}
        <div className="lg:col-span-8">
           <div className="h-full min-h-[550px] flex flex-col rounded-2xl bg-black border border-cyan-500/20 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.05)]">
               <div className="h-12 border-b border-cyan-500/20 bg-cyan-500/5 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <Hexagon className="w-4 h-4 text-cyan-500" />
                    <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">Morpheus DPI Pipeline</span>
                  </div>
                  {pipelineState === "scanning" ? (
                     <div className="flex items-center gap-2 text-[9px] text-cyan-500 font-mono uppercase tracking-widest font-bold animate-pulse">
                         Ingesting Packets...
                     </div>
                  ) : pipelineState === "detected" ? (
                     <div className="flex items-center gap-2 text-[9px] text-amber-500 font-mono uppercase tracking-widest font-bold animate-pulse">
                         Analyzing Signatures...
                     </div>
                  ) : pipelineState === "blocked" ? (
                    <div className="flex items-center gap-2 text-[9px] text-rose-500 font-mono uppercase tracking-widest font-bold">
                       <ShieldAlert className="w-3 h-3" /> Threats Neutralized
                    </div>
                  ) : null}
               </div>

               <div className="p-6 flex-1 bg-[url('/noise.png')] bg-repeat opacity-95 overflow-y-auto font-mono text-xs">
                  {pipelineState === "idle" && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                       <Activity className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                       <p className="text-neutral-600 font-mono text-xs uppercase tracking-widest max-w-sm">
                         Morpheus Engine Dormant.<br/>
                         Awaiting manual trigger to bypass Cloudflare and inspect Layer 7 traffic directly via GPU tensors.
                       </p>
                    </div>
                  )}

                  <AnimatePresence>
                     {pipelineState === "scanning" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-cyan-400/80 space-y-2">
                           <p className="animate-pulse">&gt; Loading Deep Learning Inference Models...</p>
                           <p className="animate-pulse delay-75">&gt; Hooking into Stripe Webhook Pipeline (wss://stripe.proxy/v1/events)</p>
                           <p className="animate-pulse delay-150">&gt; Vectorizing packet payloads for temporal anomaly detection...</p>
                           <div className="mt-6 flex flex-wrap gap-2 opacity-50">
                              {Array.from({ length: 150 }).map((_, i) => (
                                <span key={i} className={`text-[8px] ${i % 12 === 0 ? 'text-amber-500' : 'text-cyan-700'}`}>01011</span>
                              ))}
                           </div>
                        </motion.div>
                     )}

                     {pipelineState === "detected" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-amber-400/80 space-y-4">
                           <p className="text-amber-500 font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> WARNING: 14 ANOMALOUS PACKETS DETECTED IN STREAM.</p>
                           <p className="animate-pulse delay-75">&gt; Cross-referencing known Botnet IPs...</p>
                           <p className="animate-pulse delay-150">&gt; Performing NLP intent extraction on fragmented payloads...</p>
                           
                           <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg mt-4">
                             <div className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-2">Extracted Threat Signature</div>
                             <p className="text-amber-200">Velocity attack detected. Attempted to brute-force $0.50 Stripe verification charges across 400 synthesized credit cards originating from TOR exit node [185.220.101.X].</p>
                           </div>
                        </motion.div>
                     )}

                     {pipelineState === "blocked" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-4 border-t border-cyan-500/20 text-rose-400">
                           <p className="font-bold flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> KINETIC ISOLATION ENGAGED.</p>
                           
                           <div className="space-y-2">
                              <p className="text-cyan-400">&gt; Dropping forged handshakes at Layer 4.</p>
                              <p className="text-cyan-400">&gt; Instructing WAF to blacklist AS network block.</p>
                              <p className="text-cyan-400">&gt; Auto-submitting fraud counter-claim to Stripe API.</p>
                           </div>

                           <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-5 shadow-[0_0_30px_rgba(225,29,72,0.1)]">
                              <div className="flex justify-between items-center mb-4 border-b border-rose-500/20 pb-3">
                                <div className="text-[10px] text-rose-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                   <Lock className="w-3 h-3" /> System Secured
                                </div>
                                <div className="text-xs font-mono">$18,400 Protected</div>
                              </div>
                              <p className="text-xs text-rose-100/70">
                                 The Morpheus swarm isolated the velocity attack in 0.04 milliseconds, blocking the fraudulent synthetic card generation before the Stripe authorization hold could occur. Chargeback ratio protected.
                              </p>
                           </div>
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
