"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Search, ArrowRight, ShieldAlert, Cpu, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function InteractiveHeroStrike() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();

  const handleStrike = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsScanning(true);
    // Fake scan for dramatic effect, then push to the War Room
    setTimeout(() => {
      router.push("/dashboard/war-room");
    }, 2500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
      {/* The Target Input */}
      <form onSubmit={handleStrike} className="w-full relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#10B981]/20 via-indigo-500/20 to-emerald-600/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />
        <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-2 shadow-2xl">
          <div className="pl-6 pr-4 hidden sm:flex items-center justify-center border-r border-white/10">
            <Target className="w-6 h-6 text-neutral-500 group-hover:text-[#10B981] transition-colors" />
          </div>
          <input
            type="url"
            placeholder="Enter competitor's URL... (e.g. https://uber.com)"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isScanning}
            className="flex-1 bg-transparent text-white px-6 py-4 outline-none placeholder:text-neutral-600 font-mono text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isScanning || !url}
            className="px-8 py-4 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? (
               <><Cpu className="w-4 h-4 animate-spin text-[#10B981]" /> Initializing...</>
            ) : (
               <>Strike <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </form>

      {/* Scanning Overlay State */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full p-4 rounded-2xl bg-[#10B981]/5 border border-[#10B981]/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
               <ShieldAlert className="w-5 h-5 text-[#10B981] animate-pulse" />
               <span className="text-xs font-mono text-[#10B981] uppercase tracking-widest">NVIDIA NIM Interception Protocol</span>
            </div>
            <span className="text-[10px] font-bold text-white font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" /> Scouring Vectors...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Bar */}
      <div className="flex items-center gap-6 mt-4 opacity-50">
         <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-white flex items-center gap-2">
           <Search className="w-3 h-3" /> OSINT Reconnaissance
         </span>
         <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-white flex items-center gap-2">
           <Sparkles className="w-3 h-3" /> Live War Room Debate
         </span>
      </div>
    </div>
  );
} 
