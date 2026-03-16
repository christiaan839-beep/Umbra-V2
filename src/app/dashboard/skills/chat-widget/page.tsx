"use client";

import React, { useState } from "react";
import { MessageSquare, Copy, CheckCircle2, ExternalLink, Palette, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

export default function ChatWidgetPage() {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  const [config, setConfig] = useState({
    color: "#00B7FF",
    position: "right",
    greeting: "Hi there! 👋 How can I help you today?",
    businessDescription: "",
  });

  const ownerEmail = user?.primaryEmailAddress?.emailAddress || "your-email@example.com";
  const domain = typeof window !== "undefined" ? window.location.origin : "https://your-domain.vercel.app";

  const embedCode = `<script src="${domain}/widget.js" data-umbra-owner="${ownerEmail}" data-umbra-color="${config.color}" data-umbra-position="${config.position}" data-umbra-greeting="${config.greeting}" data-umbra-business="${config.businessDescription}"></script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-3">
          <MessageSquare className="w-3 h-3" /> Embeddable Widget
        </div>
        <h1 className="text-3xl font-bold serif-text text-white">AI Chat Widget</h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl">
          Paste one line of code on any website and get an AI-powered chat agent that qualifies leads, collects contact info, and books appointments — automatically feeding into your Booking Agent pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration */}
        <div className="space-y-6">
          <div className="glass-card p-6 border border-glass-border">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
              <Palette className="w-4 h-4 text-electric" /> Widget Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Brand Color</label>
                <div className="flex gap-3">
                  {["#00B7FF", "#10b981", "#f43f5e", "#8b5cf6", "#f59e0b", "#ec4899"].map(c => (
                    <button key={c} onClick={() => setConfig({...config, color: c})}
                      className={`w-10 h-10 rounded-xl border-2 transition-all ${config.color === c ? "border-white scale-110" : "border-transparent"}`}
                      style={{ background: c }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Widget Position</label>
                <div className="flex gap-3">
                  {["right", "left"].map(pos => (
                    <button key={pos} onClick={() => setConfig({...config, position: pos})}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${config.position === pos ? "bg-electric/10 border-electric/30 text-white" : "bg-onyx/50 border-glass-border text-text-secondary"}`}>
                      {pos.charAt(0).toUpperCase() + pos.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Greeting Message</label>
                <input type="text" value={config.greeting} onChange={e => setConfig({...config, greeting: e.target.value})}
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-electric" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Business Description <span className="text-text-secondary/50">(helps AI context)</span></label>
                <textarea value={config.businessDescription} onChange={e => setConfig({...config, businessDescription: e.target.value})}
                  placeholder="e.g. Premium biohacking coaching for professionals..." rows={3}
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-electric" />
              </div>
            </div>
          </div>

          {/* Embed Code */}
          <div className="glass-card p-6 border border-electric/20 bg-electric/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-4 h-4 text-electric" /> Embed Code
              </h3>
              <button onClick={copyCode} className="flex items-center gap-2 text-xs text-electric hover:text-white transition-colors">
                {copied ? <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Code</>}
              </button>
            </div>
            <div className="bg-black/50 rounded-xl p-4 font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto">
              <code className="break-all">{embedCode}</code>
            </div>
            <p className="text-[10px] text-text-secondary mt-3">
              Paste this before the closing <code className="text-electric">&lt;/body&gt;</code> tag on any website. The widget will appear automatically.
            </p>
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <div className="glass-card border border-glass-border overflow-hidden h-full">
            <div className="p-4 border-b border-glass-border bg-onyx/20 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-electric" /> Live Preview
              </h3>
              <span className="text-[10px] text-text-secondary font-mono">{domain}</span>
            </div>
            <div className="relative bg-neutral-900 min-h-[500px] p-6 flex flex-col items-center justify-center">
              {/* Simulated website content */}
              <div className="w-full max-w-sm space-y-4 opacity-30">
                <div className="h-4 bg-neutral-700 rounded w-3/4" />
                <div className="h-3 bg-neutral-800 rounded w-full" />
                <div className="h-3 bg-neutral-800 rounded w-5/6" />
                <div className="h-3 bg-neutral-800 rounded w-2/3" />
                <div className="h-20 bg-neutral-800 rounded-xl w-full mt-6" />
                <div className="h-3 bg-neutral-800 rounded w-full" />
                <div className="h-3 bg-neutral-800 rounded w-4/5" />
              </div>

              {/* Chat Bubble Preview */}
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-6 flex items-center justify-center w-14 h-14 rounded-full shadow-lg cursor-pointer"
                style={{ background: config.color, [config.position]: "24px", boxShadow: `0 4px 24px ${config.color}33` }}>
                <MessageSquare className="w-6 h-6 text-white" />
              </motion.div>

              {/* Chat Panel Preview */}
              <div className="absolute bottom-24 w-80 bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
                style={{ [config.position]: "24px" }}>
                <div className="p-3 bg-[#111] border-b border-white/5 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-white">AI Assistant</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-[#1a1a1a] rounded-2xl rounded-bl-sm p-3 text-xs text-neutral-300 max-w-[85%]">
                    {config.greeting}
                  </div>
                  <div className="rounded-2xl rounded-br-sm p-3 text-xs text-white max-w-[85%] ml-auto" style={{ background: config.color }}>
                    I need help with marketing
                  </div>
                  <div className="bg-[#1a1a1a] rounded-2xl rounded-bl-sm p-3 text-xs text-neutral-300 max-w-[85%]">
                    Great to hear! What kind of business are you running?
                  </div>
                </div>
                <div className="p-3 border-t border-white/5 flex gap-2">
                  <div className="flex-1 h-9 bg-[#1a1a1a] rounded-xl border border-white/5" />
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: config.color }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
