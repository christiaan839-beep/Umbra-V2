"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center text-center px-8 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-electric/8 via-transparent to-transparent blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-rose-glow/6 via-transparent to-transparent blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }} className="relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-[0.2em] mb-12">
          <Zap className="w-3 h-3" /> Shadow Intelligence
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}
          className="text-7xl md:text-9xl serif-text font-light text-white mb-6 tracking-[0.15em]">
          <span className="bg-gradient-to-b from-white via-white to-text-secondary bg-clip-text text-transparent">UMBRA</span>
        </motion.h1>

        <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-electric to-transparent mx-auto mb-8" />

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="text-lg text-text-secondary max-w-md mx-auto leading-relaxed mb-14 tracking-wide">
          Autonomous AI that markets, sells, and scales<br />while you sleep.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sovereign" className="px-10 py-4 bg-white text-midnight font-bold rounded-xl text-lg flex items-center justify-center gap-2 group hover:bg-gray-200 transition-all duration-500">
            Enter <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link href="/dashboard" className="px-10 py-4 border border-glass-border text-white font-medium rounded-xl text-lg hover:bg-glass-bg transition-all duration-500">
            Dashboard
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom fade line */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] text-text-secondary/30 uppercase tracking-[0.5em]">
        Shadow Intelligence Platform
      </motion.div>
    </div>
  );
}
