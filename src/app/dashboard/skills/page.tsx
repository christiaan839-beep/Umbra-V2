"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CopySlash, MapPin, Code2, ArrowRight } from "lucide-react";

const SKILLS = [
  {
    id: "gap-killer",
    name: "Competition Gap Killer",
    description: "Scan 3 competitor websites to instantly find missing content, keyword gaps, and untargeted trust signals. Autonomously generates the 5 high-impact blog topics needed to steal their traffic.",
    icon: CopySlash,
    color: "text-rose-glow",
    bg: "bg-rose-glow/10",
    border: "border-rose-glow/20",
    status: "Active",
    href: "/dashboard/skills/gap-killer",
  },
  {
    id: "gbp-hijack",
    name: "GBP Map Pack Hijack",
    description: "Analyzes competitor Google Business Profiles to find what they aren't doing. Generates 10-30 days of hyper-local, urgency-driven Map posts with embedded local landmarks.",
    icon: MapPin,
    color: "text-electric",
    bg: "bg-electric/10",
    border: "border-electric/20",
    status: "Active",
    href: "/dashboard/skills/gbp-hijack",
  },
  {
    id: "schema-audit",
    name: "Full Schema Technical Audit",
    description: "A developer-grade technical audit. Scans a prospect's URL and strictly outputs missing LocalBusiness JSON-LD code for instant deployment. The ultimate cold outreach value add.",
    icon: Code2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    status: "Active",
    href: "/dashboard/skills/schema-audit",
  },
];

export default function SkillsHubPage() {
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold serif-text text-white">Agentic Skills Hub</h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl">
          One-click autonomous playbooks that execute complex marketing attacks based on battle-tested agency SOPs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKILLS.map((skill, i) => (
          <Link href={skill.href} key={skill.id}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 border border-glass-border hover:border-electric/30 transition-all duration-300 group h-full flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${skill.bg} ${skill.border} border`}>
                  <skill.icon className={`w-6 h-6 ${skill.color}`} />
                </div>
                <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold uppercase tracking-wider text-text-secondary border border-glass-border">
                  {skill.status}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{skill.name}</h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-6 flex-1">
                {skill.description}
              </p>

              <div className="flex items-center text-sm font-semibold text-white group-hover:text-electric transition-colors mt-auto">
                Execute Playbook
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
