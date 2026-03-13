"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Loader2, CheckCircle2, XCircle, Eye, EyeOff, ExternalLink } from "lucide-react";

interface Integration {
  id: string;
  label: string;
  icon: string;
  keys: { key: string; label: string; placeholder: string }[];
  docsUrl?: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "meta", label: "Meta Ads (Facebook / Instagram)", icon: "📘",
    keys: [
      { key: "META_ACCESS_TOKEN", label: "Access Token", placeholder: "EAAxxxxxxxx..." },
      { key: "META_AD_ACCOUNT_ID", label: "Ad Account ID", placeholder: "123456789" },
    ],
    docsUrl: "https://developers.facebook.com/docs/marketing-apis/get-started",
  },
  {
    id: "stripe", label: "Stripe Payments", icon: "💳",
    keys: [
      { key: "STRIPE_SECRET_KEY", label: "Secret Key", placeholder: "sk_live_xxxxxxxx..." },
    ],
    docsUrl: "https://dashboard.stripe.com/apikeys",
  },
  {
    id: "telegram", label: "Telegram Command Center", icon: "📱",
    keys: [
      { key: "TELEGRAM_BOT_TOKEN", label: "Bot Token", placeholder: "1234567890:AAHxxxxxxxx..." },
      { key: "TELEGRAM_ADMIN_CHAT_ID", label: "Admin Chat ID", placeholder: "123456789" },
    ],
    docsUrl: "https://core.telegram.org/bots#botfather",
  },
  {
    id: "ai", label: "AI Models", icon: "🧠",
    keys: [
      { key: "GEMINI_API_KEY", label: "Gemini API Key", placeholder: "AIzaxxxxxxxx..." },
      { key: "ANTHROPIC_API_KEY", label: "Claude API Key", placeholder: "sk-ant-xxxxxxxx..." },
    ],
  },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "load" }),
    })
      .then(r => r.json())
      .then(d => { if (d.status) setStatus(d.status); })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    const nonEmpty: Record<string, string> = {};
    Object.entries(values).forEach(([k, v]) => { if (v.trim()) nonEmpty[k] = v.trim(); });
    
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", settings: nonEmpty }),
      });
      setSaved(true);
      // Update status for saved keys
      Object.keys(nonEmpty).forEach(k => setStatus(prev => ({ ...prev, [k]: true })));
      setValues({});
      setTimeout(() => setSaved(false), 3000);
    } catch {} finally { setSaving(false); }
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-3">
          <Settings className="w-3 h-3" /> Configuration
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Connect your accounts to unlock the full power of UMBRA.</p>
      </div>

      <div className="space-y-5">
        {INTEGRATIONS.map((integration, idx) => (
          <motion.div key={integration.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
            className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">{integration.icon}</span>
                <h2 className="text-sm font-bold text-white">{integration.label}</h2>
              </div>
              <div className="flex items-center gap-2">
                {integration.keys.every(k => status[k.key]) ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Connected</span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-text-secondary font-medium"><XCircle className="w-3.5 h-3.5" /> Not Connected</span>
                )}
                {integration.docsUrl && (
                  <a href={integration.docsUrl} target="_blank" rel="noopener" className="text-text-secondary hover:text-white transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {integration.keys.map(k => (
                <div key={k.key}>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1.5 block">{k.label}</label>
                  <div className="relative">
                    <input
                      type={showKeys[k.key] ? "text" : "password"}
                      value={values[k.key] || ""}
                      onChange={e => setValues(prev => ({ ...prev, [k.key]: e.target.value }))}
                      placeholder={status[k.key] ? "••••••• (already set)" : k.placeholder}
                      className="w-full bg-onyx border border-glass-border rounded-lg p-2.5 pr-10 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:border-electric/50 transition-colors font-mono"
                    />
                    <button
                      onClick={() => setShowKeys(prev => ({ ...prev, [k.key]: !prev[k.key] }))}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
                    >
                      {showKeys[k.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleSave} disabled={saving || Object.values(values).every(v => !v.trim())}
          className="px-8 py-3 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save All Settings"}
        </button>
        {saved && (
          <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="text-sm text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Settings saved successfully
          </motion.span>
        )}
      </div>

      <div className="mt-8 glass-card p-4 border-amber-500/20 bg-amber-500/5">
        <p className="text-xs text-amber-400 font-medium">
          🔒 API keys are stored securely and never exposed to the frontend. For production, set these in your Vercel Dashboard → Environment Variables for persistent storage across deployments.
        </p>
      </div>
    </div>
  );
}
