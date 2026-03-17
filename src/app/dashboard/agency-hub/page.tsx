"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Plus, Users, Globe2, Activity, Settings2, ShieldCheck, DollarSign, Database, HardDrive, Key } from "lucide-react";

const INITIAL_TENANTS = [
  { id: "TNT-001", name: "Elevate Marketing Solutions", mrr: 4997, status: "active", users: 12, storage: "142 GB" },
  { id: "TNT-002", name: "Apex Lead Gen Co.", mrr: 4997, status: "active", users: 4, storage: "18 GB" },
  { id: "TNT-003", name: "Quantum Design Studio", mrr: 4997, status: "provisioning", users: 0, storage: "0 GB" },
];

export default function AgencyHubPage() {
  const [tenants, setTenants] = useState(INITIAL_TENANTS);
  const [isProvisioning, setIsProvisioning] = useState(false);

  const spawnTenant = () => {
    setIsProvisioning(true);
    setTimeout(() => {
      setTenants([
        { id: `TNT-00${tenants.length + 1}`, name: "New Sub-Agency XYZ", mrr: 4997, status: "active", users: 1, storage: "1 GB" },
        ...tenants
      ]);
      setIsProvisioning(false);
    }, 4000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-bold uppercase tracking-wider mb-3">
             <Briefcase className="w-3 h-3" /> The Syndicate Architecture
           </div>
           <h1 className="text-3xl font-bold font-sans tracking-tight mb-2 flex items-center gap-3">
             Agency Reseller Hub
           </h1>
           <p className="text-sm text-neutral-400 max-w-xl">
             You are operating as the Root Node. Provision isolated UMBRA instances (Tenants) for other digital agencies. Charge them $4,997/month for access to the Sovereign AI toolkit.
           </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Total MRR Flow</p>
              <p className="text-2xl font-mono text-emerald-400">${(tenants.length * 4997).toLocaleString()}</p>
           </div>
           <button 
             onClick={spawnTenant}
             disabled={isProvisioning}
             className="px-6 py-4 rounded-xl bg-fuchsia-500 text-white font-bold uppercase tracking-widest text-xs hover:bg-fuchsia-600 transition-colors shadow-[0_0_20px_rgba(217,70,239,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
           >
             {isProvisioning ? <Activity className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
             Deploy New Tenant
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
               <Database className="w-5 h-5 text-neutral-400" />
               <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Total Tenants</span>
            </div>
            <div className="text-3xl font-mono text-white mt-4">{tenants.length}</div>
            <p className="text-[10px] text-emerald-400 mt-2 font-bold tracking-wider">+1 this week</p>
         </div>
         <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
               <HardDrive className="w-5 h-5 text-neutral-400" />
               <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Aggregate Compute</span>
            </div>
            <div className="text-3xl font-mono text-white mt-4">160 GB</div>
            <p className="text-[10px] text-fuchsia-400 mt-2 font-bold tracking-wider">4% of Root Capacity</p>
         </div>
         <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
               <ShieldCheck className="w-5 h-5 text-neutral-400" />
               <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Network Status</span>
            </div>
            <div className="text-3xl font-mono text-emerald-400 mt-4">Secure</div>
            <p className="text-[10px] text-neutral-500 mt-2 font-mono tracking-wider">NVIDIA Guardrails Active</p>
         </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black overflow-hidden shadow-[0_0_50px_rgba(217,70,239,0.05)]">
         <div className="h-12 border-b border-white/10 bg-white/[0.02] flex items-center px-6">
            <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">Live Tenant Telemetry</span>
         </div>
         <div className="p-0">
            <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-neutral-500 font-bold bg-white/[0.01]">
                   <th className="p-4 font-normal">Tenant ID</th>
                   <th className="p-4 font-normal">Agency Name</th>
                   <th className="p-4 font-normal">Status</th>
                   <th className="p-4 font-normal">Active Users</th>
                   <th className="p-4 font-normal">Monthly Rent</th>
                   <th className="p-4 font-normal">Controls</th>
                 </tr>
               </thead>
               <tbody>
                 <AnimatePresence>
                    {isProvisioning && (
                       <motion.tr 
                         initial={{ opacity: 0, backgroundColor: 'rgba(217,70,239,0.1)' }} 
                         animate={{ opacity: 1, backgroundColor: 'rgba(0,0,0,0)' }} 
                         exit={{ opacity: 0 }}
                         className="border-b border-white/5"
                       >
                         <td className="p-4"><span className="text-xs font-mono text-neutral-400 animate-pulse">Assigning ID...</span></td>
                         <td className="p-4"><span className="text-xs font-bold text-white">Cloning UMBRA Instance...</span></td>
                         <td className="p-4">
                           <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                             Provisioning
                           </span>
                         </td>
                         <td className="p-4 font-mono text-xs text-neutral-400">-</td>
                         <td className="p-4 font-mono text-xs text-emerald-400">$4,997</td>
                         <td className="p-4">
                           <Activity className="w-4 h-4 text-neutral-500 animate-spin" />
                         </td>
                       </motion.tr>
                    )}
                    {tenants.map(tenant => (
                      <motion.tr 
                        key={tenant.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                         <td className="p-4 font-mono text-xs text-neutral-500">{tenant.id}</td>
                         <td className="p-4 font-bold text-sm text-white flex items-center gap-2">
                           <Globe2 className="w-4 h-4 text-fuchsia-400" />
                           {tenant.name}
                         </td>
                         <td className="p-4">
                            <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                              {tenant.status}
                            </span>
                         </td>
                         <td className="p-4 font-mono text-xs text-neutral-400 flex items-center gap-2">
                           <Users className="w-3 h-3" /> {tenant.users}
                         </td>
                         <td className="p-4">
                           <span className="flex items-center gap-1 font-mono text-xs text-emerald-400">
                             <DollarSign className="w-3 h-3" />{tenant.mrr.toLocaleString()}
                           </span>
                         </td>
                         <td className="p-4">
                           <div className="flex items-center gap-3">
                              <button className="text-neutral-500 hover:text-white transition-colors"><Settings2 className="w-4 h-4" /></button>
                              <button className="text-neutral-500 hover:text-fuchsia-400 transition-colors"><Key className="w-4 h-4" /></button>
                           </div>
                         </td>
                      </motion.tr>
                    ))}
                 </AnimatePresence>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
