"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe2, Sparkles, Code, Eye, Copy, CheckCircle2 } from "lucide-react";

export default function PageBuilderPage() {
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [offer, setOffer] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!businessName || !offer) return;
    setGenerating(true);
    setGeneratedHtml(null);

    try {
      const res = await fetch("/api/agents/page-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, businessType: industry, offer, style: "Dark, premium, modern", cta: "Get Started" }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedHtml(data.page);
      }
    } catch (err) {
      console.error("Page generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedHtml) {
      navigator.clipboard.writeText(generatedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Globe2 className="w-3 h-3" /> Page Builder
        </div>
        <h1 className="text-3xl font-bold font-mono text-white tracking-tight">Landing Page Builder</h1>
        <p className="text-sm text-[#8A95A5] mt-2 font-mono uppercase tracking-widest">
          Gemini 2.5 Pro generates production-ready landing pages in seconds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="glass-card border border-glass-border p-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#5C667A] mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" /> Page Configuration
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5C667A] mb-2">Business Name *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., NeuroStack Labs"
                className="w-full bg-black/60 border border-glass-border rounded-lg px-4 py-3 text-sm text-white font-mono focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5C667A] mb-2">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Biohacking, SaaS, Fitness"
                className="w-full bg-black/60 border border-glass-border rounded-lg px-4 py-3 text-sm text-white font-mono focus:border-violet-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5C667A] mb-2">Offer / CTA *</label>
              <textarea
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="e.g., Free 30-minute strategy session for CEOs who want 10x productivity"
                rows={3}
                className="w-full bg-black/60 border border-glass-border rounded-lg px-4 py-3 text-sm text-white font-mono focus:border-violet-500/50 outline-none transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5C667A] mb-2">Target Audience</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Startup founders, 25-45, tech-savvy"
                className="w-full bg-black/60 border border-glass-border rounded-lg px-4 py-3 text-sm text-white font-mono focus:border-violet-500/50 outline-none transition-all"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={!businessName || !offer || generating}
              className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-lg flex justify-center items-center gap-2 transition-all shadow-[0_0_25px_rgba(139,92,246,0.3)]"
            >
              {generating ? (
                <><Sparkles className="w-4 h-4 animate-spin" /> Generating with Gemini...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Landing Page</>
              )}
            </button>
          </div>
        </div>

        {/* Preview / Code */}
        <div className="lg:col-span-2 glass-card border border-glass-border overflow-hidden flex flex-col" style={{ minHeight: "600px" }}>
          <div className="px-4 py-3 border-b border-glass-border bg-black/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("preview")}
                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                  viewMode === "preview" ? "bg-violet-600 text-white" : "text-[#5C667A] hover:text-white"
                }`}
              >
                <Eye className="w-3 h-3 inline mr-1" /> Preview
              </button>
              <button
                onClick={() => setViewMode("code")}
                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                  viewMode === "code" ? "bg-violet-600 text-white" : "text-[#5C667A] hover:text-white"
                }`}
              >
                <Code className="w-3 h-3 inline mr-1" /> Code
              </button>
            </div>
            {generatedHtml && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {copied ? <><CheckCircle2 className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy HTML</>}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-auto">
            {!generatedHtml && !generating && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <Globe2 className="w-16 h-16 text-[#2A2D35] mb-4" />
                <p className="text-sm text-[#5C667A] mb-2">No page generated yet.</p>
                <p className="text-xs text-[#3A3D45]">Fill in the form and click Generate to create a landing page.</p>
              </div>
            )}

            {generating && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="w-12 h-12 text-violet-400" />
                </motion.div>
                <p className="text-sm text-violet-400 mt-4 animate-pulse">Gemini 2.5 Pro is writing your page...</p>
              </div>
            )}

            {generatedHtml && viewMode === "preview" && (
              <iframe
                srcDoc={generatedHtml}
                className="w-full h-full border-0"
                title="Generated Landing Page Preview"
                sandbox="allow-scripts"
              />
            )}

            {generatedHtml && viewMode === "code" && (
              <pre className="p-6 text-xs text-emerald-400/80 font-mono leading-relaxed overflow-auto whitespace-pre-wrap">
                {generatedHtml}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
