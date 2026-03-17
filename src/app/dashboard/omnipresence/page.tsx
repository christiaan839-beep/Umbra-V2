"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe2, Youtube, Instagram, CheckCircle2, 
  RefreshCcw, Play, Zap, CalendarClock, TrendingUp, BarChart3
} from "lucide-react";

export default function OmnipresencePage() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [status, setStatus] = useState<"idle" | "deploying" | "success">("idle");

  const handleDeployment = () => {
    setIsDeploying(true);
    setStatus("deploying");
    
    setTimeout(() => {
      setIsDeploying(false);
      setStatus("success");
    }, 4000);
  };

  const POSTS = [
    {
      id: "1",
      title: "How Missing SEO Tags Kill 40% of Lead Flow",
      platform: "YouTube Shorts",
      time: "Scheduled for 14:00 Today",
      hook: "Are you literally burning money? Here is the math...",
      status: "ready"
    },
    {
      id: "2",
      title: "The Ultimate AI Closer Framework",
      platform: "Instagram Reels",
      time: "Scheduled for 16:30 Today",
      hook: "Stop hiring humans for $15k/mo...",
      status: "ready"
    },
    {
      id: "3",
      title: "Local Business Growth Hack (2026)",
      platform: "TikTok",
      time: "Scheduled for 09:00 Tomorrow",
      hook: "I just cloned a $1M funnel using a God-Brain...",
      status: "generating"
    }
  ];

  return (
    <div className="p-8 h-screen flex flex-col overflow-hidden max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
            <Globe2 className="w-3 h-3" /> Global Synchronization
          </div>
          <h1 className="text-3xl font-bold serif-text text-white">Omnipresence</h1>
          <p className="text-sm text-stone-400 mt-2 max-w-2xl">
            Command the UMBRA Video Swarm to generate, schedule, and deploy viral content architectures across YouTube, Instagram, and TikTok simultaneously.
          </p>
        </div>
        
        {/* Network Status Widget */}
        <div className="flex gap-2">
           <div className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             <div className="flex flex-col">
               <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Network Graph</span>
               <span className="text-xs font-mono text-white">3 Nodes Active</span>
             </div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Master Control */}
        <div className="col-span-1 space-y-6">
           <div className="glass-card p-6 border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-rose-500" /> Swarm Command
              </h3>
              
              <div className="space-y-4 mb-8">
                 <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                   <div className="flex items-center gap-3">
                     <Youtube className="w-5 h-5 text-red-500" />
                     <span className="text-xs font-bold text-white">YouTube API</span>
                   </div>
                   <span className="text-[10px] font-mono text-emerald-400">Authenticated</span>
                 </div>
                 <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                   <div className="flex items-center gap-3">
                     <Instagram className="w-5 h-5 text-pink-500" />
                     <span className="text-xs font-bold text-white">Instagram Graph API</span>
                   </div>
                   <span className="text-[10px] font-mono text-emerald-400">Authenticated</span>
                 </div>
              </div>

              <button 
                onClick={handleDeployment}
                disabled={isDeploying || status === "success"}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(225,29,72,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden"
              >
                {status === "idle" && <><Play className="w-4 h-4" /> Deploy Swarm Matrix</>}
                {status === "deploying" && (
                   <>
                     <RefreshCcw className="w-4 h-4 animate-spin" /> 
                     Synchronizing Content Links...
                     <div className="absolute inset-0 bg-white/20 animate-pulse" />
                   </>
                )}
                {status === "success" && <><CheckCircle2 className="w-4 h-4" /> Fleet Deployed Successfully</>}
              </button>
           </div>
           
           <div className="glass-card p-6 border border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">Traffic Projection</h3>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-black font-mono text-white">12,450</span>
                <span className="text-sm text-emerald-400 flex items-center gap-1 mb-1"><TrendingUp className="w-3 h-3" /> +140%</span>
              </div>
              <p className="text-[10px] text-stone-400 font-mono">Estimated reach based on God-Brain hook analysis.</p>
           </div>
        </div>

        {/* Right Col: Operations Queue */}
        <div className="col-span-1 lg:col-span-2 glass-card p-6 border border-white/10">
           <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
             <CalendarClock className="w-4 h-4 text-[#00B7FF]" /> Deployment Queue
           </h3>
           
           <div className="space-y-4">
              {POSTS.map((post) => (
                <div key={post.id} className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-[#00B7FF]/30 transition-colors group relative overflow-hidden">
                   {(status === "deploying" || status === "success") && post.status === "ready" && (
                     <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay z-0" />
                   )}
                   <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div>
                       <div className="flex gap-2 items-center mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#00B7FF] bg-[#00B7FF]/10 px-2 py-0.5 rounded border border-[#00B7FF]/20">
                            {post.platform}
                          </span>
                          {post.status === "generating" && (
                             <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 flex gap-1 items-center">
                               <RefreshCcw className="w-3 h-3 animate-spin" /> Synthesizing Deepfake
                             </span>
                          )}
                       </div>
                       <h4 className="text-sm font-bold text-white transition-colors">{post.title}</h4>
                       <p className="text-[11px] text-stone-400 mt-1 italic leading-snug">Hook: "{post.hook}"</p>
                     </div>
                     <div className="text-left md:text-right shrink-0">
                        <span className="text-[10px] font-mono text-stone-500 block">{post.time}</span>
                        {(status === "success" && post.status === "ready") ? (
                           <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mt-1 block flex items-center justify-start md:justify-end gap-1">
                             <CheckCircle2 className="w-3 h-3" /> Deployed
                           </span>
                        ) : (
                           <button className="text-[10px] uppercase font-bold text-stone-400 hover:text-white mt-2 transition-colors border border-white/10 px-3 py-1 rounded-full cursor-pointer">
                             View Node Data
                           </button>
                        )}
                     </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
