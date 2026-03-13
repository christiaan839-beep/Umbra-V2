"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, BarChart3, TrendingUp, Zap, Target, Activity, Flame, MousePointerClick, CheckCircle2 } from "lucide-react";

type AllocationMatrix = {
    platform: string;
    budgetPercentage: number;
    simulatedCPA: number;
    status: "SCALING" | "LEARNING" | "KILLING";
};

type DeploymentData = {
     timestamp: string;
     dailyCapitalDrawn: number;
     matrix: AllocationMatrix[];
     projections: {
         impressions: number;
         clicks: number;
         leadsV1: number;
         blendedCPA: number;
     };
};

export default function AdBuyerDashboard() {
  const [budgetInput, setBudgetInput] = useState<string>("500");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployment, setDeployment] = useState<DeploymentData | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const handleDeploy = async () => {
       const limit = parseInt(budgetInput);
       if(isNaN(limit) || limit < 50) return;

       setIsDeploying(true);
       setDeployment(null);
       setLogs(["[APEX] Awaiting Strategic Directive..."]);

       setTimeout(() => setLogs(prev => [...prev, "[TREASURY] Capital approved for deployment."]), 600);
       setTimeout(() => setLogs(prev => [...prev, "[AD-BUYER] Calculating optimal distribution matrix..."]), 1400);

       try {
            const res = await fetch("/api/swarm/apex/ad-buyer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    directive: { strategy: "High-Ticket VSL Funnel", targetCPA: limit * 0.2 },
                    dailyBudget: limit
                })
            });

            const result = await res.json();
            
            if(result.success) {
                setTimeout(() => {
                     setLogs(prev => [...prev, `[SUCCESS] Simulated algorithmic deployment across ${result.data.matrix.length} platforms.`]);
                     setDeployment(result.data);
                     setIsDeploying(false);
                }, 2200);
            } else {
                 setLogs(prev => [...prev, "[FATAL] Allocation matrix collapsed."]);
                 setIsDeploying(false);
            }
       } catch (err) {
            setLogs(prev => [...prev, "[FATAL] Connection to God-Brain severed."]);
            setIsDeploying(false);
       }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif mb-2 tracking-wide flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-electric" />
          APEX AD-BUYER
        </h1>
        <p className="text-text-secondary">UMBRA's autonomous capital allocation matrix. Simulates algorithmic media buying driven by the God-Brain.</p>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Control Panel (Left Column) */}
           <div className="lg:col-span-1 space-y-6">
               <div className="glass-card p-6 border border-glass-border relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric to-transparent" />
                   <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                       <Target className="w-5 h-5 text-electric" /> Capital Deployment
                   </h2>
                   
                   <p className="text-xs text-text-secondary mb-4">Set the daily budget allocation ceiling. The Apex Node will mathematically divide this across highest-probability traffic engines.</p>

                   <div className="space-y-4">
                       <div>
                           <label className="text-xs text-stone-400 font-mono mb-1 block uppercase">Daily Budget Limit ($)</label>
                           <input 
                               type="number" 
                               value={budgetInput}
                               onChange={(e) => setBudgetInput(e.target.value)}
                               className="w-full bg-onyx border border-glass-border rounded-lg p-3 text-white focus:border-electric focus:ring-0 transition-colors font-mono"
                               min="50"
                           />
                       </div>

                       <button 
                           onClick={handleDeploy}
                           disabled={isDeploying || !budgetInput}
                           className="w-full bg-electric hover:bg-electric-hover text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                       >
                           {isDeploying ? (
                               <><Activity className="w-4 h-4 animate-spin" /> Simulating Deployment</>
                           ) : (
                               <><Zap className="w-4 h-4" /> Execute Ad Buy</>
                           )}
                       </button>
                   </div>
               </div>

               {/* Live Readout Log */}
               <div className="glass-card p-4 border border-glass-border h-48 overflow-y-auto font-mono text-xs bg-black/50">
                   {logs.length === 0 && <span className="text-stone-600">Awaiting capital deployment commands...</span>}
                   {logs.map((log, index) => (
                        <div key={index} className="mb-2 text-stone-300">
                             <span className="text-emerald-500 mr-2">{`[${new Date().toLocaleTimeString()}]`}</span>
                             {log}
                        </div>
                   ))}
               </div>
           </div>

           {/* Metrics & Matrices (Right Column) */}
           <div className="lg:col-span-2 space-y-6">
                {!deployment && !isDeploying && (
                     <div className="glass-card p-12 border border-glass-border h-full flex flex-col items-center justify-center text-center text-text-secondary border-dashed">
                           <BarChart3 className="w-12 h-12 mb-4 text-stone-600" />
                           <h3 className="text-lg font-mono mb-2">Matrix Standby Mode</h3>
                           <p className="max-w-xs text-sm">Deploy capital via the control panel to generate an algorithmic buying matrix.</p>
                     </div>
                )}

                {isDeploying && !deployment && (
                     <div className="glass-card p-12 border border-blue-500/20 h-full flex flex-col items-center justify-center text-center">
                           <Activity className="w-12 h-12 mb-4 text-electric animate-spin duration-1000" />
                           <h3 className="text-lg font-mono mb-2 text-electric animate-pulse">Calculating Algorithmic Weights</h3>
                           <p className="max-w-xs text-sm text-stone-400">Interrogating Treasury limits and Apex campaign vectors...</p>
                     </div>
                )}

                {deployment && (
                     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                         {/* Top Level Projections */}
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <div className="glass-card p-4 border border-glass-border flex flex-col justify-between">
                                  <span className="text-xs text-stone-400 uppercase tracking-widest block mb-1">Sim. Impr.</span>
                                  <span className="text-xl font-mono text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-electric" /> {deployment.projections.impressions.toLocaleString()}</span>
                             </div>
                             <div className="glass-card p-4 border border-glass-border flex flex-col justify-between">
                                  <span className="text-xs text-stone-400 uppercase tracking-widest block mb-1">Sim. Clicks</span>
                                  <span className="text-xl font-mono text-white flex items-center gap-2"><MousePointerClick className="w-4 h-4 text-blue-400" /> {deployment.projections.clicks.toLocaleString()}</span>
                             </div>
                             <div className="glass-card p-4 border border-glass-border flex flex-col justify-between">
                                  <span className="text-xs text-stone-400 uppercase tracking-widest block mb-1">Proj. Leads</span>
                                  <span className="text-xl font-mono text-white flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {deployment.projections.leadsV1.toLocaleString()}</span>
                             </div>
                             <div className="glass-card p-4 border border-glass-border bg-electric/10 flex flex-col justify-between">
                                  <span className="text-xs text-electric uppercase tracking-widest block mb-1 font-bold">Vector CPA</span>
                                  <span className="text-2xl font-mono text-white">${deployment.projections.blendedCPA.toFixed(2)}</span>
                             </div>
                         </div>

                         {/* Distribution Matrix */}
                         <div className="glass-card p-6 border border-glass-border">
                             <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> Capital Distribution Matrix
                             </h3>

                             <div className="space-y-5">
                                 {deployment.matrix.map((net, i) => (
                                      <div key={i}>
                                            <div className="flex justify-between items-end mb-2">
                                                <div className="flex items-center gap-2">
                                                     <span className="font-mono text-white font-bold">{net.platform}</span>
                                                     {net.status === "SCALING" && <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1"><Flame className="w-3 h-3" /> Scaling</span>}
                                                     {net.status === "LEARNING" && <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Learning Phase</span>}
                                                     {net.status === "KILLING" && <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Algorithmic Kill</span>}
                                                </div>
                                                <div className="text-right">
                                                     <span className="text-xs text-stone-400 mr-3">Est. CPA: <span className="text-white">${net.simulatedCPA.toFixed(2)}</span></span>
                                                     <span className="font-mono text-electric">{net.budgetPercentage}%</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-onyx h-2 rounded-full overflow-hidden">
                                                 <motion.div 
                                                     initial={{ width: 0 }} 
                                                     animate={{ width: `${net.budgetPercentage}%` }} 
                                                     transition={{ duration: 1, delay: i * 0.1 }}
                                                     className={`h-full ${net.status === 'KILLING' ? 'bg-red-500/50' : net.status === 'SCALING' ? 'bg-emerald-500' : 'bg-electric'}`} 
                                                 />
                                            </div>
                                      </div>
                                 ))}
                             </div>
                         </div>
                     </motion.div>
                )}
           </div>

       </div>
    </div>
  );
}
