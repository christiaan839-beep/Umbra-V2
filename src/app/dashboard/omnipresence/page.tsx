"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Twitter, Linkedin, MessageSquare, Flame, CheckCircle2, RotateCw } from "lucide-react";

export default function GhostFleetPage() {
  const [status, setStatus] = useState("idle");

  const executeFleet = () => {
    setStatus("compiling");
    setTimeout(() => setStatus("active"), 3000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 min-h-screen">
      <div className="mb-10 text-center">
         <div className="inline-flex items-center justify-center gap-2 px-3 py-1 border border-pink-500/30 bg-pink-500/10 rounded-full text-[10px] text-pink-400 font-bold uppercase tracking-widest mx-auto mb-4">
            <Flame className="w-3 h-3" /> The "Ghost Fleet" Engine Active
         </div>
         <h1 className="text-4xl font-bold text-white font-serif tracking-tight mb-4">Omnipresence Cartel</h1>
         <p className="text-sm text-neutral-400 max-w-2xl mx-auto">
           Drop a single YouTube link or core thesis. The Ghost Fleet will autonomously fracture it into 90 pieces of highly-optimized, format-native content and schedule it across the internet for 30 days.
         </p>
      </div>

      <div className="max-w-3xl mx-auto bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
         
         <div className="space-y-6">
           <div>
             <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2 block">
               Core Directive (URL or Topic)
             </label>
             <input 
               type="text"
               placeholder="https://youtube.com/watch?v=... or 'The death of traditional agencies'"
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:border-pink-500/50 transition-colors"
             />
           </div>

           <div className="grid grid-cols-3 gap-4">
             <div className="bg-white/5 border border-[#1DA1F2]/30 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
               <Twitter className="w-6 h-6 text-[#1DA1F2]" />
               <span className="text-[10px] font-bold text-white uppercase">30 Threads</span>
             </div>
             <div className="bg-white/5 border border-[#0A66C2]/30 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
               <Linkedin className="w-6 h-6 text-[#0A66C2]" />
               <span className="text-[10px] font-bold text-white uppercase">15 Essays</span>
             </div>
             <div className="bg-white/5 border border-purple-500/30 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
               <MessageSquare className="w-6 h-6 text-purple-400" />
               <span className="text-[10px] font-bold text-white uppercase">45 Short Scripts</span>
             </div>
           </div>

           <button 
             onClick={executeFleet}
             disabled={status !== "idle"}
             className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-colors hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {status === "idle" && <><Globe className="w-5 h-5" /> Deploy Ghost Fleet</>}
             {status === "compiling" && <><RotateCw className="w-5 h-5 animate-spin" /> Splicing Logic...</>}
             {status === "active" && <><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Nodes Scheduled</>}
           </button>
         </div>
      </div>
    </div>
  );
}
