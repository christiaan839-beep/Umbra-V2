import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  const plausibleDomain = process.env.NEXT_PUBLIC_URL?.replace("https://", "").replace("http://", "") || "umbra-v2.vercel.app";
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="UMBRA" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* Plausible Analytics — Privacy-friendly, GDPR compliant, no cookies */}
        <script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" />
      </head>
      <ClerkProvider>
        <body className="bg-midnight text-white antialiased">
          {children}
          <Analytics />
          <SpeedInsights />
        </body>
      </ClerkProvider>
    </html>
  );
}
