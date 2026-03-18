"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Sparkles, BarChart3, Send, Globe } from "lucide-react";

const STEPS = [
  {
    label: "01",
    title: "Initialize Target Parameters",
    detail: "Inject your corporate ontology, target demographic, and objective vectors. One command is all it takes.",
    visual: "prompt",
    color: "#00B7FF",
  },
  {
    label: "02",
    title: "Execute Neural Synthesis",
    detail: "The Swarm physically assembles the payloads—landing pages, high-ticket email sequences, and 3D competitor audits.",
    visual: "generate",
    color: "#10B981",
  },
  {
    label: "03",
    title: "Authorize Deployment",
    detail: "Verify the output via NeMo Guardrails. Execute the final push to all production endpoints synchronously.",
    visual: "publish",
    color: "#F59E0B",
  },
  {
    label: "04",
    title: "Observe Trajectory",
    detail: "Organic nodes index. High-ticket leads are captured. The Sovereign Matrix operates with absolute autonomy.",
    visual: "compound",
    color: "#EC4899",
  },
];

// Simulated terminal typing
function Typewriter({ text, speed = 30, delay = 0 }: { text: string; speed?: number; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [isInView, delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [started, text, speed]);

  return <span ref={ref}>{displayed}<span className="animate-pulse opacity-60">|</span></span>;
}

// Mock dashboard card
function MockDashboardCard({ step, isActive }: { step: typeof STEPS[0]; isActive: boolean }) {
  if (step.visual === "prompt") {
    return (
      <div className="rounded-xl bg-black/60 border border-white/10 p-5 font-mono text-sm space-y-3">
        <div className="flex items-center gap-2 text-neutral-500 text-xs">
          <Sparkles className="w-3 h-3" /> SOVEREIGN AI
        </div>
        <div className="text-neutral-300">
          {isActive ? (
            <Typewriter
              text='> [TARGET LOCK]: Western Cape Enterprise Real Estate.\n> [OBJECTIVE]: Annihilate competitor search volume.\n> [PAYLOAD]: Deploy 50-node SEO cluster and 3-stage Cold Email Drip.'
              speed={25}
              delay={200}
            />
          ) : (
            <span className="text-neutral-600">Type your business brief...</span>
          )}
        </div>
        <div className="flex gap-2 pt-2">
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-neutral-500">NODE_SEO_V2</div>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-neutral-500">NEMOTRON_SDR</div>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-neutral-500">DEFENSE_MODE</div>
        </div>
      </div>
    );
  }

  if (step.visual === "generate") {
    const items = [
      { name: "NVIDIA Embeddings: Scraped 12 Competitor Sites", status: "done" },
      { name: "Cosmos VLM: Rendered 4K Cinematic Payload", status: "done" },
      { name: "Next.js: Compiled Cartel Landing Page", status: "done" },
      { name: "Nemotron: Synthesizing High-Ticket Drip", status: isActive ? "loading" : "pending" },
      { name: "Guardrails: Redacting Brand PII Data", status: isActive ? "loading" : "pending" },
    ];
    return (
      <div className="rounded-xl bg-black/60 border border-white/10 p-5 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
          <BarChart3 className="w-3 h-3" /> GENERATING 5 ASSETS
        </div>
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="flex items-center gap-3 text-sm"
          >
            <div className={`w-2 h-2 rounded-full ${
              item.status === "done" ? "bg-emerald-400" :
              item.status === "loading" ? "bg-amber-400 animate-pulse" :
              "bg-neutral-700"
            }`} />
            <span className={item.status === "done" ? "text-neutral-300" : "text-neutral-500"}>
              {item.name}
            </span>
          </motion.div>
        ))}
      </div>
    );
  }

  if (step.visual === "publish") {
    return (
      <div className="rounded-xl bg-black/60 border border-white/10 p-5 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
          <Send className="w-3 h-3" /> AUTHORIZATION REQUIRED
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["Vercel Edge", "Apollo.io", "Twilio Voice"].map((ch, i) => (
            <motion.div
              key={ch}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.3 }}
              transition={{ delay: i * 0.15 }}
              className="rounded-lg bg-white/5 border border-white/10 p-3 text-center"
            >
              <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">{ch}</div>
              <div className="text-emerald-400 text-xs font-bold">Armed</div>
            </motion.div>
          ))}
        </div>
        <motion.button
          animate={isActive ? { scale: [1, 1.02, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-full py-2.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-widest"
        >
          Execute Payloads →
        </motion.button>
      </div>
    );
  }

  // compound
  return (
    <div className="rounded-xl bg-black/60 border border-white/10 p-5 space-y-3">
      <div className="flex items-center gap-2 text-pink-400 text-xs font-bold">
        <Globe className="w-3 h-3" /> TELEMETRY UPLINK ACTIVE
      </div>
      <div className="space-y-2">
        {[
          { label: "Terminal Nodes Synced", value: "29/29", bar: 100 },
          { label: "$5k High-Ticket Leads", value: "14 Active", bar: 80 },
          { label: "System Hallucinations", value: "0.00%", bar: 5 },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : { opacity: 0.3 }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-500">{metric.label}</span>
              <span className="text-white font-bold font-mono">{metric.value}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400"
                initial={{ width: 0 }}
                animate={isActive ? { width: `${metric.bar}%` } : { width: 0 }}
                transition={{ delay: i * 0.2 + 0.3, duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function AnimatedVSL() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Auto-cycle through steps
  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isInView]);

  return (
    <section ref={containerRef} id="vsl" className="w-full max-w-5xl mx-auto mb-24">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left — Steps */}
        <div className="space-y-2">
          {STEPS.map((step, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveStep(i)}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className={`w-full text-left p-5 rounded-2xl border transition-all duration-500 ${
                activeStep === i
                  ? "bg-white/[0.04] border-white/15"
                  : "bg-transparent border-transparent hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Step number */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-500 ${
                    activeStep === i
                      ? "text-white"
                      : "text-neutral-600"
                  }`}
                  style={{
                    backgroundColor: activeStep === i ? `${step.color}20` : "transparent",
                    borderWidth: 1,
                    borderColor: activeStep === i ? `${step.color}40` : "transparent",
                  }}
                >
                  {step.label}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`text-base font-bold mb-1 transition-colors duration-300 ${
                    activeStep === i ? "text-white" : "text-neutral-500"
                  }`}>
                    {step.title}
                  </h3>
                  {activeStep === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-neutral-400 leading-relaxed"
                    >
                      {step.detail}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {activeStep === i && (
                <div className="mt-3 ml-14 h-0.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: step.color }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    key={`progress-${i}-${activeStep}`}
                  />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Right — Live Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="sticky top-32"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
            {/* Mock titlebar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[10px] text-neutral-600 font-mono">umbra.ai/dashboard</span>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-5">
              <MockDashboardCard step={STEPS[activeStep]} isActive={true} />
            </div>
          </div>

          {/* CTA below preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="mt-4 text-center"
          >
            <button
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300 hover:bg-white/10 hover:text-white transition-all group"
            >
              Try it yourself <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
