"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, MessageSquare, Send, Loader2, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";

// Terminal simulation lines
const TERMINAL_LINES = [
  { text: "$ umbra scan --target competitor1.com competitor2.com competitor3.com", type: "cmd" as const, delay: 0 },
  { text: "⚡ Initializing UMBRA Gap Killer v2.6...", type: "sys" as const, delay: 800 },
  { text: "🔍 Scanning competitor1.com via Tavily Live Search...", type: "sys" as const, delay: 1500 },
  { text: "   ├── Schema: ❌ Missing LocalBusiness JSON-LD", type: "data" as const, delay: 2200 },
  { text: "   ├── Blog frequency: 2 posts/month (LOW)", type: "data" as const, delay: 2700 },
  { text: "   └── Trust signals: No reviews widget, no HIPAA badge", type: "warn" as const, delay: 3200 },
  { text: "🔍 Scanning competitor2.com via Tavily Live Search...", type: "sys" as const, delay: 3800 },
  { text: "   ├── Schema: ✅ Has LocalBusiness (incomplete)", type: "data" as const, delay: 4400 },
  { text: "   ├── Blog frequency: 0 posts/month (DEAD)", type: "warn" as const, delay: 4900 },
  { text: "   └── Keywords missing: 'emergency dentist', 'same-day crown'", type: "data" as const, delay: 5400 },
  { text: "🔍 Scanning competitor3.com...", type: "sys" as const, delay: 6000 },
  { text: "   ├── Schema: ❌ None", type: "data" as const, delay: 6500 },
  { text: "   └── Mobile score: 34/100 ⚠️ CRITICAL", type: "warn" as const, delay: 7000 },
  { text: "", type: "sys" as const, delay: 7500 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", type: "sys" as const, delay: 7600 },
  { text: "✅ ANALYSIS COMPLETE — 14 exploitable gaps found", type: "success" as const, delay: 8000 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", type: "sys" as const, delay: 8100 },
  { text: "", type: "sys" as const, delay: 8200 },
  { text: "🎯 TOP 5 BLOG TOPICS TO STEAL THEIR TRAFFIC:", type: "success" as const, delay: 8500 },
  { text: "   1. \"Emergency Dentist Near Me: What to Do at 2 AM\"", type: "data" as const, delay: 9000 },
  { text: "   2. \"Same-Day Crowns vs Traditional: 2026 Cost Guide\"", type: "data" as const, delay: 9500 },
  { text: "   3. \"Is Your Dentist HIPAA Compliant? Red Flags to Watch\"", type: "data" as const, delay: 10000 },
  { text: "   4. \"Invisalign vs Braces: Real Patient Cost Comparison\"", type: "data" as const, delay: 10500 },
  { text: "   5. \"Why Google Reviews Matter More Than Your Website\"", type: "data" as const, delay: 11000 },
  { text: "", type: "sys" as const, delay: 11200 },
  { text: "📊 Estimated traffic capture: +4,200 visits/month", type: "success" as const, delay: 11500 },
  { text: "💰 Projected lead value: $12,600/month", type: "success" as const, delay: 12000 },
  { text: "🚀 Deploying SEO pages to /locations/dentist/[city]...", type: "sys" as const, delay: 12500 },
  { text: "   ✅ Generated: /locations/dental-marketing/dallas", type: "success" as const, delay: 13000 },
  { text: "   ✅ Generated: /locations/dental-marketing/houston", type: "success" as const, delay: 13300 },
  { text: "   ✅ Generated: /locations/dental-marketing/austin", type: "success" as const, delay: 13600 },
  { text: "", type: "sys" as const, delay: 14000 },
  { text: "🧠 Storing optimizations in God-Brain memory...", type: "sys" as const, delay: 14300 },
  { text: "✅ UMBRA cycle complete. 14 gaps exploited. 3 pages deployed. 0 humans needed.", type: "success" as const, delay: 15000 },
];

const WhatsAppSim = [
  { from: "lead", text: "Hey, I saw your ad about dental marketing. How much does it cost?", delay: 0 },
  { from: "umbra", text: "Great question! Our AI handles everything — SEO, ads, patient bookings. Most practices see 40+ new patients/month within 90 days. Can I ask what city you're in?", delay: 2000 },
  { from: "lead", text: "I'm in Dallas. We currently spend $3k/month with an agency and barely get 10 new patients", delay: 5000 },
  { from: "umbra", text: "Dallas is one of our strongest markets. Our AI found 14 competitor gaps there yesterday. We had a practice switch from their agency and go from 10 to 47 new patients in 60 days. Want me to run a free competitor scan for your practice?", delay: 8000 },
  { from: "lead", text: "That would be amazing. Yes please", delay: 11000 },
  { from: "umbra", text: "Perfect 🔥 I'll have the full report in your inbox in 3 minutes. Can you share your practice name and the top 3 competitors you're worried about? I'll show you exactly where they're vulnerable.", delay: 13000 },
];

export default function DemoPage() {
  const [activeView, setActiveView] = useState<"terminal" | "whatsapp">("terminal");
  const [terminalLines, setTerminalLines] = useState<typeof TERMINAL_LINES>([]);
  const [whatsappMessages, setWhatsAppMessages] = useState<typeof WhatsAppSim>([]);
  const [isRunning, setIsRunning] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);
  const whatsappRef = useRef<HTMLDivElement>(null);

  // Terminal animation
  useEffect(() => {
    if (activeView !== "terminal") return;
    setTerminalLines([]);
    setIsRunning(true);
    const timers: ReturnType<typeof setTimeout>[] = [];
    TERMINAL_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setTerminalLines(prev => [...prev, line]);
        if (i === TERMINAL_LINES.length - 1) setIsRunning(false);
      }, line.delay));
    });
    return () => timers.forEach(clearTimeout);
  }, [activeView]);

  // WhatsApp animation
  useEffect(() => {
    if (activeView !== "whatsapp") return;
    setWhatsAppMessages([]);
    const timers: ReturnType<typeof setTimeout>[] = [];
    WhatsAppSim.forEach((msg, i) => {
      timers.push(setTimeout(() => {
        setWhatsAppMessages(prev => [...prev, msg]);
      }, msg.delay));
    });
    return () => timers.forEach(clearTimeout);
  }, [activeView]);

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [terminalLines]);

  useEffect(() => {
    whatsappRef.current?.scrollTo(0, whatsappRef.current.scrollHeight);
  }, [whatsappMessages]);

  const getLineColor = (type: string) => {
    switch (type) {
      case "cmd": return "text-cyan-400";
      case "sys": return "text-gray-400";
      case "data": return "text-gray-300";
      case "warn": return "text-amber-400";
      case "success": return "text-emerald-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-midnight flex flex-col">
      <header className="border-b border-glass-border px-6 py-4 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-electric to-rose-glow flex items-center justify-center text-[10px] font-bold text-white">U</div>
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-white">UMBRA Live Demo</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-text-secondary uppercase tracking-widest">Autonomous AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveView("terminal")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeView === "terminal" ? "bg-white text-midnight" : "glass-card text-text-secondary hover:text-white"}`}>
            <Terminal className="w-3.5 h-3.5" /> Competitor Scan
          </button>
          <button onClick={() => setActiveView("whatsapp")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeView === "whatsapp" ? "bg-emerald-400 text-midnight" : "glass-card text-text-secondary hover:text-white"}`}>
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Closer
          </button>
        </div>

        {/* Terminal View */}
        {activeView === "terminal" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl rounded-2xl border border-glass-border overflow-hidden shadow-[0_0_60px_rgba(45,110,255,0.15)]">
            {/* Terminal Header */}
            <div className="bg-onyx/80 px-4 py-3 flex items-center gap-3 border-b border-glass-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] text-text-secondary font-mono uppercase tracking-wider">umbra — gap-killer v2.6 — live scan</span>
              {isRunning && <Loader2 className="w-3 h-3 text-electric animate-spin ml-auto" />}
            </div>
            {/* Terminal Body */}
            <div ref={terminalRef} className="bg-[#0d0d12] p-5 h-[500px] overflow-y-auto font-mono text-sm">
              <AnimatePresence>
                {terminalLines.map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
                    className={`${getLineColor(line.type)} leading-relaxed ${line.text === "" ? "h-3" : ""}`}>
                    {line.text}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isRunning && (
                <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1 mt-1" />
              )}
            </div>
          </motion.div>
        )}

        {/* WhatsApp View */}
        {activeView === "whatsapp" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg rounded-2xl border border-emerald-400/20 overflow-hidden shadow-[0_0_60px_rgba(0,255,136,0.1)]">
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-300/20 flex items-center justify-center text-emerald-200 text-xs font-bold">U</div>
              <div>
                <p className="text-white text-sm font-medium">UMBRA AI Closer</p>
                <p className="text-emerald-200/60 text-[10px]">online • autonomous mode</p>
              </div>
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            {/* WhatsApp Body */}
            <div ref={whatsappRef} className="bg-[#0b141a] p-4 h-[500px] overflow-y-auto space-y-3" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}>
              <AnimatePresence>
                {whatsappMessages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.3 }}
                    className={`flex ${msg.from === "lead" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.from === "lead"
                        ? "bg-[#005c4b] text-white rounded-br-sm"
                        : "bg-[#1f2c33] text-gray-200 rounded-bl-sm"
                    }`}>
                      {msg.from === "umbra" && (
                        <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider mb-1">🤖 UMBRA AI</p>
                      )}
                      {msg.text}
                      <p className="text-[9px] text-gray-500 text-right mt-1">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* Input bar */}
            <div className="bg-[#1f2c33] px-4 py-3 flex items-center gap-2 border-t border-gray-700/30">
              <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-sm text-gray-500">UMBRA is responding autonomously...</div>
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center">
                <Send className="w-4 h-4 text-white" />
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="mt-8 text-center">
          <p className="text-text-secondary text-sm mb-4">This is running live. Every scan is real. Every reply is AI-generated.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-electric to-rose-glow text-white font-bold shadow-[0_0_30px_rgba(45,110,255,0.4)] hover:shadow-[0_0_50px_rgba(45,110,255,0.6)] transition-all group">
            Deploy UMBRA For Your Business
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
