"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Plus, Instagram, Youtube, Clock, CheckCircle2, Send, Image } from "lucide-react";

type ContentItem = {
  id: string;
  topic: string;
  caption?: string;
  platform: string;
  scheduledAt: string;
  status: string;
  imagePrompt?: string;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PLATFORM_CONFIG: Record<string, { icon: typeof Instagram; color: string; bg: string }> = {
  instagram: { icon: Instagram, color: "text-pink-400", bg: "bg-pink-400/10" },
  youtube: { icon: Youtube, color: "text-red-400", bg: "bg-red-400/10" },
};

export default function ContentCalendarPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [scheduleDate, setScheduleDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const res = await fetch("/api/content/schedule");
      const data = await res.json();
      if (data.success) setItems(data.items || []);
    } catch (err) {
      console.error("Failed to fetch schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!topic || !scheduleDate) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/content/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, scheduledAt: scheduleDate }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => [data.item, ...prev]);
        setTopic("");
        setScheduleDate("");
        setShowModal(false);
      }
    } catch (err) {
      console.error("Failed to schedule content:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { color: string; bg: string; label: string }> = {
      draft: { color: "text-stone-400", bg: "bg-stone-400/10", label: "Draft" },
      scheduled: { color: "text-amber-400", bg: "bg-amber-400/10", label: "Scheduled" },
      published: { color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Published" },
      failed: { color: "text-red-400", bg: "bg-red-400/10", label: "Failed" },
    };
    const c = configs[status] || configs.draft;
    return (
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${c.color} ${c.bg}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-wider mb-3">
          <CalendarDays className="w-3 h-3" /> Content Calendar
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-mono text-white tracking-tight">Content Calendar</h1>
            <p className="text-sm text-[#8A95A5] mt-2 font-mono uppercase tracking-widest">
              Schedule & manage your AI-generated content pipeline
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-lg transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          >
            <Plus className="w-4 h-4" /> Schedule Post
          </button>
        </div>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest text-[#5C667A] py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Content List */}
      <div className="glass-card border border-glass-border overflow-hidden bg-[#0B0C10]/95">
        <div className="p-4 border-b border-glass-border bg-black/40 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4 text-pink-400" /> Upcoming Content
          </h3>
          <span className="text-[10px] font-bold text-[#5C667A] uppercase tracking-wider">
            {items.length} items
          </span>
        </div>

        <div className="divide-y divide-glass-border">
          {loading ? (
            <div className="p-8 text-center text-sm text-[#5C667A] animate-pulse">Loading schedule...</div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center">
              <CalendarDays className="w-12 h-12 text-[#2A2D35] mx-auto mb-4" />
              <p className="text-sm text-[#5C667A] mb-2">No content scheduled yet.</p>
              <p className="text-xs text-[#3A3D45]">Click &quot;Schedule Post&quot; to start building your pipeline.</p>
            </div>
          ) : (
            items.map((item, i) => {
              const PlatformIcon = PLATFORM_CONFIG[item.platform]?.icon || Instagram;
              const platformColor = PLATFORM_CONFIG[item.platform]?.color || "text-pink-400";
              const platformBg = PLATFORM_CONFIG[item.platform]?.bg || "bg-pink-400/10";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 flex items-center gap-5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl ${platformBg} flex items-center justify-center shrink-0`}>
                    <PlatformIcon className={`w-5 h-5 ${platformColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{item.topic}</h4>
                    <p className="text-[11px] text-[#5C667A] mt-1 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(item.scheduledAt).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.imagePrompt && (
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center" title="Imagen visual generated">
                        <Image className="w-4 h-4 text-indigo-400" />
                      </div>
                    )}
                    {getStatusBadge(item.status)}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg glass-card border border-glass-border p-8 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-pink-400" /> Schedule New Post
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5C667A] mb-2">Topic / Hook</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., 5 Biohacking habits for CEO productivity"
                  className="w-full bg-black/60 border border-glass-border rounded-lg px-4 py-3 text-sm text-white font-mono focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5C667A] mb-2">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-black/60 border border-glass-border rounded-lg px-3 py-3 text-xs text-white outline-none cursor-pointer appearance-none"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5C667A] mb-2">Schedule Date</label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full bg-black/60 border border-glass-border rounded-lg px-3 py-3 text-xs text-white outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-glass-border text-[#8A95A5] font-bold text-xs uppercase tracking-[0.15em] rounded-lg hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSchedule}
                  disabled={!topic || !scheduleDate || submitting}
                  className="flex-1 py-3 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-lg flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                >
                  {submitting ? (
                    <><CheckCircle2 className="w-4 h-4 animate-spin" /> Scheduling...</>
                  ) : (
                    <><CalendarDays className="w-4 h-4" /> Schedule</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
