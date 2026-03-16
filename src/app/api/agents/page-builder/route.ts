import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { ai } from "@/lib/ai";
import { ANTI_SLOP_RULES } from "@/lib/content-engine";
import { fireUserWebhook } from "@/lib/webhooks";

/**
 * AI Page Builder API
 * Generates complete landing page HTML/React components from a brief.
 */

const PAGE_BUILDER_PROMPT = `You are an elite landing page architect and conversion specialist. You generate complete, production-ready landing page code.

${ANTI_SLOP_RULES}

## PAGE DESIGN RULES
1. Mobile-first responsive design
2. Single conversion goal per page
3. Above-the-fold hero with clear value proposition
4. Social proof within first two scrolls
5. Maximum 3 CTA buttons, all pointing to same action
6. Use contrast colors for CTAs
7. Short paragraphs (2-3 sentences max)
8. Include testimonial/case study section`;

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user?.primaryEmailAddress?.emailAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { businessName, businessType, offer, style, cta } = await req.json();

    const prompt = `Generate a complete, production-ready landing page for:

BUSINESS: ${businessName || "Premium Business"}
TYPE: ${businessType || "Service Business"}
MAIN OFFER: ${offer || "Book a free consultation"}
STYLE: ${style || "Dark, premium, modern"}
CTA: ${cta || "Book Now"}

Generate the FULL page as a single React/JSX component with inline Tailwind CSS.

Include these sections:
1. HERO: Bold headline + subheadline + CTA + trust badges
2. PROBLEM: 3 pain points the audience faces
3. SOLUTION: How this business solves them (3 features with icons)
4. SOCIAL PROOF: 3 testimonials with names and roles
5. PRICING/OFFER: Clear value proposition with CTA
6. FAQ: 4 common questions
7. FOOTER CTA: Final conversion push

Output ONLY the JSX code. No explanations. Use Tailwind classes. Make it visually stunning.`;

    const result = await ai(prompt, { system: PAGE_BUILDER_PROMPT, maxTokens: 4000 });

    await fireUserWebhook("PageBuilder", "Generated", { businessName });

    return NextResponse.json({ success: true, page: result, metadata: { businessName, style } });
  } catch (err) {
    console.error("[Page Builder] Error:", err);
    return NextResponse.json({ error: "Failed to generate page" }, { status: 500 });
  }
}
