import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ⚡ SOVEREIGN MATRIX // AUTONOMOUS A/B TESTING MIDDLEWARE ⚡
// This mathematically annihilates human marketing agencies by 
// automatically splitting traffic on the Vercel Edge and measuring conversion.

export const config = {
  matcher: ['/landing/:path*'], // Apply only to generated marketing funnels
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // Check if user already has a variant cohort assigned
  let cohort = request.cookies.get('sovereign_cohort')?.value;
  
  if (!cohort) {
     // Randomly assign 50/50 split test mathematically on the Edge
     cohort = Math.random() > 0.5 ? 'variant_alpha' : 'variant_beta';
  }

  // Rewrite the URL to the exact cohort bucket (without changing the visible URL for the user)
  // Example: /landing/plumber rewrites to /landing/plumber/variant_alpha
  url.pathname = `${url.pathname}/${cohort}`;
  const response = NextResponse.rewrite(url);

  // Lock the user into their cohort so the test remains statistically valid
  response.cookies.set('sovereign_cohort', cohort, {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 Day tracking persistence
  });

  console.log(`[EDGE A/B MATRIX] Routed user to ${url.pathname}`);
  return response;
}
