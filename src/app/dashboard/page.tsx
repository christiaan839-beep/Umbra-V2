"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, DollarSign, Users, Brain, Activity, ArrowUpRight, Play, FileText, Send, Wrench, Database, Network, ShieldAlert, Cpu, Globe2, Server, Building2 } from "lucide-react";
import Link from "next/link";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } },
});

const QUICK_ACTIONS = [
  { label: "Apex Strategy", href: "/dashboard/apex-strategy", icon: Cpu, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { label: "Target Outbound", href: "/dashboard/leads", icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  { label: "God-Brain Intel", href: "/dashboard/memory", icon: Brain, color: "text-electric", bg: "bg-electric/10", border: "border-electric/20" },
  { label: "Deploy Social", href: "/dashboard/social", icon: Send, color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20" },
];

function MiniChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1.5 h-20 w-full relative">
       {/* Glowing average line */}
       <div className="absolute top-1/2 left-0 right-0 border-t border-electric/30 border-dashed w-full -translate-y-1/2" />
       
      {data.map((v, i) => (
        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }}
          transition={{ delay: i * 0.05, duration: 0.7, ease: "easeOut" }}
          className={`flex-1 rounded-t relative z-10 ${i === data.length - 1 ? "bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]" : "bg-onyx border-x border-t border-glass-border/50"}`}
        />
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  const [omni, setOmni] = useState<any>(null);
  const [clientAgg, setClientAgg] = useState<any>({ totalRevenue: 0, activeClients: 0, totalLeads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [omniRes, clientRes] = await Promise.all([
          fetch("/api/swarm/omnipresence"),
          fetch("/api/clients?aggregate=true")
        ]);
        
        const omniData = await omniRes.json();
        const clientData = await clientRes.json();

        if (omniData.data) setOmni(omniData.data);
        if (clientData.metrics) setClientAgg(clientData.metrics);
        
        setLoading(false);
      } catch (e) {
        console.error("Dashboard DB Sync Error", e);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 8000); // Live sync
    return () => clearInterval(interval);
  }, []);

  const chartData = [12000, 15000, 14000, 19000, 18000, 24000, 22000, 28000, 26000, 34000, 31000, clientAgg.totalRevenue || 42000];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2 flex items-center gap-3">
            <Server className="w-8 h-8 text-electric" /> Command Center
          </h1>
          <p className="text-sm text-[#8A95A5] uppercase tracking-widest font-bold">Autonomous Swarm OS • Global Overview</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
          <span className="relative flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-emerald-400 font-mono tracking-widest">
            {loading ? "SYNCING..." : `${omni?.stats?.activeNodes || 1240} NODES ACTIVE`}
          </span>
        </div>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Gross Capital", value: `$${clientAgg.totalRevenue.toLocaleString()}`, change: "+24.5%", icon: DollarSign, color: "text-emerald-400" },
          { label: "Active Client Protocols", value: clientAgg.activeClients, change: "+2", icon: Building2, color: "text-electric" },
          { label: "Extracted Leads", value: clientAgg.totalLeads, change: "+18%", icon: Users, color: "text-rose-400" },
          { label: "God-Brain Synapses", value: omni?.telemetry?.length || 0, change: "Live", icon: Brain, color: "text-violet-400" },
        ].map((s, i) => (
          <motion.div key={i} {...fade(i)} className="glass-card p-5 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${s.color}`}>
               <s.icon className="w-16 h-16" />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <span className={`text-xs font-mono font-bold flex items-center gap-0.5 ${s.change === 'Live' ? 'text-electric animate-pulse' : 'text-[#8A95A5]'}`}>
                {s.change !== 'Live' && <ArrowUpRight className="w-3 h-3 text-emerald-400" />}
                {s.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-white font-mono relative z-10">{loading ? "—" : s.value}</p>
            <p className="text-[10px] text-[#8A95A5] mt-1 uppercase tracking-widest font-bold relative z-10">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Treasury Projection */}
        <motion.div {...fade(4)} className="glass-card p-6 xl:col-span-2 flex flex-col justify-between relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-emerald-400/5 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
               <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
                 <TrendingUp className="w-4 h-4 text-emerald-400" /> Capital Trajectory
               </h2>
               <p className="text-xs text-text-secondary mt-1">12-Month Rolling Average</p>
            </div>
            <div className="text-right">
               <span className="text-2xl font-bold text-white font-mono">${chartData[chartData.length-1].toLocaleString()}</span>
               <span className="block text-xs font-mono text-emerald-400">+187% YoY</span>
            </div>
          </div>
          <div className="relative z-10">
             <MiniChart data={loading ? [0,0,0,0,0,0,0,0,0,0,0,0] : chartData} />
             <div className="flex justify-between mt-3 text-[10px] uppercase font-bold text-text-secondary/50 tracking-widest">
               <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span><span>Current</span>
             </div>
          </div>
        </motion.div>

        {/* Global Strike Actions */}
        <motion.div {...fade(5)} className="glass-card p-6 flex flex-col">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#8A95A5] mb-5 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Strike Protocols
          </h2>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {QUICK_ACTIONS.map((a, i) => (
              <Link key={i} href={a.href} className="flex flex-col items-center justify-center text-center gap-3 p-4 rounded-xl bg-[#0B0C10] border border-glass-border hover:border-white/20 transition-all hover:-translate-y-1 group">
                 <div className={`w-10 h-10 rounded-full ${a.bg} ${a.border} border flex items-center justify-center`}>
                    <a.icon className={`w-5 h-5 ${a.color}`} />
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary group-hover:text-white transition-colors">
                   {a.label}
                 </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* God-Brain Global Telemetry Feed */}
      <motion.div {...fade(6)} className="glass-card overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-glass-border flex items-center justify-between bg-[#0B0C10]/50">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#8A95A5] flex items-center gap-2">
             <Globe2 className="w-4 h-4 text-electric" /> Omnipresence Telemetry Stream
          </h2>
          <span className="flex items-center gap-2 px-2 py-1 bg-electric/10 rounded-md text-[10px] font-bold text-electric uppercase tracking-widest border border-electric/20">
             <Activity className="w-3 h-3 animate-pulse" /> Live Upload
          </span>
        </div>
        
        <div className="divide-y divide-glass-border max-h-[400px] overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="p-12 flex flex-col items-center justify-center text-text-secondary/50">
                <Database className="w-8 h-8 mb-4 animate-pulse opacity-50" />
                <p className="text-xs font-mono uppercase tracking-widest">Querying God-Brain Database...</p>
             </div>
          ) : omni?.telemetry ? (
             <AnimatePresence>
               {omni.telemetry.slice(0, 10).map((log: any, i: number) => {
                 const isCapital = log.type === 'capital';
                 const isAttention = log.type === 'attention';
                 const cColor = isCapital ? 'text-emerald-400' : isAttention ? 'text-pink-500' : 'text-electric';
                 
                 return (
                   <motion.div key={log.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                     className="flex items-center gap-4 px-6 py-4 hover:bg-glass-bg/30 transition-colors group">
                     
                     <div className="w-12 text-center shrink-0">
                        <span className="text-[10px] font-mono text-text-secondary/50 group-hover:text-white/50 transition-colors">
                           {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' })}
                        </span>
                     </div>
                     
                     <div className={`p-2 rounded-lg bg-[#0B0C10] border border-glass-border shrink-0 ${cColor}`}>
                        {isCapital ? <DollarSign className="w-4 h-4" /> : isAttention ? <Send className="w-4 h-4" /> : <Network className="w-4 h-4" />}
                     </div>
                     
                     <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm text-white/90 truncate font-mono">{log.description}</p>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-[#8A95A5] mt-1 flex items-center gap-2">
                           <span className={cColor}>{log.location.name} [{log.location.region}]</span> • NODE_{log.id.split('_')[1].substring(0,6)}
                        </p>
                     </div>
                   </motion.div>
                 );
               })}
             </AnimatePresence>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
