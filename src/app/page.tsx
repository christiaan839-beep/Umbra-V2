"use client";

import { motion, useInView } from "framer-motion";
import { BrainCircuit, CheckCircle2, Cpu, Globe, Target, Zap, ShieldAlert, ChevronDown, XCircle, Clock, TrendingUp, DollarSign, MessageSquare } from "lucide-react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { useRef, useEffect, useState } from "react";

import { SovereignLogo } from "@/components/ui/SovereignLogo";
import { Pricing } from "@/components/ui/Pricing";
import { SplashIntro } from "@/components/ui/SplashIntro";
import { ImmersiveNodeLayer } from "@/components/3d/ImmersiveNodeLayer";
import { ToolShowcase } from "@/components/ui/SocialProof";
import { AnimatedVSL } from "@/components/ui/AnimatedVSL";
import SovereignCalculator from "@/components/SovereignCalculator";
import GodBrainTelemetry from "@/components/GodBrainTelemetry";
import DeepfakeShowcase from "@/components/DeepfakeShowcase";
import { InteractiveHeroStrike } from "@/components/ui/InteractiveHeroStrike";
import { AIDemoShowcase } from "@/components/ui/AIDemoShowcase";

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
      <nav className="fixed top-6 inset-x-0 z-50 flex justify-center px-6 pointer-events-none">
         <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.05)] rounded-full px-8 h-16 flex items-center justify-between gap-12 pointer-events-auto max-w-5xl w-full">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <SovereignLogo size="sm" />
            <span className="hidden sm:block text-sm md:text-base font-bold tracking-[0.2em] uppercase text-white font-serif group-hover:text-neutral-300 transition-colors">Sovereign Matrix</span>
          </Link>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
             <Link href="/pricing" className="text-xs font-bold tracking-widest uppercase text-neutral-400 hover:text-white transition-colors">Proof of Work</Link>
             <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
               <button className="text-xs font-bold tracking-widest uppercase text-neutral-400 hover:text-white transition-colors">Client Login</button>
             </SignInButton>
             <Link href="/pricing" className="px-6 py-2.5 rounded-full border border-white/10 bg-white text-[10px] font-bold tracking-widest text-black uppercase hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
               Initialize Control
             </Link>
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
          <div className="absolute top-24 left-6 right-6 p-6 rounded-2xl md:hidden bg-black/95 backdrop-blur-2xl border border-white/10 flex flex-col gap-4 animate-fade-in pointer-events-auto">
            <Link href="/pricing" className="text-xs font-bold tracking-widest uppercase text-neutral-400 hover:text-white transition-colors" onClick={() => setMobileNavOpen(false)}>Proof of Work</Link>
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
              <button className="text-xs font-bold tracking-widest uppercase text-neutral-400 hover:text-white transition-colors text-left" onClick={() => setMobileNavOpen(false)}>Client Login</button>
            </SignInButton>
            <Link href="/pricing" className="px-5 py-4 rounded-xl border border-white/10 bg-white text-xs font-bold uppercase tracking-widest text-black text-center hover:bg-neutral-200 transition-colors mt-4" onClick={() => setMobileNavOpen(false)}>Initialize Control</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 relative overflow-hidden flex flex-col items-center min-h-[90vh] justify-center">
        {/* Immersive Quantum Emerald Grid */}
        <div className="absolute inset-0 pointer-events-none z-0">
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#10B98110_1px,transparent_1px),linear-gradient(to_bottom,#10B98110_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_110%)] animate-[pulse_8s_ease-in-out_infinite] opacity-60" />
           <div className="absolute top-[-20%] left-1/4 w-[1000px] h-[1000px] bg-[#10B981]/10 rounded-full blur-[150px] opacity-50 mix-blend-screen" />
           <div className="absolute bottom-[-10%] right-1/4 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[150px] opacity-30 mix-blend-screen" />
        </div>

        {/* Elite Physical Data Flow Simulator */}
        <ImmersiveNodeLayer />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 w-full max-w-5xl mx-auto text-center">
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 text-xs font-medium uppercase tracking-[0.2em] mb-8 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            The Ultimate Autonomous AI OS
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 mb-8 serif-text leading-[1.1] tracking-tight">
            Transform Operations.<br/>
            <span className="text-neutral-400">With Agentic AI.</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed mb-12">
            Explore the cutting-edge building blocks of AI agents designed to reason, plan, and act. 
            The Sovereign Matrix runs open-source autonomous agents securely on your infrastructure.
          </p>

          <div className="mb-20">
            <InteractiveHeroStrike />
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

          {/* Live Platform Demo Emulator */}
          <div className="w-full max-w-5xl mx-auto mb-20 mt-10">
              <div className="text-center mb-10">
                 <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-[#10B981] serif-text mb-4">Agentic AI Execution</h2>
                 <p className="text-neutral-500 max-w-2xl mx-auto text-sm">
                   Watch high-definition 30-second demonstrations of our NemoClaw and KiloClaw agents navigating complex logic seamlessly.
                 </p>
              </div>
              {/* Real-time System Analytics Array */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                 <div className="rounded-2xl border border-[#00ff66]/20 bg-[#00ff66]/5 backdrop-blur-md p-6 shadow-[0_0_40px_rgba(0,255,102,0.05)]">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-xs font-bold uppercase tracking-widest text-[#00ff66]">NIMO Audio-To-Face</p>
                       <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
                    </div>
                    <div className="h-1 w-full bg-black/50 rounded-full overflow-hidden">
                       <div className="h-full bg-[#00ff66] w-full animate-[pulse_2s_ease-in-out_infinite]" />
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-3 font-mono">Status: ONLINE | Latency: 12ms</p>
                 </div>
                 <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-md p-6">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-xs font-bold uppercase tracking-widest text-white">Tensor Synthetic Outbound</p>
                       <span className="w-2 h-2 rounded-full bg-neutral-500 animate-pulse" />
                    </div>
                    <div className="h-1 w-full bg-black/50 rounded-full overflow-hidden">
                       <div className="h-full bg-neutral-500 w-[85%]" />
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-3 font-mono">Status: STANDBY | Dialing...</p>
                 </div>
                 <div className="rounded-2xl border border-[#00ff66]/20 bg-[#00ff66]/5 backdrop-blur-md p-6 shadow-[0_0_40px_rgba(0,255,102,0.05)]">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-xs font-bold uppercase tracking-widest text-[#00ff66]">NVIDIA Cosmos VLM</p>
                       <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
                    </div>
                    <div className="h-1 w-full bg-black/50 rounded-full overflow-hidden">
                       <div className="h-full bg-[#00ff66] w-full animate-[pulse_1.5s_ease-in-out_infinite]" />
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-3 font-mono">Status: SYNCED | Vision: Active</p>
                 </div>
              </div>
             <AIDemoShowcase />
          </div>

          {/* God-Brain Diagnostics */}
          <div className="w-full max-w-4xl mx-auto mb-20 mt-10">
             <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-6">Deep-Layer Node Telemetry Stream</h2>
             <GodBrainTelemetry />
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
                    {feature.icon === Globe ? (
                      <Globe className="w-5 h-5 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
                    ) : (
                      <feature.icon className="w-5 h-5 text-neutral-300 group-hover:text-white transition-colors" />
                    )}
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
              { end: 62, suffix: "", label: "Autonomous AI Agents", icon: BrainCircuit },
              { end: 41, suffix: "", label: "NVIDIA NIM Models", icon: Clock },
              { end: 6, suffix: "", label: "Industry Verticals", icon: TrendingUp },
              { end: 0, suffix: "", prefix: "$", label: "Infrastructure Cost", icon: DollarSign },
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

        {/* Advanced Industry Override — The Extinction Sectors */}
        <div className="w-full max-w-7xl mx-auto relative z-10 mb-24">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-[#10B981] serif-text mb-4">Run Autonomous Agents Safely.</h2>
             <p className="text-neutral-500 max-w-2xl mx-auto">Sovereign Matrix leverages the NVIDIA open source stack to add absolute privacy and security controls to your enterprise data flywheel.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: "NemoClaw OS Autonomy", desc: "Sovereign Matrix physically controls your Mac's mouse and keyboard. It opens hidden headless Chrome browsers to steal competitor DBs while you sleep.", tag: "NEMOCLAW DAEMON" },
              { icon: BrainCircuit, title: "Uncensored Edge RAG", desc: "Upload gigabytes of classified corporate PDFs. Run vector analysis locally on NVMe storage with ChromaDB—bypassing OpenAI API fees entirely.", tag: "ZERO DATA LEAKS" },
              { icon: Target, title: "SaaS Sales Domination", desc: "Fire your SDRs. The Matrix executes physical outbound sequences, scraping target lists dynamically and writing Nemotron-powered emails.", tag: "GHOST FLEET PROTOCOL" },
              { icon: ShieldAlert, title: "God-Eye Surveillance", desc: "Sell your software to physical retail. Plug the Matrix into RTSP security feeds for sub-millisecond NVIDIA Metropolis theft-detection.", tag: "SPATIAL ARRAYS" },
              { icon: Globe, title: "Autonomous Engineering Node", desc: "The Matrix doesn't just market software; it builds it. Summon the local Qwen-Coder model via Aider CLI to physically author and commit production code.", tag: "QWEN2.5-CODER" },
              { icon: MessageSquare, title: "Telegram Sub-Command", desc: "Dictate the swarm's targets from your iOS device. Dispatch the Deepfake closer or order a competitor audit via immediate webhook execution.", tag: "MOBILE UPLINK" },
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
              <h2 className="text-3xl md:text-5xl font-bold text-white serif-text mb-6">Trust Through Transparency.</h2>
              <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
                Bring trust and safety to everyday corporate execution using NVIDIA Agent Toolkit and OpenShell architecture.
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

            {/* Agency Extinction Calculator */}
            <div className="mt-20">
              <SovereignCalculator />
            </div>

         </div>
      </section>

      <DeepfakeShowcase />

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
                {["NVIDIA NIM 41 Models", "DeepSeek V3.2", "Mistral Nemotron", "NeMo Guardrails", "Agent Memory", "Collab Rooms", "Smart Router", "Multi-Modal Pipeline", "NemoClaw OS", "Vercel Edge", "Self-Improving AI"].map(tech => (
                  <span key={`${tech}-${repeat}`} className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-bold font-mono whitespace-nowrap">{tech}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder & Trust Section - Obsidian */}
      <section className="py-24 bg-black px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Founder Message */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Engineered in South Africa
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white serif-text mb-6 leading-tight tracking-tight">
                Become The Chief Agent Officer.<br/>
                <span className="text-neutral-500">Orchestrate the Swarm.</span>
              </h2>
              <div className="w-12 h-1 bg-white/10 mb-6" />
              <p className="text-neutral-500 leading-relaxed mb-6 text-sm">
                Every enterprise is currently hiring for one objective: offloading operations to autonomous systems. As a Chief Agent Officer (CAO), you do not write copy or run ads. You manage, tune, and orchestrate the Sovereign Matrix—a 29-node AI workforce that replaces traditional $15,000 retainers entirely.
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
                  { name: "Google Gemini 2.5", desc: "Primary Cognitive Engine" },
                  { name: "NVIDIA Nemotron-Mini", desc: "Local Edge Execution" },
                  { name: "NemoClaw OS Daemon", desc: "Physical Hardware Control" },
                  { name: "ChromaDB Memory", desc: "Uncensored RAG Intel" },
                  { name: "TensorRT Hardware", desc: "Microsecond Latency" },
                  { name: "NeMo Guardrails", desc: "Zero Hallucinations" },
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
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-black px-6 border-t border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
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
        </motion.div>
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
                <SovereignLogo size="sm" />
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
