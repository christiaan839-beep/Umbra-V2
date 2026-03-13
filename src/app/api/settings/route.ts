import { NextResponse } from "next/server";
import { db, getUserFromCookie } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { action, settings } = await req.json();
    const userEmail = getUserFromCookie(req) || "admin";

    if (action === "save") {
      db.settings.set(userEmail, settings);

      // Inject into runtime env for this serverless instance
      if (settings.META_ACCESS_TOKEN) process.env.META_ACCESS_TOKEN = settings.META_ACCESS_TOKEN;
      if (settings.META_AD_ACCOUNT_ID) process.env.META_AD_ACCOUNT_ID = settings.META_AD_ACCOUNT_ID;
      if (settings.TELEGRAM_BOT_TOKEN) process.env.TELEGRAM_BOT_TOKEN = settings.TELEGRAM_BOT_TOKEN;
      if (settings.TELEGRAM_ADMIN_CHAT_ID) process.env.TELEGRAM_ADMIN_CHAT_ID = settings.TELEGRAM_ADMIN_CHAT_ID;

      return NextResponse.json({ success: true, message: "Settings saved." });
    }

    if (action === "load") {
      const saved = db.settings.get(userEmail);

      // Mask sensitive values
      const masked: Record<string, string> = {};
      for (const [key, val] of Object.entries(saved)) {
        masked[key] = val.length > 8 ? val.slice(0, 4) + "••••" + val.slice(-4) : "••••••••";
      }

      const status = {
        META_ACCESS_TOKEN: !!process.env.META_ACCESS_TOKEN,
        META_AD_ACCOUNT_ID: !!process.env.META_AD_ACCOUNT_ID,
        STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
        TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
        TELEGRAM_ADMIN_CHAT_ID: !!process.env.TELEGRAM_ADMIN_CHAT_ID,
        GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
        ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
      };

      return NextResponse.json({ success: true, masked, status });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("[Settings API]:", error);
    return NextResponse.json({ error: "Failed to process settings." }, { status: 500 });
  }
}
