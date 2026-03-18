"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Lock, CreditCard, ExternalLink, Activity } from "lucide-react";

export default function BillingPortal() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 lg:p-8">
      
      {/* 🔴 TACTICAL ELITE HEADER */}
      <header className="border-b border-emerald-500/20 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Cartel Retainer Access</h1>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest mt-1">Account & Subscription Matrix</p>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Status Panel */}
         <div className="lg:col-span-2 p-8 bg-black/60 border border-white/5 rounded-3xl">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" /> Active Subscription Core
                </h2>
                <span className="px-3 py-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
                </span>
             </div>
             
             <div className="flex items-end gap-2 mb-2">
               <span className="text-5xl font-mono font-bold text-white">$5,000</span>
               <span className="text-neutral-500 font-bold mb-1 uppercase tracking-widest">/ month</span>
             </div>
             <p className="text-sm text-neutral-400 max-w-lg">
               Your deployment of the Sovereign Swarm is active until <strong>April 18th, 2026</strong>. Failing to maintain balance will result in immediate API disconnection and shutdown of all automated outreach nodes.
             </p>

             <button className="mt-8 w-full md:w-auto px-8 py-4 bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" /> Manage Paystack/Stripe Portal <ExternalLink className="w-3 h-3" />
             </button>
         </div>

         {/* Usage Panel */}
         <div className="p-8 bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Allocated Cloud GPU</h3>
            <p className="text-sm text-neutral-400 mb-6">
              Your $5,000 retainer actively covers dedicated NVIDIA TensorRT API throughput, ElevenLabs audio allocations, and highly-available node provisioning.
            </p>

            <ul className="space-y-4">
              {['Unlimited Gemini 1.5 Pro Token Streams', '10,000 Local Outbound Extractions / wk', 'Full NemoClaw OS Virtualization Rights'].map((perk, i) => (
                 <li key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                    <Lock className="w-4 h-4 text-emerald-500/50" /> {perk}
                 </li>
              ))}
            </ul>
         </div>
      </div>
    </div>
  );
}
