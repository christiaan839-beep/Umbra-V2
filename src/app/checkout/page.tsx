"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, CreditCard, ChevronRight, Zap, ArrowRight, Cpu, CheckCircle } from 'lucide-react';
import Link from 'next/link';

type CheckoutStage = 'FORM' | 'PROCESSING' | 'PROVISIONING' | 'SUCCESS';

export default function CheckoutPage() {
  const [stage, setStage] = useState<CheckoutStage>('FORM');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // Simulate payment processing and provisioning
  useEffect(() => {
    if (stage === 'FORM' || stage === 'SUCCESS') return;

    let interval: NodeJS.Timeout;

    if (stage === 'PROCESSING') {
      const ms = 60;
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
             clearInterval(interval);
             setStage('PROVISIONING');
             setProgress(0);
             setLogs(['Payment Confirmed.', 'Establishing secure V-LAN...', 'Allocating dedicated NVIDIA H100 GPU block...']);
             return 100;
          }
          return p + 2;
        });
      }, ms);
    } 
    else if (stage === 'PROVISIONING') {
      const ms = 80;
      interval = setInterval(() => {
        setProgress(p => {
          const current = p + 1.5;
          if (current >= 100) {
             clearInterval(interval);
             setStage('SUCCESS');
             return 100;
          }
          if (current === 30) setLogs(prev => [...prev, 'Injecting UMBRA core binaries...']);
          if (current === 60) setLogs(prev => [...prev, 'Establishing Sub-Swarm telemetry...']);
          if (current === 90) setLogs(prev => [...prev, 'SYSTEM ONLINE. Preparing Command Dashboard...']);
          
          return current;
        });
      }, ms);
    }

    return () => clearInterval(interval);
  }, [stage]);


  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setStage('PROCESSING');
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#E0E0E0] font-sans selection:bg-emerald-500/30 overflow-hidden relative flex flex-col md:flex-row">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-emerald-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-[#00B7FF]/5 rounded-full blur-[150px]" />
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      {/* Left Pane - The Offer Details */}
      <div className="relative z-10 w-full md:w-5/12 border-b md:border-b-0 md:border-r border-white/5 bg-[#050505]/80 backdrop-blur-xl p-8 md:p-16 flex flex-col justify-center">
        
        <Link href="/" className="inline-flex items-center gap-2 mb-12 hover:opacity-70 transition-opacity">
           <Zap className="w-5 h-5 text-emerald-500" />
           <span className="font-bold tracking-widest uppercase text-sm text-white">UMBRA SYSTEMS</span>
        </Link>
        
        <div className="mb-12">
           <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4 text-white">Sovereign Asset Acquisition</h1>
           <p className="text-neutral-400 font-light leading-relaxed">
             You are initiating the deployment of a dedicated UMBRA AGI Node. This secures your exclusive, containerized automation swarm.
           </p>
        </div>

        <div className="space-y-6 mb-12">
          {/* Line Items */}
          <div className="flex justify-between items-center pb-6 border-b border-white/5">
            <span className="text-neutral-300">UMBRA Dedicated Node (Monthly)</span>
            <span className="font-mono text-white">$5,000</span>
          </div>
          <div className="flex justify-between items-center pb-6 border-b border-white/5">
            <span className="text-neutral-500">Sub-Swarm Orchestration</span>
            <span className="text-emerald-500 text-xs font-bold tracking-wide uppercase">Included</span>
          </div>
          <div className="flex justify-between items-center pb-6 border-b border-white/5">
            <span className="text-neutral-500">API Telemetry Routing</span>
            <span className="text-emerald-500 text-xs font-bold tracking-wide uppercase">Included</span>
          </div>
          
          <div className="flex justify-between items-center pt-6">
            <span className="text-lg text-white font-medium">Total Billed Today</span>
            <span className="text-3xl font-light text-white">$5,000<span className="text-sm text-neutral-500 ml-1">USD</span></span>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
          <p className="text-xs text-emerald-500/80 leading-relaxed font-sans">
             Secure, military-grade transaction environment. Your telemetry and payment data are end-to-end encrypted. Cancel anytime.
          </p>
        </div>
      </div>

      {/* Right Pane - Form / Processing Flow */}
      <div className="relative z-10 w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-transparent min-h-[60vh]">
        <AnimatePresence mode="wait">
          
          {stage === 'FORM' && (
            <motion.div
              key="checkout-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-lg mx-auto"
            >
              <h2 className="text-2xl font-light mb-8 text-white">Secure Authorization</h2>
              
              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Contact Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wide">Command Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="commander@your-agency.com"
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wide">First Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wide">Last Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Secure Card Input Mock */}
                <div className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                     <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">Payment Asset</label>
                     <div className="flex gap-2">
                       <CreditCard className="w-4 h-4 text-neutral-600" />
                       <Lock className="w-4 h-4 text-neutral-600" />
                     </div>
                  </div>
                  
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden focus-within:border-emerald-500/50 transition-colors">
                    <input 
                      type="text" 
                      placeholder="Card number" 
                      required
                      className="w-full bg-transparent px-4 py-4 text-white placeholder-neutral-600 outline-none border-b border-white/5"
                    />
                    <div className="grid grid-cols-2">
                       <input 
                         type="text" 
                         placeholder="MM / YY" 
                         required
                         className="w-full bg-transparent px-4 py-4 text-white placeholder-neutral-600 outline-none border-r border-white/5"
                       />
                       <input 
                         type="text" 
                         placeholder="CVC" 
                         required
                         className="w-full bg-transparent px-4 py-4 text-white placeholder-neutral-600 outline-none"
                       />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-8">
                  <button 
                    type="submit" 
                    className="w-full relative group inline-flex items-center justify-center p-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                       Authorize $5,000 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                  <p className="text-center text-xs text-neutral-600 mt-4 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Processed securely via proprietary encryption.
                  </p>
                </div>

              </form>
            </motion.div>
          )}

          {/* Processing / Provisioning States */}
          {(stage === 'PROCESSING' || stage === 'PROVISIONING') && (
            <motion.div 
              key="processing-stage"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xl mx-auto flex flex-col items-center justify-center space-y-12"
            >
              <div className="relative w-40 h-40 flex items-center justify-center">
                 {/* Outer rotating ring */}
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                   className="absolute inset-0 rounded-full border border-dashed border-emerald-500/30"
                 />
                 {/* Inner pulsing ring */}
                 <div className="absolute inset-4 rounded-full border-2 border-emerald-500/10" />
                 
                 {stage === 'PROCESSING' ? (
                   <Lock className="w-10 h-10 text-emerald-500 animate-pulse" />
                 ) : (
                   <Cpu className="w-10 h-10 text-[#00B7FF] animate-pulse" />
                 )}
              </div>

              <div className="w-full space-y-4">
                 <div className="flex justify-between text-sm uppercase tracking-widest font-bold">
                   <span className={stage === 'PROCESSING' ? 'text-emerald-500' : 'text-[#00B7FF]'}>
                     {stage === 'PROCESSING' ? 'Authorizing Payment' : 'Provisioning Node'}
                   </span>
                   <span className="text-white font-mono">{Math.floor(progress)}%</span>
                 </div>
                 
                 {/* Progress Bar */}
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     className={`h-full ${stage === 'PROCESSING' ? 'bg-emerald-500' : 'bg-[#00B7FF]'}`}
                     style={{ width: `${progress}%` }}
                   />
                 </div>
              </div>

              {/* Terminal Output */}
              <div className="w-full h-48 bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 font-mono text-sm text-neutral-400 overflow-hidden relative shadow-inner">
                 <div className="space-y-3 flex flex-col justify-end h-full">
                    {logs.map((log, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i}
                        className="flex gap-3"
                      >
                        <span className={stage === 'PROCESSING' ? 'text-emerald-500' : 'text-[#00B7FF]'}>{'>'}</span>
                        <span className="text-neutral-300">{log}</span>
                      </motion.div>
                    ))}
                 </div>
                 {/* Fading overlay to keep focus on latest logs */}
                 <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#0A0A0A] to-transparent pointer-events-none" />
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {stage === 'SUCCESS' && (
             <motion.div 
               key="success-stage"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full max-w-lg mx-auto text-center"
             >
               <div className="w-24 h-24 bg-emerald-500/10 rounded-full border border-emerald-500/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                 <CheckCircle className="w-12 h-12 text-emerald-500" />
               </div>
               
               <h2 className="text-3xl md:text-5xl font-light text-white mb-6">Asset Secured.</h2>
               <p className="text-neutral-400 font-light leading-relaxed mb-12">
                 Your $5,000 transaction was successful. We have provisioned your dedicated UMBRA namespace. The Swarm is now awaiting your command.
               </p>

               <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 mb-10 text-left">
                  <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4 font-bold">Node Credentials</p>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Node ID:</span>
                      <span className="text-[#00B7FF]">UMB-NX-77492</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Status:</span>
                      <span className="text-emerald-500">ONLINE</span>
                    </div>
                  </div>
               </div>

               <Link href="/dashboard">
                 <button className="relative group inline-flex items-center justify-center px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                   <span className="relative z-10 flex items-center gap-3">
                     Enter The Command Center <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 </button>
               </Link>
             </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
