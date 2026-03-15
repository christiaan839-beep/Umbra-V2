"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, Zap, Target, Brain, Send, Shield, Film, BarChart3, Globe2, CheckCircle2 } from "lucide-react";

const DEMO_STEPS = [
  {
    id: "welcome",
    title: "Welcome to UMBRA",
    subtitle: "Autonomous AI Marketing Intelligence",
    description: "This is a 60-second walkthrough of your AI-powered marketing command center.",
    icon: Zap,
    color: "#00B7FF",
    kpis: null,
  },
  {
    id: "outbound",
    title: "Autonomous Outbound Engine",
    subtitle: "Phase 79 — Cold Email Synthesis",
    description: "UMBRA uses Gemini 2.5 Pro to generate hyper-personalized cold emails targeting your exact niche. Each email is unique — different pain points, different angles, different CTAs.",
    icon: Send,
    color: "#F97316",
    kpis: [
      { label: "Emails Generated", value: 847, suffix: "" },
      { label: "Open Rate", value: 62, suffix: "%" },
      { label: "Reply Rate", value: 24, suffix: "%" },
    ],
  },
  {
    id: "competitor",
    title: "Competitive Warfare Scanner",
    subtitle: "Phase 82 — Threat Intelligence",
    description: "Weekly automated reports analyze your competitors' positioning, identify weaknesses, and generate actionable counter-strategies. Stay three moves ahead.",
    icon: Shield,
    color: "#EF4444",
    kpis: [
      { label: "Competitors Tracked", value: 12, suffix: "" },
      { label: "Vulnerabilities Found", value: 34, suffix: "" },
      { label: "Counter-Strategies", value: 89, suffix: "" },
    ],
  },
  {
    id: "content",
    title: "Content Synthesis Engine",
    subtitle: "Phase 83 — Video + Landing Pages",
    description: "Generate video scripts, SVG graphics, and full landing pages from text prompts. Publish across YouTube, Instagram, and TikTok autonomously.",
    icon: Film,
    color: "#A855F7",
    kpis: [
      { label: "Videos Synthesized", value: 156, suffix: "" },
      { label: "Pages Generated", value: 432, suffix: "" },
      { label: "Social Posts", value: 1247, suffix: "" },
    ],
  },
  {
    id: "intelligence",
    title: "Memory Flywheel",
    subtitle: "Phase 81 — Self-Improving AI",
    description: "Every action feeds back into the intelligence loop. UMBRA gets smarter with every campaign, every lead, every conversion. Your competitors can't replicate months of accumulated intelligence.",
    icon: Brain,
    color: "#06B6D4",
    kpis: [
      { label: "Data Points", value: 54892, suffix: "" },
      { label: "Learning Cycles", value: 2847, suffix: "" },
      { label: "Accuracy Gain", value: 34, suffix: "%" },
    ],
  },
  {
    id: "revenue",
    title: "Revenue Autopilot",
    subtitle: "Phase 80 — Stripe Integration",
    description: "Automated invoicing, milestone detection, and upsell triggers. The AI identifies when clients are ready for upgrades and handles the entire billing lifecycle.",
    icon: BarChart3,
    color: "#10B981",
    kpis: [
      { label: "MRR", value: 47500, suffix: "", prefix: "$" },
      { label: "Upsell Rate", value: 38, suffix: "%" },
      { label: "Churn", value: 2.1, suffix: "%" },
    ],
  },
  {
    id: "global",
    title: "Global Strike Map",
    subtitle: "Phase 74 — Real-Time Operations",
    description: "Watch your AI execute across the globe in real-time. Every lead conversation, every content deployment, every competitive scan — visible on a 3D globe.",
    icon: Globe2,
    color: "#F59E0B",
    kpis: [
      { label: "Active Regions", value: 14, suffix: "" },
      { label: "Live Actions", value: 237, suffix: "/hr" },
      { label: "Uptime", value: 99.97, suffix: "%" },
    ],
  },
  {
    id: "scale",
    title: "Ready to Dominate?",
    subtitle: "94 AI Phases. One Platform.",
    description: "UMBRA isn't a tool — it's an autonomous marketing intelligence system. White-label it, resell it, or deploy it for your own empire.",
    icon: Target,
    color: "#FF00FF",
    kpis: null,
  },
];

function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "" }: { end: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end * 10) / 10);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function DemoFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (prev < DEMO_STEPS.length - 1 ? prev + 1 : prev));
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      if (currentStep < DEMO_STEPS.length - 1) {
        nextStep();
      } else {
        setIsPlaying(false);
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, nextStep]);

  const step = DEMO_STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-[calc(100vh-2rem)] flex flex-col gap-6 p-4 lg:p-8 z-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-white tracking-widest font-mono flex items-center gap-3">
            <Play className="w-6 h-6 text-cyan-400" />
            LIVE DEMO
          </h1>
          <p className="text-[#8A95A5] uppercase tracking-[0.2em] text-[10px] font-bold mt-1">
            60-Second Platform Walkthrough
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 hover:from-cyan-500/20 hover:to-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl flex items-center gap-2 transition-all uppercase tracking-widest font-bold font-mono text-[10px]"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? "Pause" : "Auto-Play"}
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep >= DEMO_STEPS.length - 1}
            className="px-5 py-2.5 bg-white/5 border border-white/10 text-neutral-400 rounded-xl flex items-center gap-2 transition-all uppercase tracking-widest font-bold font-mono text-[10px] disabled:opacity-30"
          >
            <SkipForward className="w-4 h-4" /> Next
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-1.5">
        {DEMO_STEPS.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: i <= currentStep ? step.color : "transparent" }}
              initial={{ width: "0%" }}
              animate={{ width: i <= currentStep ? "100%" : "0%" }}
              transition={{ duration: 0.5 }}
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col items-center justify-center text-center"
        >
          <motion.div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}30` }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className="w-10 h-10" style={{ color: step.color }} />
          </motion.div>

          <h2 className="text-3xl lg:text-5xl font-light text-white tracking-wider mb-2">{step.title}</h2>
          <p className="text-sm font-mono uppercase tracking-widest mb-6" style={{ color: step.color }}>{step.subtitle}</p>
          <p className="text-neutral-400 max-w-2xl text-base leading-relaxed mb-10">{step.description}</p>

          {step.kpis && (
            <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
              {step.kpis.map((kpi, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
                >
                  <p className="text-3xl font-light text-white mb-1">
                    <AnimatedCounter end={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500">{kpi.label}</p>
                </motion.div>
              ))}
            </div>
          )}

          {step.id === "scale" && (
            <motion.a
              href="/pricing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 px-10 py-4 rounded-xl font-mono uppercase tracking-widest text-sm font-bold transition-all"
              style={{ backgroundColor: `${step.color}20`, border: `1px solid ${step.color}40`, color: step.color }}
            >
              View Pricing →
            </motion.a>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Step Counter */}
      <div className="text-center">
        <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
          {currentStep + 1} / {DEMO_STEPS.length}
        </span>
      </div>
    </div>
  );
}
