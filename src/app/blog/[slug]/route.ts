import { NextResponse } from "next/server";

/**
 * DYNAMIC BLOG ROUTE — Serves auto-generated SEO blog posts.
 * Accepts a slug, generates the post on-the-fly if not cached.
 */

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const topic = slug.replace(/-/g, " ");

  const nimKey = process.env.NVIDIA_NIM_API_KEY;
  if (!nimKey) {
    return new NextResponse("<html><body><h1>Blog system offline</h1></body></html>", {
      headers: { "Content-Type": "text/html" },
    });
  }

  const nimRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${nimKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-ai/deepseek-v3.2",
      messages: [
        {
          role: "system",
          content: `Write a complete HTML blog page about the given topic. Include <!DOCTYPE html>, <head> with meta tags, and a full <body> with dark styling. Use professional typography, proper H1/H2/H3 headings, and a clean layout. Include a "Back to Sovereign Matrix" link at the top.`,
        },
        { role: "user", content: topic },
      ],
      max_tokens: 4096,
      temperature: 0.7,
    }),
  });

  const data = await nimRes.json();
  const html = data?.choices?.[0]?.message?.content || `<html><body><h1>${topic}</h1><p>Content generation in progress.</p></body></html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
