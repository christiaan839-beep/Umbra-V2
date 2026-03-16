import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMBRA — AI Marketing Platform",
  description: "29 AI tools that handle your content, ads, SEO, outreach, and lead qualification — running 24/7 at a fraction of what you pay a traditional agency. From R2,750/month.",
  keywords: ["AI marketing", "marketing automation", "AI marketing platform", "content generation", "SEO automation", "lead generation", "South Africa", "ZAR"],
  authors: [{ name: "UMBRA" }],
  openGraph: {
    title: "UMBRA — Replace Your Agency. Keep The Results.",
    description: "29 AI marketing tools that handle content, ads, SEO, and lead generation — running 24/7. From R2,750/month.",
    type: "website",
    siteName: "UMBRA",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "UMBRA — AI Marketing Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UMBRA — AI Marketing Platform",
    description: "29 AI tools. 24/7 execution. Replace your agency. From R2,750/month.",
  },
  other: {
    "theme-color": "#050505",
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
