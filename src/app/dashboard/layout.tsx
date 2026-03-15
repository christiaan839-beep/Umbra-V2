"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Ghost, Brain, Code, Laptop,
  Users, Mail, Settings, BarChart3, Shield, DollarSign,
  Workflow, FlaskConical, GitBranch, Wrench, FileText,
  Send, Sparkles, Building2, Webhook, Layers, ShieldAlert, Mic, Lightbulb, Network, Film, BrainCircuit, Target, Server, Globe2, CalendarDays, Crown, Activity,
  PenTool,
} from "lucide-react";
import { NeuralWebGLBackground } from '@/components/3d/NeuralWebGLBackground';
import { UserButton, useUser } from "@clerk/nextjs";
import { TelemetryProvider, useGlobalTelemetry } from '@/components/providers/TelemetryProvider';
import { JarvisSocket } from '@/components/JarvisSocket';

const NAV_GROUPS = [
  {
    group: "Command & Control",
    icon: Server,
    items: [
      { href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
      { href: "/dashboard/omnipresence", label: "Global Telemetry", icon: Workflow },
      { href: "/dashboard/treasury", label: "Treasury Matrix", icon: DollarSign },
      { href: "/dashboard/affiliates", label: "Affiliate Engine", icon: Users },
    ]
  },
  {
    group: "Core Intelligence",
    icon: BrainCircuit,
    items: [
      { href: "/dashboard/apex-strategy", label: "The Apex Node", icon: BrainCircuit },
      { href: "/dashboard/nexus", label: "The Nexus Graph", icon: Network },
      { href: "/dashboard/memory", label: "God-Brain DB", icon: Brain },
      { href: "/dashboard/omnisearch", label: "Omniscient Memory", icon: BrainCircuit },
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
      { href: "/dashboard/outbound", label: "Outbound Engine", icon: Send },
      { href: "/dashboard/funnel-hacker", label: "Funnel Hijacker", icon: ShieldAlert },
      { href: "/dashboard/competitor", label: "Competitor Intel", icon: Shield },
      { href: "/dashboard/analytics", label: "Mission Telemetry", icon: BarChart3 },
      { href: "/dashboard/launch", label: "Launch Center", icon: Target },
    ]
  },
  {
    group: "Synthesis & Content",
    icon: Film,
    items: [
      { href: "/dashboard/studio", label: "Cinematic Studio", icon: Film },
      { href: "/dashboard/studio/vectors", label: "Synthesis V2", icon: PenTool },
      { href: "/dashboard/voice", label: "Voice Swarm", icon: Mic },
      { href: "/dashboard/social", label: "Social Router", icon: Send },
      { href: "/dashboard/calendar", label: "Content Calendar", icon: CalendarDays },
      { href: "/dashboard/page-builder", label: "Page Builder", icon: Globe2 },
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
      { href: "/dashboard/demo", label: "Live Demo", icon: Sparkles },
      { href: "/dashboard/coder", label: "Autonomous Coder", icon: Laptop },
      { href: "/dashboard/architect", label: "Agentic Architect", icon: LayoutDashboard },
      { href: "/dashboard/factory", label: "Tool Forge", icon: Wrench },
      { href: "/dashboard/skills", label: "Skill Modules", icon: FlaskConical },
      { href: "/dashboard/pipelines", label: "Data Pipelines", icon: GitBranch },
      { href: "/dashboard/playground", label: "AGI Sandbox", icon: Sparkles },
      { href: "/dashboard/reports", label: "Client Briefs", icon: FileText },
      { href: "/dashboard/webhooks", label: "Webhook Relays", icon: Webhook },
      { href: "/dashboard/audit", label: "Audit Trail", icon: ShieldAlert },
      { href: "/dashboard/status", label: "System Status", icon: Activity },
      { href: "/dashboard/compliance", label: "Compliance & Risk", icon: ShieldAlert },
      { href: "/dashboard/billing", label: "Billing & Plans", icon: DollarSign },
      { href: "/dashboard/admin", label: "Admin Panel", icon: Crown },
      { href: "/dashboard/settings", label: "Global Settings", icon: Settings },
    ]
  }
];

function CrosshairIcon(props: React.SVGProps<SVGSVGElement>) {
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
  const { user } = useUser();
  const { isConnected, ping } = useGlobalTelemetry();
  
  // Temporary developer bypass to capture OmniSearch and WebGL environments
  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_SKIP_STRIPE_PAYWALL !== "true") {
      // In a real environment, this logic might query your Database to check the user's Node access.
      // We will skip this redirect entirely if SKIP_STRIPE_PAYWALL is active.
    }
  }, [user]);

  // Generate a mock Node ID based on the user's ID for visual representation
  const nodeId = user ? `UMB-NX-${user.id.slice(-5).toUpperCase()}` : 'UMB-NX-OFFLINE';

  return (
    <TelemetryProvider>
      <div className="flex min-h-screen bg-black text-white selection:bg-electric/30 relative overflow-hidden">
        {/* 3D Global Background Layer */}
        <NeuralWebGLBackground />

      {/* Cinematic Grid Lines Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[1]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,183,255,0.04),transparent_60%)] pointer-events-none z-[2]" />

      {/* OS Sidebar (Desktop Only) */}
      <aside className="hidden lg:flex w-64 border-r border-[#00B7FF]/10 bg-black/30 backdrop-blur-3xl flex-col shrink-0 overflow-hidden relative z-10 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
        
        <div className="p-6 border-b border-[#00B7FF]/10 z-10 bg-black/20 backdrop-blur-sm">
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

        <div className="p-4 border-t border-[#00B7FF]/10 z-10 bg-black/20 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
             <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-xl border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]" } }} />
             <div className="flex flex-col">
               <span className="text-xs font-bold text-white tracking-widest uppercase">Commander</span>
               <span className="text-[9px] text-emerald-400 font-mono tracking-widest flex items-center gap-2">
                 {nodeId}
                 {isConnected ? (
                   <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> {ping}ms</span>
                 ) : (
                   <span className="flex items-center gap-1 text-red-500"><span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> OFF</span>
                 )}
               </span>
             </div>
          </div>
        </div>
      </aside>

      {/* OS Main Content Panel */}
      <main className="flex-1 overflow-y-auto bg-black/40 backdrop-blur-3xl relative z-10 pb-24 lg:pb-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,183,255,0.03),transparent_40%)] pointer-events-none" />
        <div className="relative z-10 w-full min-h-full">
           {children}
        </div>
        <JarvisSocket />
      </main>

      {/* Mobile Glassmorphic Bottom Navigation (PWA) */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-around p-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
         <Link href="/dashboard" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard' ? 'text-white' : 'text-neutral-500'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-widest">Command</span>
         </Link>
         <Link href="/dashboard/apex-strategy" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/apex-strategy' ? 'text-[#00B7FF]' : 'text-neutral-500'}`}>
            <BrainCircuit className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-widest">Apex</span>
         </Link>
         <div className="relative -mt-6">
            <Link href="/dashboard/omnipresence" className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-rose-700 border border-white/20 shadow-[0_0_20px_rgba(244,63,94,0.4)] text-white">
               <Globe2 className="w-5 h-5" />
            </Link>
         </div>
         <Link href="/dashboard/funnel-hacker" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/funnel-hacker' ? 'text-rose-500' : 'text-neutral-500'}`}>
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-widest">Hijack</span>
         </Link>
         <Link href="/dashboard/settings" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/settings' ? 'text-white' : 'text-neutral-500'}`}>
            <Settings className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-widest">Menu</span>
         </Link>
       </nav>
      </div>
    </TelemetryProvider>
  );
}
