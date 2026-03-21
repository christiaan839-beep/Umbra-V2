"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Brain, Target, Shield, Globe, MessageSquare, CreditCard, Send, Eye } from "lucide-react";

interface ActivityEvent {
  id: string;
  agent: string;
  action: string;
  icon: typeof Zap;
  color: string;
  timestamp: Date;
}

const AGENT_EVENTS = [
  { agent: "NemoClaw", action: "Executed browser automation — scraped 47 competitor pricing pages", icon: Globe, color: "text-emerald-400" },
  { agent: "Kilo-Writer", action: "Generated 3,200-word SEO article for client #0042", icon: Brain, color: "text-violet-400" },
  { agent: "Ghost Fleet", action: "Dispatched personalized outbound to 12 qualified leads", icon: Send, color: "text-blue-400" },
  { agent: "War Room", action: "Completed OSINT audit on competitor — found 8 conversion gaps", icon: Target, color: "text-orange-400" },
  { agent: "Morpheus Shield", action: "Blocked PII exposure attempt — redacted 3 sensitive fields", icon: Shield, color: "text-red-400" },
  { agent: "Visual Studio", action: "Rendered 4K product mockup with NVIDIA Edify 3D", icon: Eye, color: "text-pink-400" },
  { agent: "PayFast Gateway", action: "Processed R24,997 subscription — Array license activated", icon: CreditCard, color: "text-green-400" },
  { agent: "Telegram Uplink", action: "Commander dispatch received — routing to Smart Router", icon: MessageSquare, color: "text-cyan-400" },
  { agent: "Nemotron 70B", action: "Inference complete — 2,100 tokens in 340ms (TensorRT-LLM)", icon: Zap, color: "text-yellow-400" },
  { agent: "ABM Artillery", action: "Identified 23 high-intent prospects via LinkedIn signals", icon: Target, color: "text-indigo-400" },
  { agent: "Email Drip", action: "Day-2 onboarding email sent to client@domain.com", icon: Send, color: "text-teal-400" },
  { agent: "God-Eye Array", action: "Spatial detection — 4 objects tracked across 2 RTSP feeds", icon: Eye, color: "text-amber-400" },
];

export function LiveActivityFeed({ maxEvents = 8 }: { maxEvents?: number }) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Seed with 3 initial events
    const initial = Array.from({ length: 3 }, (_, i) => {
      const template = AGENT_EVENTS[i % AGENT_EVENTS.length];
      return { ...template, id: `init-${i}`, timestamp: new Date(Date.now() - (3 - i) * 4000) };
    });
    setEvents(initial);

    // Add new event every 3-7 seconds
    const interval = setInterval(() => {
      const template = AGENT_EVENTS[Math.floor(Math.random() * AGENT_EVENTS.length)];
      const newEvent: ActivityEvent = {
        ...template,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
      };
      setEvents(prev => [newEvent, ...prev].slice(0, maxEvents));
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, [maxEvents]);

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  return (
    <div ref={feedRef} className="space-y-2 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono">Live Activity Feed</span>
        </div>
        <span className="text-[10px] text-neutral-600 font-mono">{events.length} events</span>
      </div>
      
      <AnimatePresence mode="popLayout">
        {events.map((event) => (
          <motion.div
            key={event.id}
            layout
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group"
          >
            <div className={`w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center flex-shrink-0 ${event.color}`}>
              <event.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${event.color}`}>{event.agent}</span>
                <span className="text-[10px] text-neutral-700 font-mono">{timeAgo(event.timestamp)}</span>
              </div>
              <p className="text-xs text-neutral-400 truncate">{event.action}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
