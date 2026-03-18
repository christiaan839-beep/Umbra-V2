"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Swords, Target, Crosshair, Radar, AlertTriangle, Terminal, Zap } from "lucide-react";

export default function CompetitorAssassination() {
  const [target, setTarget] = useState("");
  const [scanning, setScanning] = useState(false);
  const [intel, setIntel] = useState<any>(null);

  const initiateTacticalScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    setScanning(true);
    
    // Simulate the extreme API Call to NemoClaw/Gemini 1.5 Pro
    setTimeout(() => {
      setIntel({
         domain: target,
         threatLevel: "HIGH",
         vulnerabilities: [
           "Their pricing structure is hidden behind 'Contact Sales'. Massive friction.",
           "Their Facebook Ads Library shows they are overspending on broad B2B search terms.",
           "TrustPilot reviews indicate their customer support takes 48hrs+ to reply."
         ],
         counterStrikes: [
           "Ghost Fleet Protocol: Auto-DM their Twitter followers with a 'We reply in 5 mins' value prop.",
           "Page Builder: Generate a landing page titled 'The Transparent Alternative to " + target + "'.",
           "NemoClaw Scraping: Extract their exact LinkedIn followers and send personalized Twilio sequences."
         ]
      });
      setScanning(false);
    }, 4500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 lg:p-8">
      
      {/* 🔴 TACTICAL ELITE HEADER */}
      <header className="border-b border-rose-500/20 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <Swords className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Cartel Target Lock</h1>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest mt-1">Competitor Assassination Matrix</p>
          </div>
        </div>
      </header>

      {/* 🔴 TARGET ACQUISITION FORM */}
      <div className="bg-black/60 backdrop-blur-3xl border border-rose-500/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(244,63,94,0.05)]">
         <h2 className="text-xl font-bold font-serif mb-6 flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-rose-500" /> Establish Target Vector
         </h2>
         <form onSubmit={initiateTacticalScan} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
               <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500/50" />
               <input 
                 type="text"
                 placeholder="e.g., legacy-agency.com"
                 value={target}
                 onChange={(e) => setTarget(e.target.value)}
                 className="w-full bg-rose-500/5 border border-rose-500/20 rounded-xl py-4 pl-12 pr-4 text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-rose-500/50 transition-colors"
               />
            </div>
            <button 
              type="submit" 
              disabled={!target || scanning}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {scanning ? (
                 <><Radar className="w-4 h-4 animate-spin" /> Syping Target...</>
              ) : (
                 <><Target className="w-4 h-4" /> Initiate Scan</>
              )}
            </button>
         </form>
      </div>

      {/* 🔴 ACTIVE INTEL RENDER */}
      {scanning && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 border border-rose-500/20 bg-black/40 rounded-3xl">
           <Radar className="w-12 h-12 text-rose-500 animate-spin mx-auto mb-6 opacity-80" />
           <h3 className="text-xl font-bold font-serif text-white mb-2">Extracting Enemy Telemetry</h3>
           <p className="text-neutral-500 text-sm font-mono">Bypassing physical firewalls... Downloading Ad Libraries... Analyzing Customer Churn...</p>
        </motion.div>
      )}

      {intel && !scanning && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-6">
           {/* Structural Weaknesses */}
           <div className="bg-black/60 border border-amber-500/20 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-8">
                 <AlertTriangle className="w-6 h-6 text-amber-500" />
                 <h2 className="text-xl font-bold font-serif text-white">Identified Vulnerabilities</h2>
              </div>
              <ul className="space-y-4">
                 {intel.vulnerabilities.map((vuln: string, i: number) => (
                    <li key={i} className="flex gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                       <span className="text-amber-500 font-mono font-bold">0{i+1}</span>
                       <p className="text-sm text-neutral-300">{vuln}</p>
                    </li>
                 ))}
              </ul>
           </div>

           {/* Autonomous Counter-Strikes */}
           <div className="bg-black/60 border border-emerald-500/20 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-8">
                 <Zap className="w-6 h-6 text-emerald-500" />
                 <h2 className="text-xl font-bold font-serif text-white">Offensive Blueprints</h2>
              </div>
              <ul className="space-y-4">
                 {intel.counterStrikes.map((strike: string, i: number) => (
                    <li key={i} className="flex gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                       <span className="text-emerald-500 font-mono font-bold">0{i+1}</span>
                       <p className="text-sm text-neutral-300">{strike}</p>
                    </li>
                 ))}
              </ul>
           </div>
        </motion.div>
      )}
    </div>
  );
}
