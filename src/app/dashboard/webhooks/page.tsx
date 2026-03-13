"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Webhook, Plus, Zap, Flame, FileText, Users, DollarSign, Bell, Send, Shield, Globe, ChevronRight, CheckCircle2, Trash2 } from "lucide-react";

const TRIGGERS = [
  { id: "new_lead", label: "New Lead Scored", icon: Users, color: "#6c63ff", desc: "When a new lead enters the pipeline" },
  { id: "sale", label: "New Sale", icon: DollarSign, color: "#00ff88", desc: "When Stripe webhook confirms a payment" },
  { id: "campaign_kill", label: "Campaign Killed", icon: Flame, color: "#ff3366", desc: "When Ghost Mode kills a low-ROAS campaign" },
  { id: "report_ready", label: "Report Generated", icon: FileText, color: "#00d4ff", desc: "When a client report is generated" },
  { id: "hot_lead", label: "Hot Lead Detected", icon: Zap, color: "#f59e0b", desc: "When a lead scores 70+ (hot tier)" },
  { id: "competitor_alert", label: "Competitor Alert", icon: Shield, color: "#ef4444", desc: "When War Room detects a competitor move" },
];

const ACTIONS = [
  { id: "slack", label: "Send to Slack", icon: Bell, color: "#4A154B" },
  { id: "email", label: "Send Email", icon: Send, color: "#6c63ff" },
  { id: "telegram", label: "Telegram Alert", icon: Send, color: "#0088cc" },
  { id: "webhook", label: "HTTP Webhook", icon: Globe, color: "#00d4ff" },
  { id: "pipeline", label: "Run Pipeline", icon: Zap, color: "#00ff88" },
];

interface Hook { id: string; trigger: string; action: string; url: string; active: boolean }

export default function WebhooksPage() {
  const [hooks, setHooks] = useState<Hook[]>([
    { id: "wh_1", trigger: "new_lead", action: "telegram", url: "https://api.telegram.org/bot...", active: true },
    { id: "wh_2", trigger: "sale", action: "slack", url: "https://hooks.slack.com/services/...", active: true },
    { id: "wh_3", trigger: "campaign_kill", action: "email", url: "admin@yourdomain.com", active: false },
  ]);
  const [creating, setCreating] = useState(false);
  const [newTrigger, setNewTrigger] = useState("");
  const [newAction, setNewAction] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addHook = () => {
    if (!newTrigger || !newAction) return;
    setHooks(h => [...h, { id: `wh_${Date.now()}`, trigger: newTrigger, action: newAction, url: newUrl, active: true }]);
    setCreating(false); setNewTrigger(""); setNewAction(""); setNewUrl("");
  };

  const toggle = (id: string) => setHooks(h => h.map(x => x.id === id ? { ...x, active: !x.active } : x));
  const remove = (id: string) => setHooks(h => h.filter(x => x.id !== id));

  const getTrigger = (id: string) => TRIGGERS.find(t => t.id === id);
  const getAction = (id: string) => ACTIONS.find(a => a.id === id);

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Webhook className="w-3 h-3" /> Automations
          </div>
          <h1 className="text-2xl font-bold serif-text text-white">Webhook Marketplace</h1>
          <p className="text-sm text-text-secondary mt-1">Connect UMBRA to your stack. When X happens → do Y.</p>
        </div>
        <button onClick={() => setCreating(true)} className="px-4 py-2 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Webhook
        </button>
      </div>

      {/* Active Webhooks */}
      <div className="space-y-3 mb-8">
        {hooks.map((h, i) => {
          const trigger = getTrigger(h.trigger);
          const action = getAction(h.action);
          if (!trigger || !action) return null;
          return (
            <motion.div key={h.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`glass-card p-4 flex items-center gap-4 transition-all ${h.active ? "" : "opacity-50"}`}>
              <div className="p-2 rounded-lg" style={{ background: `${trigger.color}15` }}>
                <trigger.icon className="w-4 h-4" style={{ color: trigger.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{trigger.label}</p>
                <p className="text-[10px] text-text-secondary">{trigger.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-text-secondary" />
              <div className="p-2 rounded-lg" style={{ background: `${action.color}15` }}>
                <action.icon className="w-4 h-4" style={{ color: action.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{action.label}</p>
                <p className="text-[10px] text-text-secondary truncate max-w-[150px]">{h.url}</p>
              </div>
              <button onClick={() => toggle(h.id)} className={`w-10 h-5 rounded-full transition-all relative ${h.active ? "bg-emerald-500" : "bg-glass-border"}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${h.active ? "left-5" : "left-0.5"}`} />
              </button>
              <button onClick={() => remove(h.id)} className="p-1.5 rounded-lg hover:bg-glass-bg transition-colors">
                <Trash2 className="w-3.5 h-3.5 text-text-secondary" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Create New Webhook */}
      {creating && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 border-electric/30">
          <h3 className="text-xs font-bold uppercase tracking-widest text-electric mb-4">Create Webhook</h3>
          <div className="mb-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2 block">When this happens...</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {TRIGGERS.map(t => (
                <button key={t.id} onClick={() => setNewTrigger(t.id)}
                  className={`p-3 rounded-xl text-left transition-all flex items-center gap-2 ${newTrigger === t.id ? "glass-card border-electric/40" : "bg-onyx/50 border border-glass-border hover:border-glass-border/80"}`}>
                  <t.icon className="w-3.5 h-3.5" style={{ color: t.color }} />
                  <span className="text-[10px] font-bold">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2 block">Do this...</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {ACTIONS.map(a => (
                <button key={a.id} onClick={() => setNewAction(a.id)}
                  className={`p-3 rounded-xl text-center transition-all ${newAction === a.id ? "glass-card border-electric/40" : "bg-onyx/50 border border-glass-border"}`}>
                  <a.icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: a.color }} />
                  <span className="text-[10px] font-bold">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1 block">Destination URL / Email</label>
            <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://hooks.slack.com/services/..."
              className="w-full bg-onyx border border-glass-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-secondary/30 focus:outline-none focus:border-electric/50" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCreating(false)} className="px-4 py-2 border border-glass-border text-white rounded-xl hover:bg-glass-bg transition-all text-sm">Cancel</button>
            <button onClick={addHook} disabled={!newTrigger || !newAction}
              className="flex-1 py-2 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Create Webhook
            </button>
          </div>
        </motion.div>
      )}

      {/* Available Triggers Reference */}
      {!creating && (
        <div className="glass-card p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">Available Triggers</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {TRIGGERS.map(t => (
              <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg bg-onyx/30">
                <t.icon className="w-3 h-3" style={{ color: t.color }} />
                <span className="text-[10px] text-text-secondary">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
