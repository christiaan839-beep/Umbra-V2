/**
 * Webhook Execution Engine
 * 
 * Fires real HTTP requests to external services when UMBRA events occur.
 */

interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
}

// In a real production app, this would be fetched from a database (Supabase/Postgres).
// For now, we simulate the active webhooks that a user configured in the dashboard.
const MOCK_DB_WEBHOOKS = [
  { id: "wh_1", trigger: "hot_lead", url: "https://echo.free.beeceptor.com", active: true },
  { id: "wh_2", trigger: "campaign_kill", url: "https://echo.free.beeceptor.com", active: true },
];

export async function triggerWebhook(event: "hot_lead" | "new_sale" | "campaign_kill" | "report_ready", data: any) {
  const activeHooks = MOCK_DB_WEBHOOKS.filter(h => h.trigger === event && h.active);
  
  if (activeHooks.length === 0) return { delivered: 0, failed: 0 };

  const payload: WebhookPayload = {
    event,
    data,
    timestamp: new Date().toISOString()
  };

  let delivered = 0;
  let failed = 0;

  // Fire all webhooks in parallel
  await Promise.allSettled(
    activeHooks.map(async (hook) => {
      try {
        const res = await fetch(hook.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "UMBRA-Webhook-Engine/1.0",
            "X-UMBRA-Event": event
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) delivered++;
        else failed++;
      } catch (e) {
        failed++;
        console.error(`[Webhook Failed] URL: ${hook.url}`, e);
      }
    })
  );

  return { delivered, failed, totalExpected: activeHooks.length };
}
