import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Performance: compress responses
  compress: true,

  // Image optimization for external domains
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.clerk.com" },
      { protocol: "https", hostname: "**.stripe.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // Experimental performance features
  experimental: {
    optimizeCss: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },

  // Rewrites for white-label subdomain routing
  async rewrites() {
    return [
      {
        source: "/client/:clientId/:path*",
        destination: "/portal/:clientId/:path*",
      },
    ];
  },
};

export default nextConfig;
