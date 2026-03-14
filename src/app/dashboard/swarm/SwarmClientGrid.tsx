"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Server, Database, Activity, Scan, Film, Zap, Clock, ShieldCheck } from 'lucide-react';

// Simulated live telemetry data for UI presentation
const MOCK_NODES = [
  { id: 'UMB-NX-77492', status: 'ACTIVE', load: 45, task: 'Omni-Scraping Lead Database', ping: 24, lastActive: 'Just now' },
  { id: 'UMB-SYNTH-01', status: 'PROCESSING', load: 88, task: 'Rendering HeyGen Video [Alex Hormozi Style]', ping: 112, lastActive: '2s ago' },
  { id: 'UMB-DB-CORE', status: 'ACTIVE', load: 12, task: 'Ingesting Vector Embeddings', ping: 8, lastActive: 'Just now' },
];

const MOCK_WEBHOOKS = [
  { id: 'wh_apollo_batch_992', source: 'Apollo API', action: 'Extracted 25 Leads', status: '200 OK', time: '12:04:33' },
  { id: 'wh_stripe_sub_551', source: 'Stripe Gateway', action: 'Captured $5,000 Retainer', status: '200 OK', time: '12:02:15' },
  { id: 'wh_eleven_gen_114', source: 'ElevenLabs API', action: 'Synthesized Voice Profile CL', status: '200 OK', time: '11:59:42' },
  { id: 'wh_heygen_rnd_882', source: 'HeyGen render', action: 'Video Synthesis Complete', status: '201 Created', time: '11:45:10' },
];

interface SwarmClientProps {
  initialIngestionRate: number;
  activeNodesCount: number;
}

export default function SwarmClientGrid({ initialIngestionRate, activeNodesCount }: SwarmClientProps) {
  const [nodes] = useState(MOCK_NODES);
  const [systemLoad, setSystemLoad] = useState(34);
  const [ingestionRate, setIngestionRate] = useState(initialIngestionRate); 

  // Simulate live data fluctuations to make the dashboard feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(prev => Math.max(10, Math.min(95, prev + (Math.random() * 10 - 5))));
      setIngestionRate(prev => Math.max(initialIngestionRate - 20, Math.min(initialIngestionRate * 5, prev + (Math.random() * 40 - 20))));
    }, 2000);
    return () => clearInterval(interval);
  }, [initialIngestionRate]);

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-2rem)] flex flex-col relative z-10 selection:bg-indigo-500/30">
      
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-light text-white tracking-widest font-mono flex items-center gap-3">
            <Network className="w-8 h-8 text-indigo-400" /> 
            SWARM OPERATIONS
          </h1>
          <p className="text-neutral-500 uppercase tracking-[0.2em] text-xs mt-2 font-bold">
            Live Telemetry • Multi-Node Deployment • System Diagnostics
          </p>
        </div>
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
           <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
           <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
             All Systems Nominal
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* KPI: System Load */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-colors"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Server className="w-24 h-24 text-indigo-400" />
          </div>
          <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-2">Global CPU Load</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-light font-mono text-white">{systemLoad.toFixed(1)}</span>
            <span className="text-sm text-indigo-400 font-mono mb-1">%</span>
          </div>
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-indigo-500" 
               initial={{ width: 0 }}
               animate={{ width: `${systemLoad}%` }}
               transition={{ duration: 0.5 }}
             />
          </div>
        </motion.div>

        {/* KPI: DB Ingestion */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Database className="w-24 h-24 text-emerald-400" />
          </div>
          <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-2">Neon DB Ingestion</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-light font-mono text-white">{Math.floor(ingestionRate)}</span>
            <span className="text-sm text-emerald-400 font-mono mb-1">REQ/M</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-neutral-400 font-mono">Physical Stream Active</span>
          </div>
        </motion.div>

        {/* KPI: Pipeline Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/30 transition-colors"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck className="w-24 h-24 text-amber-400" />
          </div>
          <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-2">Automated Funnel</p>
          <div className="flex flex-col gap-1 mt-2 font-mono text-xs">
             <div className="flex justify-between text-neutral-300">
               <span>Scraper Nodes</span>
               <span className="text-emerald-400">ONLINE</span>
             </div>
             <div className="flex justify-between text-neutral-300">
               <span>Stripe Billing</span>
               <span className="text-emerald-400">ARMED</span>
             </div>
             <div className="flex justify-between text-neutral-300">
               <span>Video Synthesis</span>
               <span className="text-amber-400">STANDBY</span>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Active Node Fleet */}
        <div className="bg-black/60 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
           <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-widest font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" /> Active Compute Nodes
              </h3>
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-mono rounded">{Math.max(3, activeNodesCount)} ONLINE</span>
           </div>
           <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-3">
              <AnimatePresence>
                {nodes.map((node, i) => (
                  <motion.div 
                    key={node.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-white/20 transition-colors cursor-default"
                  >
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${node.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                           {node.status === 'ACTIVE' ? <Activity className="w-5 h-5 text-emerald-400" /> : <Clock className="w-5 h-5 text-amber-400 animate-spin-slow" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <span className="font-mono text-white text-sm">{node.id}</span>
                             <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${node.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                               {node.status}
                             </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">{node.task}</p>
                        </div>
                     </div>
                     <div className="text-right font-mono">
                        <div className="text-xs text-neutral-400 mb-1 flex items-center gap-1 justify-end">
                          <Zap className="w-3 h-3" /> {node.ping}ms
                        </div>
                        <div className="h-1 w-16 bg-white/10 rounded-full overflow-hidden ml-auto">
                          <div className={`h-full ${node.load > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${node.load}%` }} />
                        </div>
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>

        {/* Live Webhook Intercepts */}
        <div className="bg-black/60 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
           <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-widest font-bold text-white flex items-center gap-2">
                <Scan className="w-4 h-4 text-[#00B7FF]" /> Live Webhook Intercepts
              </h3>
              <div className="w-2 h-2 rounded-full bg-[#00B7FF] animate-ping" />
           </div>
           <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
              <div className="relative border-l border-white/10 ml-3 space-y-6 pb-4">
                 <AnimatePresence>
                   {MOCK_WEBHOOKS.map((hook, i) => (
                     <motion.div 
                       key={hook.id}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.15 }}
                       className="relative pl-6"
                     >
                        <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#00B7FF] border-[3px] border-black shadow-[0_0_10px_rgba(0,183,255,0.5)]" />
                        <div className="bg-black/40 border border-white/5 p-3 rounded-lg hover:border-[#00B7FF]/30 transition-colors">
                           <div className="flex justify-between items-start mb-1">
                             <span className="font-mono text-xs text-[#00B7FF] uppercase tracking-wider">{hook.source}</span>
                             <span className="font-mono text-xs text-neutral-500">{hook.time}</span>
                           </div>
                           <p className="text-sm text-white mb-2">{hook.action}</p>
                           <div className="flex items-center justify-between">
                             <span className="text-[10px] font-mono text-neutral-600">{hook.id}</span>
                             <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{hook.status}</span>
                           </div>
                        </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
              </div>
           </div>
        </div>

      </div>

      {/* Synthetic Media Outbox */}
      <div className="bg-black/60 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] mt-6">
          <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-pink-500" /> Synthetic Media Outbox
            </h3>
            <span className="px-2 py-1 bg-pink-500/20 text-pink-500 font-mono text-[10px] tracking-widest rounded uppercase">Awaiting Render</span>
          </div>
          <div className="p-8 flex items-center justify-center border-t border-white/5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-20 relative min-h-[250px]">
             {/* Empty State Grid Pattern */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
             
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center justify-center text-center relative z-10"
             >
                <div className="w-16 h-16 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,0,0,0.8)] custom-glow">
                   <Film className="w-8 h-8 text-neutral-600" />
                </div>
                <h4 className="text-white font-mono text-sm tracking-widest uppercase mb-2">No Active Syntheses</h4>
                <p className="text-neutral-500 text-xs w-64 leading-relaxed">The God-Brain has not dispatched any video rendering payloads to the Edge recently. Waiting for Swarm initiation.</p>
             </motion.div>
          </div>
      </div>
    </div>
  );
}
