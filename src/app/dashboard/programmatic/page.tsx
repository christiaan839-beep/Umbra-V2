"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, Database, FileText, ChevronRight, Activity, Zap } from 'lucide-react';

export default function ProgrammaticEngine() {
  const [scraping, setScraping] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [posts, setPosts] = useState([
    { keyword: "how to build ai agency 2026", volume: "14.2k", difficulty: "Medium", status: "Indexed" },
    { keyword: "best smma outreach tool", volume: "8.1k", difficulty: "Low", status: "Indexed" },
    { keyword: "gohighlevel vs umbra", volume: "5.4k", difficulty: "Low", status: "Generating" },
  ]);

  const initiateSwarm = async () => {
    setScraping(true);
    setLogs(["[SYSTEM] Initiating Programmatic SEO Swarm..."]);
    
    // Simulate API call
    setTimeout(() => {
      setLogs(prev => [...prev, "[TAVILY] Scraping Google search console data..."]);
      setTimeout(() => {
         setLogs(prev => [...prev, "[GEMINI] Extracting semantic gaps from top 10 SERPs..."]);
         setTimeout(() => {
            setLogs(prev => [...prev, "[GEMINI] Drafting 2,400 word authoritative post..."]);
            setTimeout(() => {
               setLogs(prev => [...prev, "[NODE] Injected JSON-LD schema markup."]);
               setLogs(prev => [...prev, "[DEPLOY] Pushed to /blog/autonomous-lead-gen"]);
               setPosts([
                 { keyword: "autonomous lead generation agent", volume: "11.2k", difficulty: "Medium", status: "Just Deployed" },
                 ...posts
               ]);
               setScraping(false);
            }, 1500);
         }, 1500);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050505] p-8 md:p-12 font-sans text-neutral-200">
      
      {/* Header */}
      <div className="mb-12 border-b border-neutral-800/50 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-sm border border-fuchsia-500/30 flex items-center justify-center bg-fuchsia-500/10"
          >
            <Globe className="w-4 h-4 text-fuchsia-400" />
          </motion.div>
          <h1 className="text-3xl font-light tracking-tight text-white">Programmatic SEO Swarm</h1>
        </div>
        <p className="text-neutral-500 max-w-2xl tracking-wide">
          Autonomous authority engine. Scrapes high-intent search volumes via Tavily, synthesizes 2K+ word schema-optimized posts via Gemini, and deploys directly to `/blog`.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Engine Command */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-6 backdrop-blur-md">
            <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
              <Search className="w-4 h-4 text-fuchsia-400" />
              Target Acquisition
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider">Broad Niche Sector</label>
                <input 
                  type="text" 
                  defaultValue="Automated Marketing AI" 
                  className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-fuchsia-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider">Difficulty Threshold</label>
                <select className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-fuchsia-500/50 transition-colors appearance-none">
                  <option>Low - Medium (Long Tail)</option>
                  <option>Hard (Fat Head)</option>
                  <option>All Volumes</option>
                </select>
              </div>

              <div className="pt-4">
                <button 
                  onClick={initiateSwarm}
                  disabled={scraping}
                  className={`w-full py-4 flex items-center justify-center gap-2 text-sm font-medium tracking-wide rounded hover:bg-white hover:text-black transition-all ${
                    scraping 
                      ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 cursor-wait" 
                      : "bg-neutral-800 text-white border border-neutral-700"
                  }`}
                >
                  {scraping ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                         <Activity className="w-4 h-4" />
                      </motion.div>
                      Swarm Active
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Ignite Synthesis
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="bg-black border border-neutral-800/80 rounded-xl p-4 font-mono text-xs text-neutral-400 h-64 overflow-y-auto shadow-inner relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500/20 to-transparent"></div>
            {logs.length === 0 ? (
               <p className="opacity-50">Awaiting swarm initiation...</p>
            ) : (
               logs.map((log, i) => (
                 <div key={i} className="mb-2 flex items-start gap-2">
                   <span className="text-fuchsia-500">&gt;</span>
                   <span className={log.includes('DEPLOY') ? 'text-emerald-400 font-bold' : ''}>{log}</span>
                 </div>
               ))
            )}
          </div>
        </div>

        {/* Right: Content Ledger */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-8 backdrop-blur-md h-full">
             <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-8 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Deployed SEO Trap Network
            </h3>

            <div className="space-y-3">
               {posts.map((post, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className={`flex items-center justify-between p-4 rounded-lg border ${
                     post.status === 'Just Deployed' ? 'bg-fuchsia-500/10 border-fuchsia-500/30' : 
                     post.status === 'Generating' ? 'bg-neutral-800/50 border-neutral-700/50 animate-pulse' :
                     'bg-neutral-900/80 border-neutral-800'
                   }`}
                 >
                   <div className="flex items-center gap-4">
                     <FileText className={`w-5 h-5 ${
                       post.status === 'Indexed' ? 'text-indigo-400' : 'text-fuchsia-400'
                     }`} />
                     <div>
                       <p className="text-white font-medium">{post.keyword}</p>
                       <div className="flex gap-3 text-xs text-neutral-500 mt-1">
                         <span>Vol: {post.volume}</span>
                         <span>•</span>
                         <span>Diff: {post.difficulty}</span>
                       </div>
                     </div>
                   </div>

                   <div className="flex items-center gap-4">
                     <span className={`text-xs px-2 py-1 rounded-full border ${
                        post.status === 'Indexed' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                        post.status === 'Generating' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                        'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400'
                     }`}>
                       {post.status}
                     </span>
                     <button className="p-2 bg-neutral-800 rounded hover:bg-neutral-700 transition">
                       <ChevronRight className="w-4 h-4 text-neutral-400" />
                     </button>
                   </div>
                 </motion.div>
               ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
