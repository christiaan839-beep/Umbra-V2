"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Ghost, Brain, Code, Laptop,
  Users, Mail, Settings, LogOut, BarChart3, Shield, DollarSign,
  Workflow, FlaskConical, GitBranch, Wrench, FileText,
  Send, Sparkles, Building2, Webhook, Layers, ShieldAlert, Mic, Lightbulb, Network, Film, BrainCircuit
} from "lucide-react";

const NAV = [
  { href: "/dashboard/apex-strategy", label: "The Apex", icon: BrainCircuit },
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/treasury", label: "Treasury", icon: DollarSign },
  { href: "/dashboard/omnipresence", label: "Omnipresence", icon: Workflow },
  { href: "/dashboard/nexus", label: "The Nexus", icon: Network },
  { href: "/dashboard/studio", label: "Cinematic Studio", icon: Film },
  { href: "/dashboard/voice", label: "Voice Swarm", icon: Mic },
  { href: "/dashboard/ghost-mode", label: "Ghost Mode", icon: Ghost },
  { href: "/dashboard/memory", label: "God-Brain", icon: Brain },
  { href: "/dashboard/swarm", label: "Swarm Critic", icon: Code },
  { href: "/dashboard/optimizer", label: "Meta-Cognition", icon: Lightbulb },
  { href: "/dashboard/coder", label: "Claude Coder", icon: Laptop },
  { href: "/dashboard/playground", label: "AI Playground", icon: Sparkles },
  { href: "/dashboard/social", label: "Social", icon: Send },
  { href: "/dashboard/clients", label: "Clients", icon: Building2 },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/nurture", label: "Nurture", icon: Mail },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/programmatic", label: "Programmatic SEO", icon: Layers },
  { href: "/dashboard/competitor", label: "War Room", icon: Shield },
  { href: "/dashboard/funnel-hacker", label: "Funnel Hacker", icon: ShieldAlert },
  { href: "/dashboard/skills", label: "Agentic Skills", icon: FlaskConical },
  { href: "/dashboard/pipelines", label: "Pipelines", icon: GitBranch },
  { href: "/dashboard/factory", label: "Tool Factory", icon: Wrench },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/sequences", label: "Email Sequences", icon: Mail },
  { href: "/dashboard/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/auth", { method: "POST", body: JSON.stringify({ action: "logout" }) });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-midnight">
      {/* Sidebar */}
      <aside className="w-64 border-r border-glass-border flex flex-col shrink-0">
        <div className="p-6 border-b border-glass-border">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="UMBRA Logo" className="w-8 h-8 object-cover rounded-md shadow-[0_0_15px_rgba(0,183,255,0.3)]" />
            <span className="text-sm font-semibold tracking-[0.15em] uppercase glow-text">UMBRA</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-electric/10 text-white border border-electric/20"
                    : "text-text-secondary hover:text-white hover:bg-glass-bg"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-glass-border">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-glass-bg transition-colors mt-auto group" onClick={handleLogout}>
          <LogOut className="w-4 h-4 group-hover:text-rose-glow transition-colors" />
          Log Out
        </button>
      </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
