import { NextRequest, NextResponse } from "next/server";
import {
  generateBlogPost,
  generateEmailSequence,
  generateSocialPack,
  generateVideoScript,
} from "@/agents/content-factory";

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
      case "blog": {
        const { topic, keywords, tone } = params || {};
        if (!topic) {
          return NextResponse.json(
            { error: "Missing params: topic (keywords optional as array, tone optional)" },
            { status: 400 }
          );
        }
        const result = await generateBlogPost(topic, keywords || [], tone);
        return NextResponse.json(result);
      }

      case "email": {
        const { product, audience, steps } = params || {};
        if (!product || !audience) {
          return NextResponse.json(
            { error: "Missing params: product and audience" },
            { status: 400 }
          );
        }
        const result = await generateEmailSequence(product, audience, steps);
        return NextResponse.json(result);
      }

      case "social": {
        const { topic, platforms } = params || {};
        if (!topic) {
          return NextResponse.json(
            { error: "Missing params: topic" },
            { status: 400 }
          );
        }
        const result = await generateSocialPack(topic, platforms);
        return NextResponse.json(result);
      }

      case "video": {
        const { topic, duration, style } = params || {};
        if (!topic) {
          return NextResponse.json(
            { error: "Missing params: topic" },
            { status: 400 }
          );
        }
        const result = await generateVideoScript(topic, duration, style);
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Available: blog, email, social, video` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("[Content Factory] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
