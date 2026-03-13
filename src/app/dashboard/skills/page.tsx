"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Trophy, BarChart3, Loader2 } from "lucide-react";

interface Skill {
  id: string; name: string; description: string; agent: string;
  status: "testing" | "optimized";
  variants: { id: string; prompt: string; usageCount: number; successes: number }[];
  winningVariantId: string | null;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetch("/api/skills").then(r => r.json()).then(d => { if (d.skills) setSkills(d.skills); });
  }, []);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
          <FlaskConical className="w-3 h-3" /> Self-Optimizing
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">Skills A/B Testing</h1>
        <p className="text-sm text-text-secondary mt-1">AI agents automatically A/B test prompts and lock in the winner.</p>
      </div>

      <div className="space-y-4">
        {skills.map((skill, i) => {
          const [a, b] = skill.variants;
          const rateA = a.usageCount > 0 ? ((a.successes / a.usageCount) * 100).toFixed(1) : "0.0";
          const rateB = b?.usageCount > 0 ? ((b.successes / b.usageCount) * 100).toFixed(1) : "0.0";
          const aWinning = parseFloat(rateA) > parseFloat(rateB);

          return (
            <motion.div key={skill.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{skill.name}</h3>
                  <p className="text-xs text-text-secondary">{skill.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-electric/10 text-electric border border-electric/20">{skill.agent}</span>
                  {skill.status === "optimized" ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Trophy className="w-2.5 h-2.5" /> Optimized
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">Testing</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[a, b].filter(Boolean).map(v => {
                  const rate = v.usageCount > 0 ? ((v.successes / v.usageCount) * 100).toFixed(1) : "0.0";
                  const isWinner = skill.winningVariantId === v.id;
                  return (
                    <div key={v.id} className={`p-3 rounded-xl border ${isWinner ? "border-emerald-500/30 bg-emerald-500/5" : "border-glass-border bg-onyx/50"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">Variant {v.id}</span>
                        {isWinner && <Trophy className="w-3 h-3 text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed mb-3 line-clamp-2">{v.prompt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3 text-text-secondary" />
                          <span className="text-[10px] text-text-secondary">{v.usageCount} uses</span>
                        </div>
                        <span className={`text-sm font-bold font-mono ${isWinner ? "text-emerald-400" : parseFloat(rate) > 10 ? "text-amber-400" : "text-text-secondary"}`}>
                          {rate}%
                        </span>
                      </div>
                      {/* Win rate bar */}
                      <div className="h-1.5 bg-onyx rounded-full mt-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(parseFloat(rate) * 3, 100)}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full rounded-full ${isWinner ? "bg-emerald-400" : "bg-electric/50"}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
