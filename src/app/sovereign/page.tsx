"use client";

import { motion } from "framer-motion";
import { UmbraLogo } from "@/components/ui/UmbraLogo";
import { ROICalculator } from "@/components/sovereign/ROICalculator";
import Link from "next/link";
import { ChevronRight, Cpu, Infinity as InfinityIcon, Shield } from "lucide-react";

export default function SovereignTerminal() {
  return (
    <div className="min-h-screen bg-midnight text-white selection:bg-rose-500/30 selection:text-white pb-32">
      {/* Premium Header */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-glass-border bg-midnight/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <UmbraLogo size="md" />
            <span className="font-bold tracking-[0.2em] text-sm group-hover:text-rose-glow transition-colors">UMBRA V2</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
             <span>Sovereign Architecture</span>
             <span>Decimation Protocols</span>
             <Link href="/login" className="text-white">Access God-Brain</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="pt-40 px-6">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
             <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-glow text-xs font-bold uppercase tracking-widest mb-8">
               Phase 28 Active
             </span>
             <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 serif-text leading-tight">
               The Sovereign Entity.
             </h1>
             <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
               Agencies sell time. UMBRA provides mathematical certainty at infinite scale. Calculate exactly how much cash you are bleeding to human error below.
             </p>
          </motion.div>
        </div>

        {/* The Calculator */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
           <ROICalculator />
        </motion.div>

        {/* Features */}
        <div className="max-w-5xl mx-auto mt-32 grid md:grid-cols-3 gap-8">
          {[
            { tag: "01", title: "Zero Latency", desc: "Humans take 4 weeks to launch campaigns. UMBRA deploys programmatic SEO and hooks in 3.4 seconds.", icon: Cpu },
            { tag: "02", title: "Ruthless Logic", desc: "Agencies get emotional about losing ads. The Apex Ad Buyer coldly calculates CPA and kills bleeding campaigns instantly.", icon: InfinityIcon },
            { tag: "03", title: "God-Brain Persistence", desc: "Employees forget client context. UMBRA logs every lead, every ad variant, and every competitor change to Pinecone forever.", icon: Shield },
          ].map((feat, i) => (
             <div key={i} className="glass-card p-8 border border-glass-border hover:border-rose-500/30 transition-colors">
                <feat.icon className="w-8 h-8 text-rose-500 mb-6" />
                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{feat.tag}</span>
                <h3 className="text-xl font-bold text-white mt-2 mb-4">{feat.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
             </div>
          ))}
        </div>

      </main>
    </div>
  );
}
