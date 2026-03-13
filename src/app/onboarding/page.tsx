"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalSquare, ShieldCheck, Zap, ArrowRight, BrainCircuit, ScanLine, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { UmbraLogo } from "@/components/ui/UmbraLogo";

const LOG_MESSAGES = [
   "Establishing secure uplink to The God-Brain...",
   "Bypassing standard human latency structures...",
   "Initializing sub-swarm cluster (Nodes 001 - 045)...",
   "Injecting brand contextual vectors...",
   "Pre-warming Nexus pipeline sequences...",
];

export default function GenesisOnboarding() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<"input" | "provisioning" | "complete">("input");
  const [logs, setLogs] = useState<string[]>([]);
  const [architecture, setArchitecture] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!url || !url.includes(".")) return;
    
    setStep("provisioning");
    
    // Simulate streaming initial terminal logs before API completes
    const logInterval = setInterval(() => {
        setLogs(prev => {
           const nextLog = LOG_MESSAGES[prev.length];
           if(nextLog) return [...prev, nextLog];
           clearInterval(logInterval);
           return prev;
        });
    }, 800);

    try {
        const res = await fetch("/api/swarm/genesis/provision", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ url })
        });

        const data = await res.json();
        clearInterval(logInterval);

        if(data.success) {
            setLogs(prev => [...prev, `[SUCCESS] Sub-Swarm provisioned for ${url}.`]);
            setArchitecture(data.data.architecture);
            setTimeout(() => setStep("complete"), 1500);
        } else {
             setLogs(prev => [...prev, `[ERROR] Connection failed. Fallback engaged.`]);
        }
    } catch(err) {
        setLogs(prev => [...prev, `[FATAL] Provisioning suspended.`]);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative font-sans overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="absolute top-8 left-8 flex items-center gap-3">
             <UmbraLogo size="sm" />
             <span className="text-sm font-bold tracking-[0.2em] uppercase text-white font-serif">UMBRA // Genesis Node</span>
        </div>

        <div className="w-full max-w-2xl relative z-10">
            <AnimatePresence mode="wait">
                
                {/* Step 1: Input URL */}
                {step === "input" && (
                    <motion.div 
                        key="input"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-card p-10 border border-electric/30 shadow-[0_0_50px_rgba(45,110,255,0.1)]"
                    >
                        <div className="flex justify-center mb-6">
                             <div className="w-16 h-16 rounded-full bg-electric/10 border border-electric/30 flex items-center justify-center">
                                 <ScanLine className="w-8 h-8 text-electric" />
                             </div>
                        </div>
                        <h1 className="text-3xl font-bold text-center mb-2 serif-text text-white">Target Acquisition</h1>
                        <p className="text-text-secondary text-center max-w-md mx-auto mb-8 leading-relaxed">
                            Payment verified. Welcome to the Swarm. Enter your primary web domain to unleash UMBRA. 
                        </p>

                        <form onSubmit={handleProvision} className="flex flex-col gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <TerminalSquare className="h-5 w-5 text-electric/50" />
                                </div>
                                <input 
                                    type="text" 
                                    className="block w-full pl-12 pr-4 py-4 border-2 border-glass-border rounded-lg bg-onyx/30 text-white placeholder-text-secondary/50 focus:ring-0 focus:border-electric transition-colors"
                                    placeholder="https://your-company.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={!url}
                                className="w-full bg-gradient-to-r from-electric to-rose-glow text-white font-bold py-4 rounded-lg uppercase tracking-widest text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
                            >
                                Initiate Provisioning <Zap className="w-4 h-4 ml-2" />
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* Step 2: Provisioning Terminal */}
                {step === "provisioning" && (
                     <motion.div 
                        key="provisioning"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card p-8 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
                    >
                         <h2 className="text-xl font-bold mb-6 flex items-center gap-3 border-b border-glass-border pb-4 uppercase tracking-[0.1em] text-emerald-400">
                             <Loader2 className="w-6 h-6 animate-spin text-emerald-400" /> Genesis Engine Active
                         </h2>
                         
                         <div className="bg-black/60 border border-glass-border p-4 rounded-lg h-64 overflow-y-auto font-mono text-xs text-emerald-500/80 space-y-2">
                             {logs.map((log, i) => (
                                 <motion.div 
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} 
                                    key={i} className="flex gap-2"
                                 >
                                     <span className="text-text-secondary shrink-0">{`[+${i*0.8}s]`}</span>
                                     <span className={log.includes("SUCCESS") ? "text-white font-bold" : ""}>{`> ${log}`}</span>
                                 </motion.div>
                             ))}
                             {/* Blinking cursor */}
                             {logs.length < LOG_MESSAGES.length + 1 && (
                                <div className="w-2 h-4 bg-emerald-500 animate-pulse mt-2" />
                             )}
                             <div ref={logsEndRef} />
                         </div>
                    </motion.div>
                )}

                {/* Step 3: Complete / Architecture Output */}
                {step === "complete" && (
                    <motion.div 
                        key="complete"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-10 border border-electric/30 shadow-[0_0_50px_rgba(45,110,255,0.15)]"
                    >
                         <div className="flex justify-center mb-6">
                             <div className="w-16 h-16 rounded-full bg-electric/10 border border-electric/30 flex items-center justify-center">
                                 <ShieldCheck className="w-8 h-8 text-electric" />
                             </div>
                        </div>
                        <h2 className="text-2xl font-bold text-center mb-2 serif-text text-white">Swarm Synchronized</h2>
                        <p className="text-text-secondary text-center max-w-md mx-auto mb-8 leading-relaxed text-sm">
                            Your bespoke UMBRA subdivision is online. Based on the deep crawl of <span className="text-electric">{url}</span>, the Apex Node has compiled your Initial Campaign Architecture:
                        </p>

                        <div className="space-y-3 mb-10">
                            {architecture.map((item, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.2 }}
                                    key={index} className="bg-electric/5 border border-electric/20 p-4 rounded-lg flex items-start gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-electric shrink-0 mt-0.5" />
                                    <span className="text-sm text-stone-300 leading-relaxed font-mono">{item}</span>
                                </motion.div>
                            ))}
                        </div>

                        <button 
                            onClick={() => router.push("/dashboard")}
                            className="w-full bg-white text-midnight font-bold py-4 rounded-lg uppercase tracking-widest text-sm hover:translate-y-[1px] shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2"
                        >
                            Enter The Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    </div>
  );
}
