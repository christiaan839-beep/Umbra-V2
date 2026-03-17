"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, BrainCircuit, CheckCircle2, Cpu, Globe, Target, Zap, ShieldAlert, ChevronDown, XCircle, Clock, TrendingUp, DollarSign, MessageSquare, Webhook } from "lucide-react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { useRef, useEffect, useState } from "react";

import { UmbraLogo } from "@/components/ui/UmbraLogo";
import { LiveDemoScanner } from "@/components/ui/LiveDemoScanner";
import { ROICalculator } from "@/components/ui/ROICalculator";
import { Pricing } from "@/components/ui/Pricing";
import { SplashIntro } from "@/components/ui/SplashIntro";
import { ParticleGrid } from "@/components/ui/ParticleGrid";
import { ToolShowcase } from "@/components/ui/SocialProof";
import { AnimatedVSL } from "@/components/ui/AnimatedVSL";

function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2000 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);
  
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button
        className="w-full flex items-center justify-between py-6 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm md:text-base font-semibold text-white group-hover:text-neutral-400 transition-colors pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 pb-6' : 'max-h-0'}`}>
        <p className="text-sm text-neutral-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [showSite, setShowSite] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      {!showSite && <SplashIntro onComplete={() => setShowSite(true)} />}
    <div className={`min-h-screen bg-black text-white selection:bg-white/20 font-sans transition-opacity duration-700 ${showSite ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UmbraLogo size="md" />
            <span className="text-xl font-bold tracking-[0.2em] uppercase text-white font-serif">Sovereign Matrix</span>
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
             <Link href="/pricing" className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors">Proof of Work</Link>
             <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
               <button className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors">Client Login</button>
             </SignInButton>
             <Link href="/pricing" className="px-5 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10 transition-colors">Start Free Trial</Link>
          </div>
          {/* Mobile hamburger */}
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu">
            <span className={`w-6 h-0.5 bg-white transition-all ${mobileNavOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all ${mobileNavOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all ${mobileNavOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
        {/* Mobile dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-2xl border-t border-white/5 px-6 py-6 flex flex-col gap-4 animate-fade-in">
            <Link href="/pricing" className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors" onClick={() => setMobileNavOpen(false)}>Proof of Work</Link>
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
              <button className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors text-left" onClick={() => setMobileNavOpen(false)}>Client Login</button>
            </SignInButton>
            <Link href="/pricing" className="px-5 py-3 rounded-full border border-white/10 bg-white/5 text-sm font-bold text-white text-center hover:bg-white/10 transition-colors" onClick={() => setMobileNavOpen(false)}>Start Free Trial</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 relative overflow-hidden flex flex-col items-center">
        {/* Obsidian subtle background texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("/grid.svg")' }} />

        {/* Interactive Particle Grid */}
        <div className="absolute inset-0 pointer-events-auto mix-blend-screen opacity-50">
          <ParticleGrid />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 w-full max-w-5xl mx-auto text-center">
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 text-xs font-medium uppercase tracking-[0.2em] mb-8">
            AI-Powered Defense-Grade Matrix
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 mb-8 serif-text leading-[1.1] tracking-tight">
            The Agency Extinction Protocol.<br/>
            <span className="text-neutral-400">Powered by NVIDIA Nemotron.</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed mb-12">
            Build and deploy secure, Sovereign AI Infrastructure with a single command. 
            Command the Nano 30B Edge Daemon locally via OpenClaw, and scale to the Super 120B Omni-RAG cluster for absolute market dominance.
          </p>

          <div className="flex flex-col items-center gap-4 mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <a href="#pricing" className="inline-flex px-10 py-5 rounded-full bg-white text-black text-lg font-bold shadow-[0_0_40px_rgba(255,255,255,0.15)] items-center gap-3 hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] transition-all">
                Initialize Sovereign Swarm V4 <ArrowRight className="w-6 h-6" />
              </a>
              <button 
                 onClick={() => {
                   document.getElementById("vsl")?.scrollIntoView({ behavior: "smooth" });
                 }}
                 className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/10 bg-transparent text-white font-bold text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Globe className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" /> See How It Works
              </button>
            </div>
          </div>

          {/* Trust Badges - Obsidian Edition */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-20 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400 bg-black/40 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                <ShieldAlert className="w-4 h-4 text-emerald-500" /> Secured by Google Vertex AI
              </div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400 bg-black/40 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full" style={{ animationDelay: '1s' }}>
                <Cpu className="w-4 h-4 text-emerald-500" /> Powered by NVIDIA NIM APIs
              </div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400 bg-black/40 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full" style={{ animationDelay: '2s' }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> NVIDIA Riva Speech AI
              </div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400 bg-black/40 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full" style={{ animationDelay: '3s' }}>
                <Zap className="w-4 h-4 text-emerald-500" /> TensorRT-LLM Microsecond Latency
              </div>
           </div>

          {/* Live Demo Scanner */}
          <div className="w-full max-w-3xl mx-auto mb-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, ease: "easeOut" }}>
              <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-6">Execution Telemetry — Live Target Scan</h2>
              <LiveDemoScanner />
            </motion.div>
          </div>

          {/* Animated Product Walkthrough */}
          <AnimatedVSL />

        </motion.div>

        {/* The 2026 Stack Architecture Grid - Obsidian Edition */}
        <div className="w-full max-w-7xl mx-auto relative z-10 mt-10">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white serif-text mb-4">Tactical Infrastructure</h2>
              <p className="text-neutral-500 text-sm">Four core systems working in absolute unison.</p>
            </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: BrainCircuit,
                  title: "Super 120B Omni-RAG",
                  desc: "Ground your sales and marketing in absolute truth using NVIDIA NeMo Retriever and the 120B Super open-weight reasoning model.",
                },
                {
                  icon: Target,
                  title: "Nano 30B Edge Execution",
                  desc: "Command the swarm locally from your macOS terminal or WhatsApp via the highly-secure OpenClaw Daemon.",
                },
                {
                  icon: Globe,
                  title: "Nemotron Speech Pipeline",
                  desc: "Deploy ultra-low latency voice closers powered by Nemotron Speech to secure retainers autonomously.",
                },
                {
                  icon: ShieldAlert,
                  title: "Morpheus Safety Shield",
                  desc: "Real-time PII redaction, brand alignment, and deepfake verification powered natively by NeMo Guardrails.",
                }
              ].map((feature, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors p-8 rounded-2xl group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <feature.icon className="w-32 h-32 text-white" />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative z-10">
                    <feature.icon className="w-5 h-5 text-neutral-300 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 relative z-10">{feature.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed relative z-10">{feature.desc}</p>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Animated Live Stats Banner */}
        <div className="w-full max-w-6xl mx-auto relative z-10 mt-10 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { end: 29, suffix: "", label: "AI Tools", icon: BrainCircuit },
              { end: 24, suffix: "/7", label: "Always Running", icon: Clock },
              { end: 30, suffix: "s", label: "Content Generation", icon: TrendingUp },
              { end: 90, suffix: "%", prefix: "", label: "Cost Savings vs Agency", icon: DollarSign },
            ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-black/50 border border-white/5 p-6 rounded-2xl text-center hover:border-white/10 transition-colors">
                <stat.icon className="w-5 h-5 text-neutral-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white font-mono">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} prefix={stat.prefix} />
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mt-2 font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What You Get — Revenue Engine Showcase */}
        <div className="w-full max-w-7xl mx-auto relative z-10 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 serif-text mb-4">Total Omni-Channel Domination.</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">Every tool your marketing team needs — automated and available around the clock.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: "OpenClaw Direct Access", desc: "Deploy autonomous software agents safely, instantly. Native integration with NVIDIA Agent Toolkit ensures 24/7 localized compute.", tag: "NVIDIA NIM" },
              { icon: ShieldAlert, title: "OpenShell Guardrails", desc: "Enforce policy-based privacy and security guardrails directly within the runtime. Absolute control over how agents handle data.", tag: "ENTERPRISE SECURE" },
              { icon: Globe, title: "Privacy Router", desc: "Tap open models like Mistral-Nemotron locally, or dynamically route to cloud-based frontier models within defined security guardrails.", tag: "DYNAMIC ROUTING" },
              { icon: Zap, title: "Deep Competitor Intel", desc: "Analyze competitor landing pages, ad copy, and SEO strategy. Get actionable insights to gain an edge in your market.", tag: "COMPETITOR X-RAY" },
              { icon: MessageSquare, title: "Mobile Command Center", desc: "Control your entire 24/7 autonomous marketing agency directly from Telegram. Fire webhooks, check stats, and deploy logic seamlessly.", tag: "TELEGRAM NATIVE" },
              { icon: Webhook, title: "Omni-Automation Network", desc: "100% autonomous background execution. Direct n8n secure routing handles content generation and lead scraping without human intervention.", tag: "WEBHOOK ROUTING" },
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-white/[0.01] p-8 border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-neutral-400" />
                  </div>
                   <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-bold bg-black/50 border border-white/5 px-3 py-1.5 rounded-full">{feature.tag}</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-200 mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* The Brutal Comparison Section - Obsidian */}
      <section className="py-32 bg-black border-y border-white/5 px-6 relative">
         <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white serif-text mb-6">Stop Paying Retainers.</h2>
              <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
                Why pay R15,000+ per month for slow, inconsistent operational work?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Human Agency */}
              <div className="bg-neutral-900/50 p-8 border border-neutral-800 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.02]">
                   <Target className="w-48 h-48 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-400 mb-2 flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-neutral-600" /> Traditional Agency
                </h3>
                <p className="text-neutral-500 font-mono font-bold text-xl mb-8">R15,000 – R50,000 / month</p>
                
                <ul className="space-y-4 relative z-10">
                  {[
                    "Takes 4 weeks to launch campaigns",
                    "Writes 4 generic blog posts a month",
                    "Manually audits 1 competitor occasionally",
                    "Expects YOU to close the leads",
                    "Takes weekends and holidays off"
                  ].map((item, i) => (
                     <li key={i} className="flex items-start gap-3 text-neutral-600">
                       <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                       <span className="text-sm font-medium">{item}</span>
                     </li>
                  ))}
                </ul>
              </div>

              {/* Sovereign Matrix System */}
              <div className="bg-white/[0.03] p-8 border border-white/10 rounded-3xl relative overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.02)]">
                <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                   <Cpu className="w-48 h-48 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-neutral-300" /> Sovereign Matrix Platform
                </h3>
                <p className="text-neutral-300 font-mono font-bold text-xl mb-8">Deploy Instantly. Zero Overhead.</p>
                
                <ul className="space-y-4 relative z-10">
                  {[
                    "Content generated in under 30 seconds",
                    "NeMo Guardrails — zero AI hallucinations",
                    "Nemotron Voice Agent dials & books leads",
                    "Self-optimizing via NVIDIA Data Flywheel",
                    "Runs 24/7 — absolute operational superiority"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-neutral-300">
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ROI Calculator */}
            <div className="mt-20">
              <ROICalculator />
            </div>

         </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-black relative border-t border-white/5">
         <div className="mb-24">
           <ToolShowcase />
         </div>
         <Pricing />
      </section>

      {/* Tech Stack Bar — Animated Marquee */}
      <section className="py-12 bg-white/[0.02] border-y border-white/5 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto overflow-hidden">
          <div className="marquee-track gap-12">
            {[...Array(2)].map((_, repeat) => (
              <div key={repeat} className="flex gap-12 items-center px-6">
                {["Google Gemini 2.5", "NVIDIA Nemotron", "NVIDIA Riva STT/TTS", "TensorRT-LLM", "NeMo Guardrails", "OpenClaw", "Google Vertex AI", "Neon Postgres", "Pipecat WebRTC", "Vercel Edge", "Data Flywheel"].map(tech => (
                  <span key={`${tech}-${repeat}`} className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-bold font-mono whitespace-nowrap">{tech}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder & Trust Section - Obsidian */}
      <section className="py-24 bg-black px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Founder Message */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Engineered in South Africa
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white serif-text mb-6 leading-tight tracking-tight">
                One Architect. 29 Swarm Agents.<br/>
                <span className="text-neutral-500">Zero Execution Bloat.</span>
              </h2>
              <div className="w-12 h-1 bg-white/10 mb-6" />
              <p className="text-neutral-500 leading-relaxed mb-6 text-sm">
                Sovereign Matrix was engineered to execute one directive: eliminate the inefficiencies of human agency labor. Businesses bleed capital on R15,000–R50,000 retainers for slow, generic fulfillment. I have authored 29 autonomous agents that deploy identical output in milliseconds.
              </p>
              <p className="text-neutral-500 leading-relaxed mb-8 text-sm">
                There is no &quot;AI Slop&quot;. Every node runs on deterministic routing — Gemini 2.5 for reasoning, Nemotron for voice, TensorRT-LLM for latency, and NeMo Guardrails for absolute security. No hallucinations, only executable intelligence.
              </p>
              <a href="#pricing" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                Deploy The Infrastructure
              </a>
            </div>
            {/* Right: Tech Stack */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-6">Architecture Verification</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Google Gemini 2.5", desc: "Core AI engine" },
                  { name: "NVIDIA Nemotron", desc: "Voice & agentic LLM" },
                  { name: "TensorRT-LLM", desc: "Microsecond inference" },
                  { name: "NeMo Guardrails", desc: "Zero hallucinations" },
                  { name: "NVIDIA Riva", desc: "Speech AI (STT/TTS)" },
                  { name: "Data Flywheel", desc: "Self-optimizing agents" },
                ].map((tech) => (
                  <div key={tech.name} className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-sm font-bold text-white mb-1">{tech.name}</p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{tech.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-6 mt-8 p-6 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  256-bit AES
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  POPIA Verified
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Paystack Integration
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-black px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white serif-text mb-4">Operational Parameters</h2>
            <p className="text-neutral-500">Declassification of core system mechanics and billing infrastructure.</p>
          </div>
          
          <div className="border border-white/5 rounded-2xl bg-white/[0.01] p-4">
            {[
              {
                q: "What defines Sovereign Matrix?",
                a: "It is an autonomous Omni-Channel orchestrator. It is not a chatbot. It is a cluster of 29 native AI agents generating campaigns, ripping competitive intelligence, and executing localized scraping autonomously. It replaces human agency dependencies."
              },
              {
                q: "What are the local execution capabilities?",
                a: "Using the proprietary OpenClaw daemon, the Matrix can execute workflows completely offline and air-gapped using your native macOS terminal and local Ollama weights (Mistral/Llama3), guaranteeing zero data leaks."
              },
              {
                q: "Why use Paystack for localization?",
                a: "For African deployments, Stripe presents heavy friction. We integrated Paystack directly into the Cartel Billing Engine to enable seamless $5,000/mo equivalent ZAR transactions for physical white-label provisioning."
              },
              {
                q: "Can I sever my license connection?",
                a: "Yes. All infrastructure licenses are deployed on a month-to-month, un-contracted chassis. You may terminate operations via your dashboard instantly without penalty."
              },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 text-center px-6 relative overflow-hidden bg-black border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.03),transparent_70%)]" />
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 serif-text tracking-tight">Deployment Imminent.</h2>
            <p className="text-lg text-neutral-500 max-w-xl mx-auto mb-12">The question isn&apos;t whether to automate. It&apos;s whether you&apos;ll establish sovereignty before your competitors do.</p>
            <Link href="/pricing" className="inline-flex px-12 py-5 bg-white text-black font-bold rounded-full text-sm uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:bg-neutral-200 transition-colors items-center gap-3">
              Initialize Matrix
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-black border-t border-white/5 px-6">
        <div className="max-w-6xl mx-auto py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 px-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <UmbraLogo size="sm" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-white">Sovereign Matrix</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">An elite, AI-driven defense-grade orchestration platform built to replace traditional marketing agency workflows.</p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-6">Infrastructure</h4>
              <ul className="space-y-4">
                <li><Link href="/pricing" className="text-xs text-neutral-500 hover:text-white transition-colors">Architecture Overview</Link></li>
                <li><Link href="/#pricing" className="text-xs text-neutral-500 hover:text-white transition-colors">Licensing Model</Link></li>
                <li><Link href="/dashboard" className="text-xs text-neutral-500 hover:text-white transition-colors">Command Terminal</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-6">Compliance</h4>
              <ul className="space-y-4">
                <li><Link href="/privacy" className="text-xs text-neutral-500 hover:text-white transition-colors">Privacy Paradigm</Link></li>
                <li><Link href="/terms" className="text-xs text-neutral-500 hover:text-white transition-colors">Terms of Operations</Link></li>
                <li><span className="text-xs text-neutral-700">POPIA Adherent</span></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-6">Communications</h4>
              <ul className="space-y-4">
                <li><a href="mailto:sysadmin@sovereign-matrix.com" className="text-xs text-neutral-500 hover:text-white transition-colors font-mono">sysadmin@sovereign.local</a></li>
                <li><span className="text-xs text-neutral-600 uppercase tracking-widest">Base: Western Cape</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 px-4">
            <p className="text-[10px] text-neutral-700 uppercase tracking-[0.2em]">© 2026 Sovereign Matrix Protocol. All channels encrypted.</p>
            <p className="text-[10px] text-neutral-700 uppercase tracking-[0.2em]">Transacting globally via Paystack.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
