import { NextRequest, NextResponse } from "next/server";
import {
  generateLandingPageBrief,
  generateBrandIdentity,
  generateUISpec,
} from "@/agents/designer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, params } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Missing required field: action" },
        { status: 400 }
      );
    }

    switch (action) {
      case "landing-page": {
        const { product, audience, goal } = params || {};
        if (!product || !audience) {
          return NextResponse.json(
            { error: "Missing params: product and audience" },
            { status: 400 }
          );
        }
        const result = await generateLandingPageBrief(product, audience, goal);
        return NextResponse.json(result);
      }

      case "brand-identity": {
        const { businessName, industry, personality, targetAudience } = params || {};
        if (!businessName || !industry || !personality) {
          return NextResponse.json(
            { error: "Missing params: businessName, industry, personality" },
            { status: 400 }
          );
        }
        const result = await generateBrandIdentity(businessName, industry, personality, targetAudience);
        return NextResponse.json(result);
      }

      case "ui-spec": {
        const { appDescription, screens, style } = params || {};
        if (!appDescription || !screens?.length) {
          return NextResponse.json(
            { error: "Missing params: appDescription and screens (array)" },
            { status: 400 }
          );
        }
        const result = await generateUISpec(appDescription, screens, style);
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Available: landing-page, brand-identity, ui-spec` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("[Design Agent] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
