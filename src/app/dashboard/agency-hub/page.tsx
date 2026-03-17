"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Building2, Server, DollarSign, Users, Activity, ExternalLink, Plus, Network, Key } from "lucide-react";
import { AnimatedGridPattern } from "@/components/AnimatedGridPattern";

// Mock data for Reseller Sub-Agencies
const TARGET_AGENCIES = [
  { id: "ag-01", name: "Apex Digital Solutions", mrr: 5000, status: "active", uptime: "99.9%", tokens: "4.2M", license: "Enterprise White-Label" },
  { id: "ag-02", name: "Nexus Media Group", mrr: 5000, status: "active", uptime: "100%", tokens: "2.8M", license: "Enterprise White-Label" },
  { id: "ag-03", name: "Quantum Growth Partners", mrr: 5000, status: "provisioning", uptime: "-", tokens: "-", license: "Enterprise White-Label" },
];

export default function AgencyHubPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative min-h-screen">
      <AnimatedGridPattern />
      
      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white serif-text tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-[#00B7FF]" />
            Agency Cartel Hub
          </h1>
          <p className="text-neutral-400 mt-2 max-w-2xl">
            Sovereign Monetization Engine. Manage your 100% white-labeled sub-agencies. 
            Lease your infrastructure. Automate their fulfillment. Collect MRR.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 min-w-[200px]">
             <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-widest mb-1">
               <DollarSign className="w-3 h-3" /> Monthly Recurring
             </div>
             <div className="text-2xl font-bold text-white">$15,000<span className="text-sm text-neutral-500 font-normal">/mo</span></div>
           </div>
           
           <button className="px-6 py-4 bg-gradient-to-r from-purple-500 to-[#00B7FF] rounded-xl text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap">
             <Plus className="w-4 h-4" /> Provision New License
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column: Network State */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card border border-glass-border p-6">
            <h2 className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-6 flex items-center gap-2">
              <Network className="w-4 h-4" /> Sovereign Network State
            </h2>
            
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                <span className="text-neutral-500">Active Licenses</span>
                <span className="text-emerald-400 font-bold">2 / 5</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                <span className="text-neutral-500">Global GPU Compute</span>
                <span className="text-[#00B7FF] font-bold">TensorRT-LLM</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                <span className="text-neutral-500">Network Lateny</span>
                <span className="text-white font-bold">42ms avg</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                <span className="text-neutral-500">Total Tokens Billed</span>
                <span className="text-white font-bold text-[10px]">7,042,109</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
               <button className="w-full py-3 bg-black border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-[#00B7FF] hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                 <Key className="w-4 h-4" /> Manage Global API Keys
               </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Cartel Members */}
        <div className="lg:col-span-2">
          <div className="glass-card border border-glass-border p-6 min-h-[500px]">
             
             <div className="flex items-center gap-4 border-b border-white/10 mb-6 pb-4">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'overview' ? 'text-[#00B7FF]' : 'text-neutral-500 hover:text-white'}`}
                >
                  Deployed Nodes
                </button>
                <button 
                  onClick={() => setActiveTab('billing')}
                  className={`text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'billing' ? 'text-[#00B7FF]' : 'text-neutral-500 hover:text-white'}`}
                >
                  Cartel Billing
                </button>
             </div>

             <div className="space-y-4">
                {TARGET_AGENCIES.map(agency => (
                  <motion.div 
                    key={agency.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors rounded-xl flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 ${
                         agency.status === 'active' 
                         ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                         : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                       }`}>
                         <Building2 className="w-5 h-5" />
                       </div>
                       <div>
                         <h3 className="text-base font-bold text-white flex items-center gap-2">
                           {agency.name}
                           {agency.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>}
                         </h3>
                         <div className="flex items-center gap-3 mt-1.5">
                           <span className="text-[10px] text-[#00B7FF] font-mono tracking-widest uppercase">{agency.license}</span>
                           <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1"><Server className="w-3 h-3"/> {agency.uptime}</span>
                           <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1"><Activity className="w-3 h-3"/> {agency.tokens} tkns</span>
                         </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-6">
                       <div className="text-right">
                         <div className="text-sm font-bold text-white">${agency.mrr.toLocaleString()}</div>
                         <div className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Monthly Yield</div>
                       </div>
                       <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#00B7FF] hover:text-white transition-all text-neutral-400 opacity-0 group-hover:opacity-100">
                         <ExternalLink className="w-4 h-4" />
                       </button>
                    </div>
                  </motion.div>
                ))}
             </div>
             
             <div className="mt-8 text-center p-8 border border-dashed border-white/10 rounded-xl bg-black/20">
               <Users className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
               <h4 className="text-sm font-bold text-white mb-2">Scale Your Empire</h4>
               <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                 Use the Deepfake Prospector to acquire more traditional agencies. 
                 Sovereign Matrix scales horizontally with zero marginal cost.
               </p>
             </div>

          </div>
        </div>

      </div>
    </div>
  );
}
