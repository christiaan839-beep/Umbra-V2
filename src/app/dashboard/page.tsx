"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Activity, Target, Zap, Bot, ArrowUpRight, Cpu, Server, Brain, Users, Building2, ShieldAlert, Send } from 'lucide-react';
import Link from 'next/link';

const QUICK_ACTIONS = [
  { label: "Apex Strategy", href: "/dashboard/apex-strategy", icon: Cpu, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { label: "Target Outbound", href: "/dashboard/leads", icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  { label: "God-Brain Intel", href: "/dashboard/memory", icon: Brain, color: "text-[#00B7FF]", bg: "bg-[#00B7FF]/10", border: "border-[#00B7FF]/20" },
  { label: "Deploy Social", href: "/dashboard/social", icon: Send, color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20" },
];

const SWARM_SIMULATION = [
  "[APEX] Synthesizing video script variant Alpha-9...",
  "[TAVILY] Executing infinite cross-domain extraction for high-ticket signals.",
  "[NODE] Prospect 'Elena C.' exhibited 94% buy-intent. Initiating sequence.",
  "[SYS] Live Meta Ad #804 deployed. Reallocating $150 daily budget.",
  "[GLITCH] Adjusting multi-agent trajectory...",
  "[REVENUE] Stripe verified: $5,000 monthly retainer executed.",
  "[GEMINI-2.0] Analyzing competitor sales call audio vector. Adjusting pitch framework."
];

export default function EliteCommandCenter() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isGlitching, setIsGlitching] = useState(false);
  const [clientAgg, setClientAgg] = useState<any>({ totalRevenue: 42850, activeClients: 12, totalLeads: 8400 });

  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = SWARM_SIMULATION[Math.floor(Math.random() * SWARM_SIMULATION.length)];
      setLogs((prev) => {
        const newLogs = [`[${new Date().toLocaleTimeString('en-US', { hour12: false })}] ${randomLog}`, ...prev];
        return newLogs.slice(0, 50);
      });

      if (Math.random() > 0.85) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10 p-4 lg:p-8">
      
      {/* Header HUD */}
      <div className="border-b border-[#00B7FF]/20 pb-8 flex justify-between items-end backdrop-blur-3xl bg-black/40 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,183,255,0.05)] border-t border-[#00B7FF]/10">
        <div>
          <h2 className={`text-3xl font-light text-white tracking-widest flex items-center gap-3 mb-2 font-mono ${isGlitching ? 'translate-x-1 opacity-80' : ''}`}>
            [ LIVE SWARM FEED ]
            <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 10px #34d399' }}></span>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest">Active</span>
            </div>
          </h2>
          <p className="text-neutral-400 text-xs tracking-widest uppercase font-sans">
            Autonomous acquisition processes executed by the God-Brain Layer.
          </p>
        </div>
      </div>

      {/* Primary Telemetry Grid (Glassmorphic) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Gross Capital", value: `$${clientAgg.totalRevenue.toLocaleString()}`, change: "+24.5%", icon: DollarSign, color: "text-emerald-400" },
          { label: "Active Client Protocols", value: clientAgg.activeClients, change: "+2", icon: Building2, color: "text-[#00B7FF]" },
          { label: "Extracted Leads", value: clientAgg.totalLeads, change: "+18%", icon: Users, color: "text-rose-400" },
          { label: "God-Brain Synapses", value: 1240, change: "Live", icon: Brain, color: "text-violet-400" },
        ].map((s, i) => (
          <div key={i} className="bg-black/40 backdrop-blur-2xl border border-[#00B7FF]/20 rounded-2xl p-5 relative overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${s.color}`}>
               <s.icon className="w-16 h-16" />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <span className={`text-xs font-mono font-bold flex items-center gap-0.5 ${s.change === 'Live' ? 'text-[#00B7FF] animate-pulse' : 'text-neutral-500'}`}>
                {s.change !== 'Live' && <ArrowUpRight className="w-3 h-3 text-emerald-400" />}
                {s.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-white font-mono relative z-10">{s.value}</p>
            <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-widest font-bold relative z-10">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Central Terminal HUD (Takes up 2 cols) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-black/60 backdrop-blur-3xl border border-[#00B7FF]/20 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] relative h-[500px] flex flex-col">
            <div className="bg-[#0a0a0a]/80 border-b border-[#00B7FF]/20 p-3 flex items-center justify-between z-10 backdrop-blur-md">
               <div className="flex gap-2 opacity-50">
                 <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-[0_0_8px_#f43f5e]"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[0_0_8px_#f59e0b]"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_#10b981]"></div>
               </div>
               <span className="text-[9px] uppercase tracking-[0.3em] text-[#00B7FF]/80 font-mono">/var/log/umbra_swarm</span>
            </div>
            
            <div className="flex-1 p-6 font-mono text-xs overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black z-10 pointer-events-none h-full"></div>
              
              <AnimatePresence>
                {logs.map((log, index) => {
                   const isRevenue = log.includes('REVENUE');
                   const isApex = log.includes('APEX') || log.includes('GEMINI-2.0');
                   const isGlitch = log.includes('GLITCH');
                   
                   return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20, filter: "blur(2px)" }}
                      animate={{ opacity: 1 - (index * 0.05), x: 0, filter: "blur(0px)" }}
                      className={`mb-4 whitespace-pre-wrap flex gap-3 ${isGlitch ? 'animate-pulse translate-x-1' : ''}`}
                    >
                      <span className="text-[#00B7FF]/50">&gt;</span>
                      <span className={isRevenue ? 'text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : isApex ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]' : isGlitch ? 'text-rose-500 italic' : 'text-neutral-300'}>
                        {log}
                      </span>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              
              {logs.length === 0 && (
                <div className="text-[#00B7FF]/60 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(0,183,255,0.5)]">
                   <Activity className="w-4 h-4 animate-spin" />
                   Awaiting stream initialization...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar HUD */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* ROI Calculator Comparison */}
          <div className="bg-black/60 backdrop-blur-3xl border border-[#00B7FF]/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,183,255,0.05)]">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#00B7FF] mb-6 font-bold flex items-center gap-2">
              <Cpu className="w-3 h-3" />
               Agentic Arbitrage
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs tracking-wider text-neutral-500 line-through">Meatbag Agency</span>
                <span className="text-[10px] font-mono text-neutral-600 line-through">$12,000/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs tracking-wider text-neutral-500 line-through">In-House Staff</span>
                <span className="text-[10px] font-mono text-neutral-600 line-through">$24,500/mo</span>
              </div>
              
              <div className="h-px bg-[#00B7FF]/20 w-full my-5"></div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm tracking-widest uppercase font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Sovereign Node</span>
                <span className="text-sm font-mono text-emerald-400 font-bold drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">$5,000/mo</span>
              </div>
              
              <div className="mt-6 bg-[#00B7FF]/10 border border-[#00B7FF]/30 rounded p-3">
                <p className="text-[10px] uppercase tracking-widest text-[#00B7FF]/80 text-center font-bold relative">
                   <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#00B7FF] rounded-full animate-ping"></span>
                   God-Tier Output Engaged
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions / Strike Protocols */}
          <div className="bg-black/60 backdrop-blur-3xl border border-[#00B7FF]/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,183,255,0.05)]">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-5 font-bold flex items-center gap-2">
              <ShieldAlert className="w-3 h-3" /> Strike Protocols
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((a, i) => (
                <Link key={i} href={a.href} className="flex flex-col items-center justify-center text-center gap-3 p-4 rounded-xl bg-black/40 border border-[#00B7FF]/10 hover:border-white/20 transition-all hover:-translate-y-1 group">
                   <div className={`w-8 h-8 rounded-full ${a.bg} ${a.border} border flex items-center justify-center`}>
                      <a.icon className={`w-4 h-4 ${a.color}`} />
                   </div>
                   <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors">
                     {a.label}
                   </span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
