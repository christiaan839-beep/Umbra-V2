"use client";

import React, { useState } from "react";
import { PenTool, Loader2, Sparkles, Copy, CheckCircle2, FileText, MessageCircle, Video, Mail, Twitter, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PdfExportButton from "@/components/ui/PdfExportButton";

const CONTENT_TYPES = [
  { value: "blog", label: "Blog Post", icon: FileText, desc: "SEO-optimized long-form (1200-1800 words)", color: "from-blue-500 to-cyan-500" },
  { value: "social-pack", label: "7-Day Content Calendar", icon: MessageCircle, desc: "Platform-native daily posts for a week", color: "from-pink-500 to-rose-500" },
  { value: "video-script", label: "Video Script", icon: Video, desc: "Timestamped script with visual direction", color: "from-purple-500 to-violet-500" },
  { value: "newsletter", label: "Newsletter Issue", icon: Mail, desc: "Complete email with subject line A/B", color: "from-amber-500 to-orange-500" },
  { value: "thread", label: "Twitter/X Thread", icon: Twitter, desc: "8-12 tweet viral thread", color: "from-sky-500 to-blue-500" },
];

const VOICE_OPTIONS = [
  { value: "authority", label: "Authority", desc: "Data-driven expert. Bloomberg meets tech CEO." },
  { value: "conversational", label: "Conversational", desc: "Smart friend giving advice over coffee." },
  { value: "provocative", label: "Provocative", desc: "Contrarian takes. Starts arguments. Goes viral." },
  { value: "educational", label: "Educational", desc: "Best teacher you ever had. Analogies + aha moments." },
  { value: "storyteller", label: "Storyteller", desc: "Narrative arcs. Protagonist, conflict, resolution." },
];

const PLATFORMS = [
  { value: "blog", label: "Blog/Website" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter/X" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "newsletter", label: "Newsletter" },
];

export default function OrganicContentPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ content: string; qualityScore: Record<string, unknown>; metadata: Record<string, unknown> } | null>(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    contentType: "blog",
    topic: "",
    platform: "blog",
    voice: "conversational",
    targetAudience: "",
    brandContext: "",
    keywords: "",
  });

  const generate = async () => {
    if (!form.topic) return;
    setIsGenerating(true);
    setResult(null);
    try {
      const res = await fetch("/api/agents/organic-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          keywords: form.keywords ? form.keywords.split(",").map(k => k.trim()) : [],
        })
      });
      const data = await res.json();
      if (data.success) setResult(data);
    } catch (e) { console.error(e); }
    finally { setIsGenerating(false); }
  };

  const copyContent = () => {
    if (result?.content) {
      navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const scores = (result?.qualityScore as Record<string, unknown>)?.scores as Record<string, number> | undefined;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <PenTool className="w-3 h-3" /> Anti-Slop Engine
        </div>
        <h1 className="text-3xl font-bold serif-text text-white">Organic Content Studio</h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl">
          Generate premium content that doesn&apos;t read like AI slop. Every piece goes through a 3-pass system: generate → quality score → auto-revise. Powered by Google Gemini 2.0 Pro with banned-phrase detection and platform-native formatting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration */}
        <div className="lg:col-span-1 space-y-4">
          {/* Content Type */}
          <div className="glass-card p-5 border border-glass-border">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Content Type</label>
            <div className="space-y-2">
              {CONTENT_TYPES.map(type => (
                <button key={type.value} onClick={() => setForm({...form, contentType: type.value, platform: type.value === "blog" ? "blog" : type.value === "thread" ? "twitter" : form.platform})}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm border transition-all flex items-center gap-3 ${form.contentType === type.value ? "bg-emerald-500/10 border-emerald-500/30 text-white" : "bg-onyx/30 border-glass-border text-text-secondary hover:text-white"}`}>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0`}>
                    <type.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="font-bold block">{type.label}</span>
                    <span className="text-[10px] opacity-60">{type.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice */}
          <div className="glass-card p-5 border border-glass-border">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Voice / Tone</label>
            <div className="space-y-2">
              {VOICE_OPTIONS.map(v => (
                <button key={v.value} onClick={() => setForm({...form, voice: v.value})}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-all ${form.voice === v.value ? "bg-electric/10 border-electric/30 text-white" : "bg-onyx/30 border-glass-border text-text-secondary hover:text-white"}`}>
                  <span className="font-bold">{v.label}</span>
                  <span className="text-[10px] block mt-0.5 opacity-60">{v.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Platform (for social content) */}
          {(form.contentType === "social-pack" || form.contentType === "video-script") && (
            <div className="glass-card p-5 border border-glass-border">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => (
                  <button key={p.value} onClick={() => setForm({...form, platform: p.value})}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${form.platform === p.value ? "bg-electric/10 border-electric/30 text-white" : "bg-onyx/30 border-glass-border text-text-secondary"}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Input + Output */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5 border border-glass-border space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Topic / Subject</label>
              <input type="text" value={form.topic} onChange={e => setForm({...form, topic: e.target.value})}
                placeholder="e.g. Why cold exposure is the most underrated productivity hack for CEOs"
                className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Target Audience</label>
              <input type="text" value={form.targetAudience} onChange={e => setForm({...form, targetAudience: e.target.value})}
                placeholder="e.g. Male professionals aged 28-45 who prioritize performance"
                className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Brand Context</label>
                <input type="text" value={form.brandContext} onChange={e => setForm({...form, brandContext: e.target.value})}
                  placeholder="e.g. Premium biohacking coaching"
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Keywords <span className="opacity-40">(comma-separated)</span></label>
                <input type="text" value={form.keywords} onChange={e => setForm({...form, keywords: e.target.value})}
                  placeholder="e.g. cold exposure, productivity, CEO"
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-400" />
              </div>
            </div>

            <button onClick={generate} disabled={isGenerating || !form.topic}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl px-4 py-3 text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50">
              {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating (3-pass anti-slop system)...</> : <><Sparkles className="w-4 h-4" /> Generate Premium Content</>}
            </button>
          </div>

          {/* Quality Score */}
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Score Card */}
                <div className="glass-card p-4 border border-glass-border mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-400" /> Quality Score
                    </h3>
                    <span className={`text-lg font-bold font-mono ${(result.qualityScore as Record<string, number>)?.overallScore >= 7 ? "text-emerald-400" : "text-amber-400"}`}>
                      {String((result.qualityScore as Record<string, number>)?.overallScore || "N/A")}/10
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {scores && Object.entries(scores).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <div className={`text-lg font-bold font-mono ${val >= 7 ? "text-emerald-400" : val >= 5 ? "text-amber-400" : "text-rose-400"}`}>{val}</div>
                        <div className="text-[9px] text-text-secondary uppercase tracking-widest">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                      </div>
                    ))}
                  </div>
                  {(result.metadata as Record<string, boolean>)?.wasRevised && (
                    <div className="mt-3 text-[10px] text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Content was auto-revised to improve quality
                    </div>
                  )}
                </div>

                {/* Content Output */}
                <div className="glass-card border border-glass-border overflow-hidden" id="report-content">
                  <div className="p-4 border-b border-glass-border flex items-center justify-between bg-onyx/20">
                    <h3 className="text-sm font-bold text-white">Generated Content</h3>
                    <div className="flex items-center gap-2">
                      <PdfExportButton fileName={`${form.contentType}_${form.topic.slice(0, 20)}`} />
                      <button onClick={copyContent} className="flex items-center gap-1 text-xs text-electric hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-electric/10 border border-electric/20">
                        {copied ? <><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                      </button>
                    </div>
                  </div>
                  <div className="p-6 prose prose-invert prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm text-neutral-300 leading-relaxed">{result.content}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
