"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Crosshair, Zap, DollarSign, ArrowRight, Lock, Activity, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

type ScanStage = 'IDLE' | 'RESOLVING' | 'ANALYZING_PIXELS' | 'FRICTION_MAPPING' | 'CALCULATING_LOSS' | 'COMPLETE';

export default function AGIAuditorPage() {
  const [targetUrl, setTargetUrl] = useState('');
  const [stage, setStage] = useState<ScanStage>('IDLE');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (stage === 'IDLE' || stage === 'COMPLETE') return;

    let interval: NodeJS.Timeout;
    const currentProgress = progress;

    if (stage === 'RESOLVING') {
      if (currentProgress < 25) {
        interval = setTimeout(() => setProgress(p => p + 1), 60);
      } else {
        setStage('ANALYZING_PIXELS');
        setLogs(prev => [...prev, `[TARGET LOCKED] ${targetUrl}`, 'Initiating payload: Meta Pixel Extraction...']);
      }
    } else if (stage === 'ANALYZING_PIXELS') {
      if (currentProgress < 50) {
        interval = setTimeout(() => setProgress(p => p + 1), 70);
      } else {
        setStage('FRICTION_MAPPING');
        setLogs(prev => [...prev, 'Pixels Extracted. 4 critical drop-offs detected.', 'Mapping funnel surface area...']);
      }
    } else if (stage === 'FRICTION_MAPPING') {
      if (currentProgress < 85) {
        interval = setTimeout(() => setProgress(p => p + 1), 50);
      } else {
        setStage('CALCULATING_LOSS');
        setLogs(prev => [...prev, 'Friction mapped: 72% conversion leakage.', 'Calculating exact lost capital velocity...']);
      }
    } else if (stage === 'CALCULATING_LOSS') {
      if (currentProgress < 100) {
        interval = setTimeout(() => setProgress(p => p + 1), 40);
      } else {
        setStage('COMPLETE');
        setLogs(prev => [...prev, 'CALCULATION COMPLETE. Generating final threat report...']);
      }
    }

    return () => clearTimeout(interval);
  }, [stage, progress, targetUrl]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.includes('.')) return;
    setStage('RESOLVING');
    setProgress(0);
    setLogs(['Initializing Neural Strike Protocol...']);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans selection:bg-[#00B7FF]/30 overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#00B7FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-pink-500/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-screen">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#00B7FF]/30 bg-[#00B7FF]/10 backdrop-blur-md mb-8 shadow-[0_0_30px_rgba(0,183,255,0.2)]">
             <ShieldAlert className="w-4 h-4 text-[#00B7FF]" />
             <span className="text-xs tracking-[0.2em] text-[#00B7FF] font-medium uppercase">Lethal Infrastructure Audit</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 leading-tight">
            How Much Capital Is <br />
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">Your Funnel Leaking?</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            UMBRA AGI will rip apart your frontend architecture, map your friction points, and calculate the exact monthly MRR you are losing to outdated human systems.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {stage === 'IDLE' && (
            <motion.form 
              key="input-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
              onSubmit={handleScan}
              className="w-full max-w-2xl relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00B7FF] to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative flex items-center bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="pl-6 h-full flex items-center">
                  <Crosshair className="w-6 h-6 text-neutral-500" />
                </div>
                <input 
                  type="text" 
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://your-company.com"
                  spellCheck={false}
                  className="w-full bg-transparent text-xl md:text-2xl px-6 py-6 outline-none placeholder-neutral-600 font-light"
                />
                <button 
                  type="submit"
                  disabled={!targetUrl}
                  className="mr-2 my-2 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-[#00B7FF] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  INITIATE
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.form>
          )}

          {stage !== 'IDLE' && stage !== 'COMPLETE' && (
            <motion.div 
              key="scan-stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-3xl"
            >
              <div className="bg-[#0A0A0A] border border-[#00B7FF]/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,183,255,0.1)]">
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-1 bg-[#00B7FF] shadow-[0_0_20px_#00B7FF] opacity-50 z-20"
                />

                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <Activity className="w-6 h-6 text-[#00B7FF] animate-pulse" />
                    <h2 className="text-2xl font-light tracking-wide">AGI Swarm Analyzing target...</h2>
                  </div>
                  <span className="text-2xl font-mono text-[#00B7FF]">{progress}%</span>
                </div>

                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-8">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#00B7FF] to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>

                <div className="bg-black/50 border border-white/5 rounded-xl p-6 font-mono text-sm text-neutral-400 h-64 overflow-y-auto w-full relative">
                  <div className="space-y-4">
                    {logs.map((log, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i} 
                        className="flex gap-3"
                      >
                        <span className="text-[#00B7FF]">{'>'}</span>
                        <span className="text-neutral-300 leading-relaxed">{log}</span>
                      </motion.div>
                    ))}
                    <motion.div 
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="w-2 h-4 bg-[#00B7FF] inline-block ml-4"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'COMPLETE' && (
            <motion.div 
              key="complete-stage"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-4xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-[#1A0505] border border-red-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="text-xs tracking-widest text-red-500 uppercase font-bold">Threat Level</span>
                  </div>
                  <div className="text-3xl font-light text-white mb-2">CRITICAL</div>
                  <div className="text-sm text-red-400/80">Funnel architecture is outdated. 72% leakage detected.</div>
                </div>

                <div className="bg-[#051114] border border-[#00B7FF]/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,183,255,0.1)]">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-5 h-5 text-[#00B7FF]" />
                    <span className="text-xs tracking-widest text-[#00B7FF] uppercase font-bold">Lost Capital</span>
                  </div>
                  <div className="text-3xl font-mono text-white mb-2">$34,200<span className="text-xl text-neutral-500">/mo</span></div>
                  <div className="text-sm text-[#00B7FF]/80">Estimated value bleeding to competitors via inefficient routing.</div>
                </div>

                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="text-xs tracking-widest text-yellow-500 uppercase font-bold">AGI Readiness</span>
                  </div>
                  <div className="text-3xl font-mono text-white mb-2">12%</div>
                  <div className="text-sm text-neutral-400">Zero autonomous infrastructure. High reliance on human labor.</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                
                <div className="relative z-10 max-w-2xl mx-auto">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                     <Lock className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-3xl md:text-5xl font-light mb-6 leading-tight">Your infrastructure is <span className="text-red-500 font-medium">bleeding capital.</span></h3>
                  <p className="text-neutral-400 mb-10 text-lg">
                    UMBRA is an autonomous Swarm engineered to permanently seal funnel leakage, deploy hyper-targeted capital, and execute revenue operations without human drag. Let the AGI take control.
                  </p>
                  
                  <Link href="/checkout">
                    <button className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                      <span className="relative z-10 font-bold tracking-wide uppercase text-sm">Initiate Rescue Protocol (Deploy UMBRA)</span>
                      <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-[#00B7FF] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 bg-gradient-to-r from-pink-500 to-[#00B7FF]" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
