"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Ghost, Brain, Code, Laptop,
  Users, Mail, Settings, LogOut, BarChart3, Shield,
  Workflow, FlaskConical, GitBranch, Wrench, FileText,
  Send, Sparkles, Building2, Webhook
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/ghost-mode", label: "Ghost Mode", icon: Ghost },
  { href: "/dashboard/memory", label: "God-Brain", icon: Brain },
  { href: "/dashboard/swarm", label: "Swarm Critic", icon: Code },
  { href: "/dashboard/coder", label: "Claude Coder", icon: Laptop },
  { href: "/dashboard/playground", label: "AI Playground", icon: Sparkles },
  { href: "/dashboard/social", label: "Social", icon: Send },
  { href: "/dashboard/clients", label: "Clients", icon: Building2 },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/nurture", label: "Nurture", icon: Mail },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/omnipresence", label: "Omnipresence", icon: Workflow },
  { href: "/dashboard/competitor", label: "War Room", icon: Shield },
  { href: "/dashboard/skills", label: "Skills A/B", icon: FlaskConical },
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric to-rose-glow flex items-center justify-center text-xs font-bold text-white">U</div>
            <span className="text-sm font-semibold tracking-[0.15em] uppercase">UMBRA</span>
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
