"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Marcus van der Berg",
    role: "CEO, Velocity Digital",
    avatar: "MV",
    text: "We replaced a 6-person content team with UMBRA. The AI content engine produces more output in one day than our team did in a month — and the quality is indistinguishable from senior copywriters.",
    metric: "R847K revenue generated",
    color: "from-[#00B7FF]/20 to-transparent",
  },
  {
    name: "Naledi Dlamini",
    role: "Growth Lead, ScaleUp Agency",
    avatar: "ND",
    text: "The Funnel X-Ray is insane. We analyzed 40 competitor landing pages in one afternoon and built superior variants for our clients. Our conversion rates jumped 340% in 3 weeks.",
    metric: "340% conversion lift",
    color: "from-emerald-400/20 to-transparent",
  },
  {
    name: "Johan Pretorius",
    role: "Founder, Apex Marketing Co",
    avatar: "JP",
    text: "I was skeptical about AI-generated content until I saw the anti-slop engine. It doesn't read like AI. Our clients can't tell the difference and our output 10x'd overnight.",
    metric: "10x content output",
    color: "from-rose-400/20 to-transparent",
  },
];

const TOOL_SHOWCASE = [
  {
    name: "Outbound Engine",
    desc: "Multi-step cold outreach sequences",
    gradient: "from-[#00B7FF] to-blue-600",
  },
  {
    name: "Programmatic SEO",
    desc: "50+ SEO pages generated per hour",
    gradient: "from-emerald-400 to-green-600",
  },
  {
    name: "Competitor Intel",
    desc: "Porter's Five Forces battle plans",
    gradient: "from-rose-400 to-red-600",
  },
  {
    name: "Ad Creative Gen",
    desc: "5 variations per campaign, PAS framework",
    gradient: "from-amber-400 to-orange-600",
  },
  {
    name: "Page Builder",
    desc: "Full landing pages in 30 seconds",
    gradient: "from-purple-400 to-indigo-600",
  },
  {
    name: "AI Booking Agent",
    desc: "BANT-qualified leads, 0-100 scoring",
    gradient: "from-pink-400 to-rose-600",
  },
];

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="w-full max-w-7xl mx-auto py-24 relative z-10">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y:20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white serif-text mb-4">
            The Results Speak
          </h2>
          <p className="text-neutral-400 text-sm uppercase tracking-[0.2em]">
            What operators say after deploying the swarm
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="relative group"
          >
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-b ${t.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 h-full flex flex-col">
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <Quote className="w-8 h-8 text-white/10 mb-3" />
              <p className="text-sm text-neutral-300 leading-relaxed flex-1 mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Metric badge */}
              <div className="px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest w-fit mb-6">
                {t.metric}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function ToolShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TOOL_SHOWCASE.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="w-full max-w-7xl mx-auto py-24 relative z-10">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white serif-text mb-4">
            29 AI Agents. One Dashboard.
          </h2>
          <p className="text-neutral-400 text-sm uppercase tracking-[0.2em]">
            Every tool you need to dominate your market
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {TOOL_SHOWCASE.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative rounded-2xl p-6 border transition-all duration-500 cursor-pointer group ${
              activeIndex === i
                ? "border-white/20 bg-white/[0.05] scale-105 shadow-[0_0_40px_rgba(0,183,255,0.1)]"
                : "border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03]"
            }`}
            onClick={() => setActiveIndex(i)}
          >
            {/* Gradient bar */}
            <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${tool.gradient} mb-4 transition-all duration-500 ${
              activeIndex === i ? "w-full" : "w-12"
            }`} />

            <h3 className="text-sm font-bold text-white mb-1">{tool.name}</h3>
            <p className="text-[10px] text-neutral-500 leading-relaxed">{tool.desc}</p>

            {/* Active indicator */}
            {activeIndex === i && (
              <motion.div
                layoutId="active-tool"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00B7FF] shadow-[0_0_10px_rgba(0,183,255,0.5)]"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        className="text-center mt-12"
      >
        <p className="text-xs text-neutral-600 uppercase tracking-[0.2em]">
          + 23 more agents including Email Sequences, Reputation AI, Social Router, Content Calendar, and more
        </p>
      </motion.div>
    </section>
  );
}
