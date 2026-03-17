"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, ChevronRight, Zap, ArrowRight, Cpu, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type CheckoutStage = 'FORM' | 'PROCESSING' | 'PAYMENT' | 'PROVISIONING' | 'SUCCESS';

export default function CheckoutPage() {
  const [stage, setStage] = useState<CheckoutStage>('FORM');
  const [progress, setProgress] = useState(0);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Simulate initial processing
  useEffect(() => {
    if (stage === 'FORM' || stage === 'SUCCESS' || stage === 'PAYMENT') return;

    let interval: NodeJS.Timeout;

    if (stage === 'PROCESSING' && !clientSecret) {
      const ms = 60;
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
             clearInterval(interval);
             return 100;
          }
          return p + 5;
        });
      }, ms);
    } 

    return () => clearInterval(interval);
  }, [stage, clientSecret]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setStage('PROCESSING');
    
    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, lastName }),
      });
      const data = await res.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        // Add a slight delay for dramatic processing effect before mounting Stripe
        setTimeout(() => setStage('PAYMENT'), 1500);
      } else {
         console.error(data.error);
         setStage('FORM');
      }
    } catch (e) {
      console.error(e);
      setStage('FORM');
    }
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
           <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4 text-white">Complete Your Subscription</h1>
           <p className="text-neutral-400 font-light leading-relaxed">
             You are activating your UMBRA AI marketing platform. This gives you full access to all tools and features.
           </p>
        </div>

        <div className="space-y-6 mb-12">
          {/* Line Items */}
          <div className="flex justify-between items-center pb-6 border-b border-white/5">
            <span className="text-neutral-300">UMBRA Pro Plan (Monthly)</span>
            <span className="font-mono text-white">R2,750</span>
          </div>
          <div className="flex justify-between items-center pb-6 border-b border-white/5">
            <span className="text-neutral-500">AI Content & SEO Tools</span>
            <span className="text-emerald-500 text-xs font-bold tracking-wide uppercase">Included</span>
          </div>
          <div className="flex justify-between items-center pb-6 border-b border-white/5">
            <span className="text-neutral-500">Lead Generation & Analytics</span>
            <span className="text-emerald-500 text-xs font-bold tracking-wide uppercase">Included</span>
          </div>
          
          <div className="flex justify-between items-center pt-6">
            <span className="text-lg text-white font-medium">Total Billed Today</span>
            <span className="text-3xl font-light text-white">R2,750<span className="text-sm text-neutral-500 ml-1">ZAR</span></span>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
          <p className="text-xs text-emerald-500/80 leading-relaxed font-sans">
             Secure, military-grade transaction environment. Your telemetry and payment data are end-to-end encrypted. Cancel anytime.
          </p>
        </div>

        {/* What's Included */}
        <div className="mt-8 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Included in your deployment</p>
          {[
            "15+ Autonomous AI Agents",
            "AI Booking Agent (Speed-to-Lead)",
            "Dynamic Ad Creative Generator",
            "SEO Dominator Suite",
            "Content Factory (Unlimited Output)",
            "Custom Skill Pack Builder",
            "Lead Prospector & Outbound Engine",
            "White-Label PDF Exports",
            "BYOK Engine (Zero API Costs)",
            "Webhook Integrations (Zapier/Make)",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-neutral-400">
              <CheckCircle className="w-4 h-4 text-emerald-500/60 shrink-0" />
              {item}
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="mt-8 p-4 rounded-xl border border-amber-500/10 bg-amber-500/5">
          <p className="text-xs text-amber-400/80 leading-relaxed">
            <span className="font-bold">30-Day Performance Guarantee</span> &mdash; If the UMBRA Swarm doesn&apos;t generate measurable results within 30 days, we&apos;ll refund your investment. No questions asked.
          </p>
        </div>
      </div>

      {/* Right Pane - Form / Processing Flow */}
      <div className="relative z-10 w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-transparent min-h-[60vh] overflow-y-auto">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wide">Last Name</label>
                      <input 
                        type="text" 
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
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
                       Initialize Secure Gateway <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

          {/* Processing States */}
          {(stage === 'PROCESSING' || stage === 'PROVISIONING') && (
            <motion.div 
              key="processing-stage"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-xl mx-auto flex flex-col items-center justify-center space-y-12 h-full"
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
                     Initialize Payment Gateway...
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
            </motion.div>
          )}

          {/* Stripe Embedded Payment Gateway */}
          {stage === 'PAYMENT' && clientSecret && (
            <motion.div
              key="payment-stage"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xl mx-auto"
            >
              <div className="bg-[#0A0A0A]/90 p-1 md:p-6 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
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
               
               <h2 className="text-3xl md:text-5xl font-light text-white mb-6">You&apos;re In.</h2>
               <p className="text-neutral-400 font-light leading-relaxed mb-12">
                 Your subscription is now active. We have set up your UMBRA workspace and all AI tools are ready to use.
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
