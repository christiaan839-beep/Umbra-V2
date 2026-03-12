"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center text-center px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-electric/10 via-transparent to-transparent blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-10">
          <Zap className="w-3 h-3" /> V2 — Rebuilt From Scratch
        </div>

        <h1 className="text-6xl md:text-8xl serif-text font-light text-white mb-4 tracking-tight">
          SOVEREIGN<br />
          <span className="bg-gradient-to-r from-electric via-rose-glow to-gold bg-clip-text text-transparent">NODE</span>
        </h1>

        <p className="text-lg text-text-secondary max-w-md mx-auto leading-relaxed mb-12">
          Autonomous AI Marketing Intelligence
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sovereign" className="px-8 py-4 bg-white text-midnight font-bold rounded-xl text-lg flex items-center justify-center gap-2 group hover:bg-gray-200 transition-all">
            Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/dashboard" className="px-8 py-4 border border-glass-border text-white font-medium rounded-xl text-lg hover:bg-glass-bg transition-all">
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
