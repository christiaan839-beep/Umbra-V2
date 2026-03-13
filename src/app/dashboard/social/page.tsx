"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Calendar, Sparkles, Loader2, CheckCircle, Copy, Globe } from "lucide-react";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#E1306C" },
  { id: "x", label: "X", color: "#1DA1F2" },
  { id: "linkedin", label: "LinkedIn", color: "#0077B5" },
] as const;

export default function SocialPage() {
  const [topic, setTopic] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);
  const [mode, setMode] = useState<"post" | "calendar">("post");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggle = (id: string) => setSelectedPlatforms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const generate = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "calendar"
            ? { action: "calendar", topic, count: 7 }
            : { action: "generate-and-post", topic, platform: selectedPlatforms[0] }
        ),
      });
      const data = await res.json();
      setResult(mode === "calendar" ? data.calendar : data.content);
    } catch {} finally { setLoading(false); }
  };

  const copy = () => {
    if (result) { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Send className="w-3 h-3" /> Multi-Platform
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">Social Command Center</h1>
        <p className="text-sm text-text-secondary mt-1">Generate, adapt, and publish — one click, all platforms.</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-3 mb-5">
        <button onClick={() => setMode("post")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === "post" ? "bg-white text-midnight" : "glass-card text-text-secondary hover:text-white"}`}>
          <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />Generate & Post
        </button>
        <button onClick={() => setMode("calendar")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === "calendar" ? "bg-white text-midnight" : "glass-card text-text-secondary hover:text-white"}`}>
          <Calendar className="w-3.5 h-3.5 inline mr-1.5" />Content Calendar
        </button>
      </div>

      {/* Platform Selector */}
      <div className="flex gap-3 mb-5">
        {PLATFORMS.map(p => (
          <button key={p.id} onClick={() => toggle(p.id)}
            className={`glass-card px-4 py-2.5 flex items-center gap-2 transition-all text-sm ${selectedPlatforms.includes(p.id) ? "border-electric/40" : ""}`}>
            <Globe className="w-3.5 h-3.5" style={{ color: selectedPlatforms.includes(p.id) ? p.color : undefined }} />
            {p.label}
            {selectedPlatforms.includes(p.id) && <CheckCircle className="w-3 h-3 text-emerald-400" />}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3 mb-6">
        <input value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === "Enter" && generate()}
          placeholder={mode === "calendar" ? "e.g. AI tools for small business" : "e.g. New product launch — eco-friendly water bottles"}
          className="flex-1 bg-onyx border border-glass-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50 placeholder-text-secondary/40" />
        <button onClick={generate} disabled={!topic.trim() || loading}
          className="px-6 py-3 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center gap-2 shrink-0">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {mode === "calendar" ? "Generate" : "Post"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-pink-400">
              {mode === "calendar" ? "📅 7-Day Calendar" : "✅ Generated Content"}
            </h3>
            <button onClick={copy} className="text-text-secondary hover:text-white transition-colors p-1.5 rounded-lg hover:bg-glass-bg">
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">{result}</pre>
        </motion.div>
      )}
    </div>
  );
}
