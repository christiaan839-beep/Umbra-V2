import { NextResponse } from "next/server";

// In-memory settings store (replace with DB in production)
const settingsStore = new Map<string, Record<string, string>>();

export async function POST(req: Request) {
  try {
    const { action, settings } = await req.json();

    if (action === "save") {
      // In production: save per-user settings to DB, encrypted at rest
      const userId = "admin"; // TODO: extract from session cookie
      settingsStore.set(userId, { ...(settingsStore.get(userId) || {}), ...settings });
      
      // If Meta keys were provided, set them as runtime env vars for this instance
      if (settings.META_ACCESS_TOKEN) process.env.META_ACCESS_TOKEN = settings.META_ACCESS_TOKEN;
      if (settings.META_AD_ACCOUNT_ID) process.env.META_AD_ACCOUNT_ID = settings.META_AD_ACCOUNT_ID;
      if (settings.TELEGRAM_BOT_TOKEN) process.env.TELEGRAM_BOT_TOKEN = settings.TELEGRAM_BOT_TOKEN;
      if (settings.TELEGRAM_ADMIN_CHAT_ID) process.env.TELEGRAM_ADMIN_CHAT_ID = settings.TELEGRAM_ADMIN_CHAT_ID;

      return NextResponse.json({ success: true, message: "Settings saved." });
    }

    if (action === "load") {
      const userId = "admin";
      const saved = settingsStore.get(userId) || {};
      
      // Mask sensitive values for display
      const masked: Record<string, string> = {};
      for (const [key, val] of Object.entries(saved)) {
        masked[key] = val.length > 8 ? val.slice(0, 4) + "••••" + val.slice(-4) : "••••••••";
      }
      
      // Also check which env vars are already set
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
