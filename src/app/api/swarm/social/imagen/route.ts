import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt for image generation" }, { status: 400 });
    }

    // Use Gemini's Imagen model for image generation
    // The `imagen-3.0-generate-002` model uses the generateImages endpoint
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Generate a detailed image description using Gemini as a creative director
    const result = await model.generateContent(
      `You are a world-class art director. Create a vivid, detailed image description for a professional Instagram post about: "${prompt}". 
      
      Output ONLY the image description in 2-3 sentences. Focus on: composition, lighting, color palette, mood. 
      Style: premium, modern, scroll-stopping. No text overlays.`
    );

    const imageDescription = result.response.text();

    return NextResponse.json({
      success: true,
      imagePrompt: imageDescription,
      originalTopic: prompt,
      model: "gemini-2.5-pro",
      note: "Image prompt generated. Connect to Imagen 4 API when available in @google/generative-ai SDK.",
    });

  } catch (error) {
    console.error("[Imagen API Error]:", error);
    const msg = error instanceof Error ? error.message : "Image generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
