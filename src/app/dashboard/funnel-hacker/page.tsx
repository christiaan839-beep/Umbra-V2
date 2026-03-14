"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Zap, Code, ShieldAlert, FileSearch, Sparkles, Box, LayoutTemplate } from 'lucide-react';

export default function FunnelHijacker() {
  const [url, setUrl] = useState('');
  const [scanState, setScanState] = useState<'IDLE' | 'SCANNING' | 'ANALYZED' | 'SYNTHESIZING' | 'COMPLETE'>('IDLE');

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || scanState !== 'IDLE') return;

    setScanState('SCANNING');
    
    // Simulate X-Ray Extraction
    setTimeout(() => {
      setScanState('ANALYZED');
    }, 3000);
  };

  const synthesizeSuperior = () => {
    setScanState('SYNTHESIZING');
    setTimeout(() => {
      setScanState('COMPLETE');
    }, 3500);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 relative z-10">
      
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
           <h1 className="text-3xl font-light text-white tracking-widest font-mono flex items-center gap-3">
             <Scan className="w-8 h-8 text-rose-500" />
             MULTIMODAL FUNNEL HIJACKER
           </h1>
           <p className="text-[#8A95A5] uppercase tracking-[0.2em] text-xs mt-2 font-bold flex items-center gap-2">
             <Sparkles className="w-3 h-3 text-electric" /> Powered by Gemini Multimodal 2.0
           </p>
        </div>
      </div>

      {/* Target Input */}
      <div className="bg-black/40 backdrop-blur-2xl border border-rose-500/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.05)]">
        <form onSubmit={handleScan} className="flex gap-4">
          <div className="relative flex-1">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500/50 font-mono">TARGET:</div>
             <input
               type="url"
               required
               value={url}
               onChange={(e) => setUrl(e.target.value)}
               placeholder="https://competitor.com/landing-page"
               disabled={scanState !== 'IDLE'}
               className="w-full bg-[#0B0C10] border border-rose-500/30 rounded-xl py-4 pl-24 pr-4 text-white font-mono text-sm focus:outline-none focus:border-rose-500 focus:shadow-[0_0_20px_rgba(244,63,94,0.2)] transition-all placeholder:text-neutral-600 disabled:opacity-50"
             />
          </div>
          <button
            type="submit"
            disabled={!url || scanState !== 'IDLE'}
            className="px-8 bg-rose-500/10 text-rose-500 border border-rose-500/30 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-rose-500/20 transition-all focus:outline-none disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
          >
            {scanState === 'SCANNING' ? <Scan className="w-4 h-4 animate-spin" /> : <RadarScan />} X-RAY DOMAIN
          </button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {scanState === 'SCANNING' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-black/60 rounded-2xl border border-glass-border p-12 flex flex-col items-center justify-center overflow-hidden relative">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
             
             {/* X-Ray Scanner Effect */}
             <div className="w-full max-w-md h-1 bg-rose-500/20 relative overflow-hidden rounded-full mb-8">
               <motion.div 
                 initial={{ x: '-100%' }}
                 animate={{ x: '100%' }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                 className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_20px_#f43f5e]"
               />
             </div>
             
             <Scan className="w-12 h-12 text-rose-500 mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
             <h3 className="text-xl font-mono text-white tracking-widest uppercase text-center mb-2">Ingesting Semantic Layout</h3>
             <p className="text-[#8A95A5] font-mono text-xs text-center">Gemini 2.0 mapping visual hierarchy and copy vectors...</p>
          </motion.div>
        )}

        {(scanState === 'ANALYZED' || scanState === 'SYNTHESIZING' || scanState === 'COMPLETE') && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Extracted Intel */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-[#0B0C10]/80 backdrop-blur-md rounded-2xl border border-rose-500/20 p-6 relative overflow-hidden shadow-[0_0_30px_rgba(244,63,94,0.05)]">
                 <div className="absolute top-0 right-0 p-4 opacity-5 text-rose-500"><FileSearch className="w-24 h-24" /></div>
                 
                 <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-rose-500 mb-6 flex items-center gap-2">
                   <ShieldAlert className="w-4 h-4" /> Extracted Vulnerabilities
                 </h3>
                 
                 <div className="space-y-4">
                   <div className="bg-black/50 border border-glass-border rounded-lg p-4">
                     <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Primary Hook</p>
                     <p className="text-sm font-mono text-white">"Transform your business with AI today."</p>
                     <p className="text-[10px] text-rose-400 mt-2 font-mono">Weak semantic resonance. Low conversion probability.</p>
                   </div>
                   
                   <div className="bg-black/50 border border-glass-border rounded-lg p-4">
                     <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Pricing Model</p>
                     <p className="text-sm font-mono text-white">$99/mo standard tier.</p>
                     <p className="text-[10px] text-amber-400 mt-2 font-mono">Commoditized tiering. Missing high-ticket anchor.</p>
                   </div>

                   <div className="bg-black/50 border border-glass-border rounded-lg p-4">
                     <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Layout Architecture</p>
                     <p className="text-sm font-mono text-white">Linear Z-pattern flow.</p>
                     <p className="text-[10px] text-emerald-400 mt-2 font-mono">Easily disrupted by immersive spatial layout.</p>
                   </div>
                 </div>

                 {scanState === 'ANALYZED' && (
                   <button 
                     onClick={synthesizeSuperior}
                     className="mt-6 w-full py-4 bg-electric/10 text-electric border border-electric/30 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-electric/20 transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(0,183,255,0.2)]"
                   >
                     <Sparkles className="w-4 h-4" /> Synthesize Superior Variant
                   </button>
                 )}
              </div>
            </div>

            {/* Synthesis Window */}
            <div className="lg:col-span-2">
               {scanState === 'SYNTHESIZING' && (
                 <div className="h-full min-h-[400px] bg-black/60 rounded-2xl border border-electric/20 p-8 flex flex-col items-center justify-center">
                    <Box className="w-16 h-16 text-electric animate-spin-slow mb-6 drop-shadow-[0_0_15px_rgba(0,183,255,0.8)]" />
                    <h3 className="text-xl font-mono text-white tracking-widest uppercase text-center mb-2">Gemini 2.0 Architectural Synthesis</h3>
                    <div className="w-64 h-1 bg-electric/20 rounded-full mt-4 overflow-hidden relative">
                      <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3.5, ease: "easeInOut" }} className="absolute top-0 bottom-0 left-0 bg-electric shadow-[0_0_10px_#00B7FF]" />
                    </div>
                 </div>
               )}

               {scanState === 'COMPLETE' && (
                 <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="h-full bg-[#0a0a0a]/90 backdrop-blur-3xl rounded-2xl border border-emerald-500/30 overflow-hidden flex flex-col shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                   <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-4 flex items-center justify-between">
                     <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-400 flex items-center gap-2">
                       <LayoutTemplate className="w-4 h-4" /> Unbeatable Variant Executed
                     </h3>
                     <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">confidence: 99.4%</span>
                   </div>
                   
                   <div className="p-6 flex-1 space-y-6 overflow-y-auto">
                      
                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2">Superseding Hook</p>
                        <div className="bg-black/50 border border-emerald-500/20 rounded-xl p-5">
                          <h2 className="text-3xl font-light text-white font-mono leading-tight">
                            "Stop Renting Employees.<br/>Own A Sovereign God-Brain."
                          </h2>
                          <div className="mt-4 flex gap-2">
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-widest font-bold">+412% Semantic Power</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/50 border border-glass-border rounded-xl p-5">
                           <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-3">Pricing Architecture</p>
                           <p className="text-xl text-white font-mono">$5,000 / mo</p>
                           <p className="text-xs text-[#8A95A5] mt-1 font-mono">High-ticket anchor bypasses $99/mo commodity friction.</p>
                        </div>
                        <div className="bg-black/50 border border-glass-border rounded-xl p-5">
                           <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-3">UI/UX Paradigm</p>
                           <p className="text-xl text-white font-mono flex items-center gap-2"><Zap className="w-5 h-5 text-emerald-400" /> Spatial WebGL</p>
                           <p className="text-xs text-[#8A95A5] mt-1 font-mono">Crushes standard Z-pattern via immersive 3D induction.</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-glass-border flex gap-4">
                        <button className="flex-1 py-3 bg-emerald-500 text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                          <Code className="w-4 h-4" /> Inject React Next.js Code
                        </button>
                        <button className="flex-1 py-3 bg-[#0B0C10] text-emerald-400 border border-emerald-500/30 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-500/10 transition-all flex justify-center items-center gap-2 gap-2">
                          <Zap className="w-4 h-4" /> Deploy Facebook Ads
                        </button>
                      </div>

                   </div>
                 </motion.div>
               )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function RadarScan() {
  return (
    <div className="relative w-4 h-4">
      <div className="absolute inset-0 rounded-full border border-rose-500/50"></div>
      <div className="absolute inset-2 rounded-full border border-rose-500/80"></div>
      <div className="absolute top-1/2 left-1/2 w-1/2 h-[1px] bg-rose-500 origin-left -translate-y-1/2 animate-spin-fast">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[conic-gradient(from_0deg,rgba(244,63,94,0)_0deg,rgba(244,63,94,0.5)_360deg)] translate-x-1/2 opacity-50 blur-[2px]"></div>
      </div>
    </div>
  )
}
