"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, GitCommit, Database, ShieldCheck, AlertTriangle, Fingerprint, Lock } from 'lucide-react';

export default function ComplianceTerminal() {
  const [governorActive, setGovernorActive] = useState(true);

  const complianceNodes = [
    { name: "Meta Graph API", risk: "Low", limit: "12%", status: "Healthy", icon: Database, color: "text-emerald-400" },
    { name: "Twilio A2P 10DLC", risk: "Low", limit: "N/A", status: "Registered", icon: Fingerprint, color: "text-emerald-400" },
    { name: "Google Workspace SMTP", risk: "Medium", limit: "42%", status: "Monitoring", icon: ShieldAlert, color: "text-amber-400" },
    { name: "Tavily Web Scraping", risk: "High", limit: "88%", status: "Proxy Rotating", icon: GitCommit, color: "text-rose-400" },
    { name: "Stripe Webhook E2E", risk: "Low", limit: "2%", status: "Secure", icon: Lock, color: "text-emerald-400" }
  ];

  const recentInterventions = [
    { time: "14:22:01", action: "Blocked 'Get Rich Quick' phrase in ad creative #442", system: "Meta Ad Buyer" },
    { time: "13:45:19", action: "Rotated IP Proxy to prevent 429 Too Many Requests", system: "Programmatic SEO" },
    { time: "11:10:55", action: "Throttled WhatsApp broadcast to comply with 10msg/sec limit", system: "Nurture Matrix" }
  ];

  return (
    <div className="min-h-screen bg-[#050505] p-8 md:p-12 font-sans text-neutral-200">
      
      {/* Header */}
      <div className="mb-12 border-b border-neutral-800/50 pb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-sm border border-emerald-500/30 flex items-center justify-center bg-emerald-500/10"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </motion.div>
            <h1 className="text-3xl font-light tracking-tight text-white">Compliance & Risk</h1>
          </div>
          <p className="text-neutral-500 max-w-2xl tracking-wide">
            Enterprise-grade Sovereign Guardian. Monitors API velocity limits, rotates routing proxies, and enforces strict TOS compliance parameters across the AI Memory.
          </p>
        </div>
        
        {/* Master Switch */}
        <button 
          onClick={() => setGovernorActive(!governorActive)}
          className={`px-4 py-2 rounded font-mono text-xs flex items-center gap-2 border transition-colors ${
            governorActive 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20 animate-pulse'
          }`}
        >
          {governorActive ? <Lock className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          {governorActive ? 'AGI GOVERNOR ACTIVE' : 'AGI OVERRIDE - RISK HIGH'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: API Health matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-8 backdrop-blur-md">
            <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              API Telemetry & Ban Prophylaxis
            </h3>

            <div className="grid grid-cols-1 gap-4">
               {complianceNodes.map((node, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="flex items-center justify-between p-4 bg-neutral-800/20 border border-neutral-800 rounded-lg hover:bg-neutral-800/50 transition-colors"
                 >
                   <div className="flex items-center gap-4">
                     <div className={`p-2 bg-neutral-900 rounded border border-neutral-800`}>
                       <node.icon className={`w-4 h-4 ${node.color}`} />
                     </div>
                     <div>
                       <p className="text-white text-sm font-medium tracking-wide">{node.name}</p>
                       <p className="text-xs text-neutral-500 mt-0.5 border border-neutral-800 inline-block px-1.5 rounded font-mono">Limit: {node.limit}</p>
                     </div>
                   </div>

                   <div className="flex items-center gap-6">
                     <div className="text-right">
                       <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Risk Vector</p>
                       <p className={`text-xs font-bold ${node.risk === 'High' ? 'text-rose-400' : node.risk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>{node.risk}</p>
                     </div>
                     <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                        node.status === 'Healthy' || node.status === 'Registered' || node.status === 'Secure' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                        node.status === 'Monitoring' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                     }`}>
                       {node.status}
                     </span>
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>
        </div>

        {/* Right: Governor Logs */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-6 backdrop-blur-md h-full">
            <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Governor Interventions
            </h3>

            <div className="space-y-4">
              {recentInterventions.map((log, i) => (
                <div key={i} className="border-l-2 border-neutral-800 pl-4 py-1 relative">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-emerald-500/50"></div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-emerald-400 font-mono">{log.time}</span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">{log.system}</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">{log.action}</p>
                </div>
              ))}

              <div className="mt-8 p-4 bg-emerald-500/5 text-emerald-400 text-xs rounded border border-emerald-500/10 space-y-2">
                <p className="font-bold flex items-center gap-2"><Lock className="w-3 h-3" /> System Secured</p>
                <p className="opacity-80">The AGI Governor is intercepting payload injections and parsing against known Big Tech ban-signatures.</p>
              </div>
            </div>
           </div>
        </div>

      </div>
    </div>
  );
}
