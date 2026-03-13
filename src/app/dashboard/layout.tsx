"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Ghost, Brain, Code, Laptop,
  Users, Mail, Settings, LogOut, BarChart3, Shield, DollarSign,
  Workflow, FlaskConical, GitBranch, Wrench, FileText,
  Send, Sparkles, Building2, Webhook, Layers, ShieldAlert, Mic, Lightbulb, Network, Film, BrainCircuit, Target, Server
} from "lucide-react";

const NAV_GROUPS = [
  {
    group: "Command & Control",
    icon: Server,
    items: [
      { href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
      { href: "/dashboard/omnipresence", label: "Global Telemetry", icon: Workflow },
      { href: "/dashboard/treasury", label: "Treasury Matrix", icon: DollarSign },
    ]
  },
  {
    group: "Core Intelligence",
    icon: BrainCircuit,
    items: [
      { href: "/dashboard/apex-strategy", label: "The Apex Node", icon: BrainCircuit },
      { href: "/dashboard/nexus", label: "The Nexus Graph", icon: Network },
      { href: "/dashboard/memory", label: "God-Brain DB", icon: Brain },
      { href: "/dashboard/optimizer", label: "Meta-Cognition", icon: Lightbulb },
      { href: "/dashboard/swarm", label: "Swarm Critic", icon: Code },
    ]
  },
  {
    group: "Targeting & Acquisition",
    icon: CrosshairIcon,
    items: [
      { href: "/dashboard/ad-buyer", label: "Capital Deployer", icon: Target },
      { href: "/dashboard/leads", label: "Prospector Outbound", icon: Users },
      { href: "/dashboard/funnel-hacker", label: "Funnel Hijacker", icon: ShieldAlert },
      { href: "/dashboard/competitor", label: "Competitor Intel", icon: Shield },
      { href: "/dashboard/analytics", label: "Conversion Funnel", icon: BarChart3 },
    ]
  },
  {
    group: "Synthesis & Content",
    icon: Film,
    items: [
      { href: "/dashboard/studio", label: "Cinematic Studio", icon: Film },
      { href: "/dashboard/voice", label: "Voice Swarm", icon: Mic },
      { href: "/dashboard/social", label: "Social Router", icon: Send },
      { href: "/dashboard/programmatic", label: "Factory Scale", icon: Layers },
      { href: "/dashboard/ghost-mode", label: "Ghost Mode", icon: Ghost },
      { href: "/dashboard/sequences", label: "Drip Sequences", icon: Mail },
      { href: "/dashboard/nurture", label: "Email Broadcaster", icon: Mail },
    ]
  },
  {
    group: "Systems Architecture",
    icon: FlaskConical,
    items: [
      { href: "/dashboard/clients", label: "Client Portal", icon: Building2 },
      { href: "/dashboard/coder", label: "Autonomous Coder", icon: Laptop },
      { href: "/dashboard/factory", label: "Tool Forge", icon: Wrench },
      { href: "/dashboard/skills", label: "Skill Modules", icon: FlaskConical },
      { href: "/dashboard/pipelines", label: "Data Pipelines", icon: GitBranch },
      { href: "/dashboard/playground", label: "AGI Sandbox", icon: Sparkles },
      { href: "/dashboard/reports", label: "Client Briefs", icon: FileText },
      { href: "/dashboard/webhooks", label: "Webhook Relays", icon: Webhook },
      { href: "/dashboard/settings", label: "Global Settings", icon: Settings },
    ]
  }
];

function CrosshairIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="22" x2="18" y1="12" y2="12" />
      <line x1="6" x2="2" y1="12" y2="12" />
      <line x1="12" x2="12" y1="6" y2="2" />
      <line x1="12" x2="12" y1="22" y2="18" />
    </svg>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/auth", { method: "POST", body: JSON.stringify({ action: "logout" }) });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-midnight text-white selection:bg-electric/30">
      {/* OS Sidebar */}
      <aside className="w-64 border-r border-glass-border bg-[#0B0C10] flex flex-col shrink-0 overflow-hidden relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
        
        <div className="p-6 border-b border-glass-border z-10 bg-[#0B0C10]/80 backdrop-blur-sm">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src="/logo.png" alt="UMBRA Logo" className="w-8 h-8 object-cover rounded-md shadow-[0_0_15px_rgba(0,183,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,183,255,0.5)] transition-shadow duration-300" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0B0C10]" />
            </div>
            <div>
              <span className="text-sm font-semibold tracking-[0.15em] uppercase glow-text block font-mono">UMBRA</span>
              <span className="text-[9px] uppercase tracking-widest text-text-secondary">v4.0.0 Alpha</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar z-10">
          {NAV_GROUPS.map((section) => (
            <div key={section.group} className="space-y-1">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#5C667A] mb-3 px-3 flex items-center gap-2">
                <section.icon className="w-3 h-3" />
                {section.group}
              </h3>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-electric/10 text-white border border-electric/20 shadow-[0_0_15px_rgba(0,183,255,0.05)]"
                        : "text-[#8A95A5] hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-glass-border z-10 bg-[#0B0C10]/80 backdrop-blur-sm">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-xs font-bold text-text-secondary hover:text-rose-glow hover:bg-rose-glow/10 border border-transparent hover:border-rose-glow/20 transition-all group" onClick={handleLogout}>
            <LogOut className="w-4 h-4 group-hover:text-rose-glow transition-colors" />
            DISCONNECT
          </button>
        </div>
      </aside>

      {/* OS Main Content Panel */}
      <main className="flex-1 overflow-y-auto bg-midnight relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,183,255,0.03),transparent_40%)] pointer-events-none" />
        <div className="relative z-10 w-full min-h-full">
           {children}
        </div>
      </main>
    </div>
  );
}
