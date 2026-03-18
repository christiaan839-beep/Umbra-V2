import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sovereign-matrix.com"),
  title: "SOVEREIGN MATRIX | The Ultimate Autonomous Agency OS",
  description: "Stop paying $5k retainers. Deploy 29 autonomous AI agents via the Sovereign Vector Matrix. Fire your agency. Become the Chief Agent Officer.",
  keywords: ["AI matrix", "God-Brain", "AI outbound engine", "faceless automation", "sovereign matrix"],
  authors: [{ name: "Sovereign Matrix - Edge" }],
  openGraph: {
    title: "SOVEREIGN MATRIX | The Ultimate Autonomous Agency OS",
    description: "Stop paying $5k retainers. Deploy 29 autonomous AI agents via the Sovereign Vector Matrix. Fire your agency. Become the Chief Agent Officer.",
    type: "website",
    siteName: "Sovereign Matrix",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Sovereign Matrix — AI Marketing Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SOVEREIGN MATRIX | The Ultimate Autonomous Agency OS",
    description: "Deploy 29 autonomous AI agents via the Sovereign Vector Matrix. Fire your agency.",
  },
  other: {
    "theme-color": "#050505",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const plausibleDomain = process.env.NEXT_PUBLIC_URL?.replace("https://", "").replace("http://", "") || "umbra-v3.vercel.app";
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
        <meta name="apple-mobile-web-app-title" content="Sovereign Matrix" />
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
