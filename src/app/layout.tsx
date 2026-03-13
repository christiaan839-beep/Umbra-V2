import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMBRA — Autonomous AI Marketing Intelligence",
  description: "15 AI engines that market, sell, and scale while you sleep. Replace your entire marketing team with autonomous intelligence. Ghost Mode, Swarm Critic, God-Brain Memory, and 12 more engines — from $497/mo.",
  keywords: ["AI marketing", "autonomous marketing", "AI agency", "ghost mode", "marketing automation", "AI ads", "swarm intelligence", "marketing AI platform"],
  authors: [{ name: "UMBRA" }],
  openGraph: {
    title: "UMBRA — Autonomous AI Marketing Intelligence",
    description: "15 AI engines. Zero employees. Replace your entire marketing team with shadow intelligence.",
    type: "website",
    siteName: "UMBRA",
  },
  twitter: {
    card: "summary_large_image",
    title: "UMBRA — 15 AI Engines, Zero Employees",
    description: "Autonomous AI that markets, sells, and scales while you sleep. From $497/mo.",
  },
  other: {
    "theme-color": "#0a0a0f",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
