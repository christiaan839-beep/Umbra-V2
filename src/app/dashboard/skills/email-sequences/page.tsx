"use client";

import React, { useState, useEffect } from "react";
import { Mail, Loader2, Sparkles, ChevronDown, ChevronUp, Clock, Zap, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PdfExportButton from "@/components/ui/PdfExportButton";

interface Sequence {
  id: string;
  name: string;
  trigger: string;
  status: string;
  totalSteps: string;
}

interface Step {
  id: string;
  stepNumber: string;
  subject: string;
  body: string;
  delayDays: string;
}

const SEQUENCE_TYPES = [
  { value: "welcome", label: "Welcome / Onboarding", desc: "Warm new subscribers and build trust" },
  { value: "lead_nurture", label: "Lead Nurture", desc: "Educate and convert cold leads" },
  { value: "post_purchase", label: "Post-Purchase Upsell", desc: "Maximize customer lifetime value" },
  { value: "re_engagement", label: "Re-Engagement", desc: "Win back inactive contacts" },
  { value: "sales_launch", label: "Sales / Launch", desc: "Build hype and drive urgency" },
];

export default function EmailSequencesPage() {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSeq, setExpandedSeq] = useState<string | null>(null);
  const [steps, setSteps] = useState<Record<string, Step[]>>({});
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatedSteps, setGeneratedSteps] = useState<Step[]>([]);

  const [form, setForm] = useState({
    businessDescription: "",
    sequenceType: "lead_nurture",
    numberOfEmails: "5",
    targetAudience: "",
  });

  useEffect(() => { loadSequences(); }, []);

  const loadSequences = async () => {
    try {
      const res = await fetch("/api/agents/email-sequence");
      const data = await res.json();
      setSequences(data.sequences || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const loadSteps = async (seqId: string) => {
    if (steps[seqId]) { setExpandedSeq(expandedSeq === seqId ? null : seqId); return; }
    try {
      const res = await fetch("/api/agents/email-sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getSteps", sequenceId: seqId })
      });
      const data = await res.json();
      setSteps(prev => ({ ...prev, [seqId]: data.steps || [] }));
      setExpandedSeq(seqId);
    } catch (e) { console.error(e); }
  };

  const generate = async () => {
    if (!form.businessDescription) return;
    setIsGenerating(true);
    setGeneratedSteps([]);
    try {
      const res = await fetch("/api/agents/email-sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", ...form })
      });
      const data = await res.json();
      setGeneratedSteps(data.steps || []);
      loadSequences();
    } catch (e) { console.error(e); }
    finally { setIsGenerating(false); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Mail className="w-3 h-3" /> Drip Engine
        </div>
        <h1 className="text-3xl font-bold serif-text text-white">Email Sequence Builder</h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl">
          Generate complete multi-step email drip campaigns in seconds. Each sequence uses proven email marketing frameworks — subject lines, hooks, value delivery, and CTAs — all done by AI.
        </p>
      </div>

      {/* Generator Toggle */}
      <button onClick={() => setShowGenerator(!showGenerator)}
        className="mb-6 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl text-sm font-bold text-violet-400 hover:text-white transition-colors">
        <Plus className="w-4 h-4" /> {showGenerator ? "Hide Generator" : "Generate New Sequence"}
      </button>

      <AnimatePresence>
        {showGenerator && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
            <div className="glass-card p-6 border border-glass-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Business Description</label>
                    <textarea value={form.businessDescription} onChange={e => setForm({...form, businessDescription: e.target.value})}
                      placeholder="e.g. Premium biohacking coaching for professionals focused on sleep optimization, cold exposure, and organic nutrition."
                      rows={3} className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Target Audience</label>
                    <input type="text" value={form.targetAudience} onChange={e => setForm({...form, targetAudience: e.target.value})}
                      placeholder="e.g. Male professionals aged 28-45 who struggle with energy and focus"
                      className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-400" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Sequence Type</label>
                    <div className="space-y-2">
                      {SEQUENCE_TYPES.map(type => (
                        <button key={type.value} onClick={() => setForm({...form, sequenceType: type.value})}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-all ${form.sequenceType === type.value ? "bg-violet-500/10 border-violet-500/30 text-white" : "bg-onyx/30 border-glass-border text-text-secondary hover:text-white"}`}>
                          <span className="font-bold">{type.label}</span>
                          <span className="text-xs block mt-0.5 opacity-60">{type.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Number of Emails</label>
                    <select value={form.numberOfEmails} onChange={e => setForm({...form, numberOfEmails: e.target.value})}
                      className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none">
                      {[3, 5, 7, 10].map(n => <option key={n} value={n}>{n} Emails</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <button onClick={generate} disabled={isGenerating || !form.businessDescription}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl px-4 py-3 text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50">
                {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating {form.numberOfEmails}-Email Sequence...</> : <><Sparkles className="w-4 h-4" /> Generate Sequence</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Steps Preview */}
      <AnimatePresence>
        {generatedSteps.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 space-y-3" id="report-content">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-violet-400" /> Generated Sequence ({generatedSteps.length} emails)</h2>
              <PdfExportButton fileName="Email_Sequence" />
            </div>
            {generatedSteps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-card p-5 border border-glass-border hover:border-violet-500/20 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/10 text-violet-400 text-xs font-bold border border-violet-500/20">{step.stepNumber}</span>
                  <div className="flex items-center gap-2 text-[10px] text-text-secondary">
                    <Clock className="w-3 h-3" /> Day {step.delayDays}
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{step.subject}</h4>
                <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">{step.body}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Sequences */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-violet-400" /> Saved Sequences
        </h2>
        {isLoading ? (
          <div className="glass-card p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>
        ) : sequences.length === 0 ? (
          <div className="glass-card p-12 text-center border border-glass-border border-dashed">
            <Mail className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Sequences Yet</h3>
            <p className="text-sm text-text-secondary">Generate your first email sequence using the AI builder above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sequences.map(seq => (
              <div key={seq.id} className="glass-card border border-glass-border hover:border-violet-500/20 transition-colors overflow-hidden">
                <button onClick={() => loadSteps(seq.id)} className="w-full p-4 flex items-center justify-between text-left">
                  <div>
                    <h4 className="text-sm font-bold text-white">{seq.name}</h4>
                    <p className="text-xs text-text-secondary mt-1">{seq.totalSteps} emails &bull; Trigger: {seq.trigger} &bull; Status: <span className={seq.status === "active" ? "text-emerald-400" : "text-amber-400"}>{seq.status}</span></p>
                  </div>
                  {expandedSeq === seq.id ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
                </button>
                <AnimatePresence>
                  {expandedSeq === seq.id && steps[seq.id] && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="border-t border-glass-border overflow-hidden">
                      <div className="p-4 space-y-3">
                        {steps[seq.id].map((step) => (
                          <div key={step.id} className="bg-onyx/30 rounded-xl p-4 border border-glass-border/50">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-bold text-violet-400">Email {step.stepNumber}</span>
                              <span className="text-[10px] text-text-secondary flex items-center gap-1"><Clock className="w-3 h-3" /> Day {step.delayDays}</span>
                            </div>
                            <h5 className="text-sm font-bold text-white mb-1">{step.subject}</h5>
                            <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">{step.body}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
