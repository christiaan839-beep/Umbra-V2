"use client";

import React, { useState, useMemo, useCallback } from "react";
import dynamic from 'next/dynamic';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users, Settings, Shield, DollarSign, Target,
  Layers, Globe2, Network,
  Search, ChevronDown, Rocket, Palette, Factory, X, Menu, Cpu, Mic, ScanFace, Video, Swords, ShieldAlert, Database, Headphones, FileVideo, Cuboid, Briefcase, Radar, RefreshCcw, Hexagon, ScanEye
} from "lucide-react";
// Note: Star already imported via other icons, BarChart3 available from lucide
import { motion, AnimatePresence } from "framer-motion";
const NeuralWebGLBackground = dynamic(
  () => import('@/components/3d/NeuralWebGLBackground').then(mod => ({ default: mod.NeuralWebGLBackground })),
  { ssr: false }
);
import { UserButton, useUser } from "@clerk/nextjs";
import { TelemetryProvider, useTelemetry } from '@/components/providers/TelemetryProvider';
import { JarvisSocket } from '@/components/JarvisSocket';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { CinematicOnboarding } from '@/components/dashboard/CinematicOnboarding';

const NAV_GROUPS = [
  {
    group: "Core",
    icon: LayoutDashboard,
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    ]
  },
  {
    group: "AI Tools",
    icon: Rocket,
    items: [
      { href: "/dashboard/seo-dominator", label: "SEO X-Ray", icon: Search },
      { href: "/dashboard/content-factory", label: "Content Factory", icon: Factory },
      { href: "/dashboard/designer", label: "Design Studio", icon: Palette },
      { href: "/dashboard/page-builder", label: "Page Builder", icon: Globe2 },
      { href: "/dashboard/competitor", label: "Competitor Intel", icon: Shield },
    ]
  },
  {
    group: "God-Brain V3",
    icon: Network,
    items: [
      { href: "/dashboard/leads", label: "Lead Prospector", icon: Users },
      { href: "/dashboard/war-room", label: "War Room Colosseum", icon: Swords },
      { href: "/dashboard/voice-swarm", label: "Pipecat Voice Swarm", icon: Mic },
      { href: "/dashboard/nemo-claw", label: "Nano 30B Edge Terminal", icon: Cpu },
      { href: "/dashboard/podcast", label: "PDF-to-Podcast", icon: Headphones },
      { href: "/dashboard/avatar", label: "Digital Human", icon: ScanFace },
      { href: "/dashboard/vsl-hacker", label: "Cosmos VSL Hacker", icon: Video },
      { href: "/dashboard/omni-search", label: "Global RAG Search", icon: Database },
      { href: "/dashboard/cyber-audit", label: "Cyber Security Auditor", icon: ShieldAlert },
      { href: "/dashboard/competitor-intel", label: "Competitor Analysis", icon: Radar },
      { href: "/dashboard/flywheel", label: "Anti-Slop Flywheel", icon: RefreshCcw },
    ]
  },
  {
    group: "Extinction Protocol",
    icon: Rocket,
    items: [
      { href: "/dashboard/audit-destroy", label: "Audit & Destroy Engine", icon: ShieldAlert },
      { href: "/dashboard/deepfake-studio", label: "Executive Deepfake", icon: FileVideo },
      { href: "/dashboard/visual-studio", label: "Sovereign Visual Studio", icon: Palette },
      { href: "/dashboard/edify-forge", label: "Edify 3D Forge", icon: Cuboid },
    ]
  },
  {
    group: "The Syndicate",
    icon: Globe2,
    items: [
      { href: "/dashboard/agency-hub", label: "Agency Cartel Hub", icon: Briefcase },
    ]
  },
  {
    group: "Industrial Nodes",
    icon: Factory,
    items: [
      { href: "/dashboard/god-eye", label: "God-Eye Spatial Array", icon: ScanEye },
      { href: "/dashboard/morpheus-shield", label: "Morpheus Shield", icon: Hexagon },
    ]
  },
  {
    group: "Account",
    icon: Settings,
    items: [
      { href: "/dashboard/library", label: "My Library", icon: Layers },
      { href: "/dashboard/billing", label: "Billing & Plans", icon: DollarSign },
      { href: "/dashboard/settings", label: "API Keys", icon: Settings },
    ]
  }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const { isConnected, ping } = useTelemetry();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine which groups should be open — active group + Agency Swarm always open
  const getActiveGroup = useCallback(() => {
    for (const group of NAV_GROUPS) {
      if (group.items.some(item => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))) {
        return group.group;
      }
    }
    return "Command & Control";
  }, [pathname]);

  const activeGroup = getActiveGroup();

  // Collapsible state — default: active group + "Agency Swarm" open, rest collapsed
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    initial.add(activeGroup);
    initial.add("Agency Swarm");
    initial.add("Command & Control");
    return initial;
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };

  // Filter nav items by search
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return NAV_GROUPS;
    const q = searchQuery.toLowerCase();
    return NAV_GROUPS.map(group => ({
      ...group,
      items: group.items.filter(item =>
        item.label.toLowerCase().includes(q) ||
        item.href.toLowerCase().includes(q)
      )
    })).filter(group => group.items.length > 0);
  }, [searchQuery]);

  // Temporary developer bypass
  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_SKIP_STRIPE_PAYWALL !== "true") {
      // paywall logic
    }
  }, [user]);

  const nodeId = user ? `UMB-NX-${user.id.slice(-5).toUpperCase()}` : 'UMB-NX-OFFLINE';

  const renderNavContent = (isMobile: boolean) => (
    <>
      {/* Search Filter */}
      <div className={`${isMobile ? 'p-4' : 'px-4 pt-4 pb-2'}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-[#00B7FF]/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#00B7FF]/30 transition-colors font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Nav Groups */}
      <nav className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-4'} space-y-1 custom-scrollbar z-10`}>
        {filteredGroups.map((section) => {
          const isExpanded = expandedGroups.has(section.group) || searchQuery.trim().length > 0;
          const hasActiveItem = section.items.some(item =>
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          );

          return (
            <div key={section.group} className="space-y-0.5">
              <button
                onClick={() => toggleGroup(section.group)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  hasActiveItem
                    ? "text-[#00B7FF] bg-[#00B7FF]/5"
                    : "text-[#5C667A] hover:text-neutral-300 hover:bg-white/[0.02]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <section.icon className="w-3 h-3" />
                  {section.group}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="py-1 space-y-0.5">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => isMobile && setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-[#00B7FF]/10 text-white border border-[#00B7FF]/20 shadow-[0_0_15px_rgba(0,183,255,0.05)]"
                                : "text-[#8A95A5] hover:text-white hover:bg-white/5 border border-transparent"
                            }`}
                          >
                            <item.icon className="w-4 h-4 shrink-0" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </>
  );

  return (
    <TelemetryProvider>
      <div className="flex min-h-screen bg-black text-white selection:bg-electric/30 relative overflow-hidden">
        {/* 3D Global Background Layer */}
        <NeuralWebGLBackground />

        {/* Cinematic Grid Lines Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[1]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,183,255,0.04),transparent_60%)] pointer-events-none z-[2]" />

        {/* === DESKTOP SIDEBAR === */}
        <aside className="hidden lg:flex w-64 border-r border-[#00B7FF]/10 bg-black/30 backdrop-blur-3xl flex-col shrink-0 overflow-hidden relative z-10 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
          
          {/* Logo Header */}
          <div className="p-6 border-b border-[#00B7FF]/10 z-10 bg-black/20 backdrop-blur-sm">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image src="/logo.png" alt="Sovereign Matrix Logo" width={32} height={32} className="object-cover rounded-md shadow-[0_0_15px_rgba(0,183,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,183,255,0.5)] transition-shadow duration-300" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0B0C10]" />
              </div>
              <div>
                <span className="text-sm font-semibold tracking-[0.15em] uppercase glow-text block font-mono">Sovereign Matrix</span>
                <span className="text-[9px] uppercase tracking-widest text-text-secondary">v1.0</span>
              </div>
            </Link>
          </div>

          {renderNavContent(false)}

          {/* User Footer */}
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

        {/* === MAIN CONTENT === */}
        <main className="flex-1 overflow-y-auto bg-black/40 backdrop-blur-3xl relative z-10 pb-24 lg:pb-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,183,255,0.03),transparent_40%)] pointer-events-none" />
          <div className="relative z-10 w-full min-h-full">
            <ErrorBoundary>
              <ToastProvider>
                <CinematicOnboarding>
                  {children}
                </CinematicOnboarding>
              </ToastProvider>
            </ErrorBoundary>
          </div>
          <JarvisSocket />
        </main>

        {/* === MOBILE BOTTOM NAV === */}
        <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50 bg-black/70 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-around p-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
           <Link href="/dashboard" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard' ? 'text-white' : 'text-neutral-500'}`}>
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[8px] font-bold uppercase tracking-widest">Command</span>
           </Link>
           <div className="relative -mt-6">
              <Link href="/dashboard/nemo-claw" className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#00B7FF] to-blue-700 border border-white/20 shadow-[0_0_20px_rgba(0,183,255,0.4)] text-white">
                 <Network className="w-5 h-5" />
              </Link>
           </div>
           <Link href="/dashboard/leads" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/leads' ? 'text-[#00B7FF]' : 'text-neutral-500'}`}>
               <Target className="w-5 h-5" />
               <span className="text-[8px] font-bold uppercase tracking-widest">Leads</span>
            </Link>
           <button
             onClick={() => setMobileMenuOpen(true)}
             className="flex flex-col items-center gap-1 text-neutral-500"
           >
              <Menu className="w-5 h-5" />
              <span className="text-[8px] font-bold uppercase tracking-widest">More</span>
           </button>
        </nav>

        {/* === MOBILE FULL MENU OVERLAY === */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#00B7FF]/10">
                <div className="flex items-center gap-3">
                  <Image src="/logo.png" alt="Sovereign Matrix" width={28} height={28} className="rounded-md" />
                  <span className="text-sm font-bold tracking-[0.15em] uppercase font-mono text-white">Sovereign Matrix</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Menu Body */}
              <div className="flex-1 overflow-y-auto">
                {renderNavContent(true)}
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-4 border-t border-[#00B7FF]/10 flex items-center gap-3">
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-xl" } }} />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white tracking-widest uppercase">Commander</span>
                  <span className="text-[9px] text-emerald-400 font-mono">{nodeId}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TelemetryProvider>
  );
}
