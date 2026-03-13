"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Server, Database, BrainCircuit, Scan, ShieldCheck } from 'lucide-react';

const BOOT_SEQUENCE = [
  { text: "Validating Stripe Transaction Payload...", delay: 800, icon: ShieldCheck, color: "text-emerald-400" },
  { text: "Payment verified. Allocating $5,000/mo retainer limits.", delay: 1500, icon: CheckCircle2, color: "text-emerald-400" },
  { text: "Initializing Dedicated Sovereign Node: [Apex Alpha]", delay: 2800, icon: Server, color: "text-indigo-400" },
  { text: "Mounting Multimodal Vector Lake...", delay: 4200, icon: Database, color: "text-violet-400" },
  { text: "Connecting to UMBRA God-Brain Core API...", delay: 5800, icon: BrainCircuit, color: "text-rose-400" },
  { text: "Injecting Base Prompts & Competitor Signatures...", delay: 7200, icon: Scan, color: "text-amber-400" },
  { text: "AGI Worker Online. Routing to Command Center.", delay: 8500, icon: CheckCircle2, color: "text-emerald-500" }
];

export default function CheckoutSuccessBoot() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];

    // Trigger each step exactly at its 'delay' time
    BOOT_SEQUENCE.forEach((step, index) => {
      const id = setTimeout(() => {
        setActiveStep(index);
        
        // Final transition to dashboard
        if (index === BOOT_SEQUENCE.length - 1) {
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }
      }, step.delay);
      timeoutIds.push(id);
    });

    return () => timeoutIds.forEach(clearTimeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1 }}
           className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-neutral-800 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
         >
            <div className="flex items-center justify-center mb-12">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                 className="w-16 h-16 rounded-lg border border-indigo-500/30 flex items-center justify-center bg-indigo-500/10 box-shadow-[0_0_30px_rgba(99,102,241,0.2)]"
               >
                 <BrainCircuit className="w-8 h-8 text-indigo-400" />
               </motion.div>
            </div>

            <h1 className="text-2xl font-light text-center text-white mb-2 tracking-tight">Provisioning Artificial Employee</h1>
            <p className="text-center text-neutral-500 text-sm mb-12 font-mono tracking-wider">DO NOT CLOSE THIS WINDOW</p>

            <div className="space-y-4 font-mono text-xs">
              <AnimatePresence>
                {BOOT_SEQUENCE.slice(0, activeStep + 1).map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 bg-black/40 border border-neutral-800/50 p-3 rounded-lg"
                    >
                      <Icon className={`w-4 h-4 ${step.color} ${index === activeStep && index !== BOOT_SEQUENCE.length - 1 ? 'animate-pulse' : ''}`} />
                      <span className={index === activeStep ? 'text-white font-medium' : 'text-neutral-500'}>
                        {step.text}
                      </span>
                      {index === activeStep && index !== BOOT_SEQUENCE.length - 1 && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="mt-12 h-1 bg-neutral-900 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: "0%" }}
                 animate={{ width: `${((activeStep + 1) / BOOT_SEQUENCE.length) * 100}%` }}
                 transition={{ duration: 0.5 }}
                 className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
               />
            </div>
         </motion.div>
      </div>
    </div>
  );
}
