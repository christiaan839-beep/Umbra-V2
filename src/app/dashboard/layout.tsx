"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Ghost, Brain, Code, Laptop,
  Users, Mail, BarChart3
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/ghost-mode", label: "Ghost Mode", icon: Ghost },
  { href: "/dashboard/memory", label: "God-Brain", icon: Brain },
  { href: "/dashboard/swarm", label: "Swarm Critic", icon: Code },
  { href: "/dashboard/coder", label: "Claude Coder", icon: Laptop },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/nurture", label: "Nurture", icon: Mail },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-midnight">
      {/* Sidebar */}
      <aside className="w-64 border-r border-glass-border flex flex-col shrink-0">
        <div className="p-6 border-b border-glass-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric to-rose-glow flex items-center justify-center text-xs font-bold text-white">SN</div>
            <span className="text-sm font-semibold tracking-wide">Sovereign Node</span>
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
          <Link href="/portal" className="flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:text-white transition-colors">
            <BarChart3 className="w-3.5 h-3.5" />
            Client Portal
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
