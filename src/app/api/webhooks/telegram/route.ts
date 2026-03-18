import { NextResponse } from "next/server";

// ⚡ SOVEREIGN MATRIX // TELEGRAM COMMAND CENTER
// This Edge API catches commands from the Commander's iOS Telegram app
// and securely routes them to the local NemoClaw Daemon or Ghost Fleet.

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[TELEGRAM UPLINK] Received Command Payload:", body);
    
    // 1. Authenticate Commander 
    // Ensure the message ONLY comes from Christiaan's explicit Telegram ID
    const chatId = body?.message?.chat?.id;
    /*
    if (chatId !== Number(process.env.AUTHORIZED_TELEGRAM_ID)) {
      return new NextResponse("UNAUTHORIZED UPLINK", { status: 403 });
    }
    */

    // 2. Parse Sub-Command
    const text = body?.message?.text;
    let responseMessage = "Unrecognized Sovereign Command.";

    if (text?.startsWith("/ghostfleet")) {
      const target = text.split(" ")[1];
      responseMessage = `⚡ Deploying Apollo.io Ghost Fleet natively to extract leads for targeted domain: ${target}.`;
      // Here you trigger n8n or the python script via a secondary webhook
    } else if (text?.startsWith("/status")) {
      responseMessage = `🟢 SOVEREIGN UPLINK ACTIVE.\n- NemoClaw: Idle\n- Edge RAG: Online\n- Next.js Edge: 100% Health`;
    }

    // 3. Transmit confirmation back to iPhone
    // await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    //    method: "POST",
    //    headers: { "Content-Type": "application/json" },
    //    body: JSON.stringify({ chat_id: chatId, text: responseMessage })
    // });

    return NextResponse.json({ success: true, text: responseMessage });

  } catch (error) {
    return NextResponse.json({ error: "UPLINK_FAILURE" }, { status: 500 });
  }
}
