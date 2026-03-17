 * UMBRA V3 Test Suite
 * 
 * Tests for critical paths: Health, Payments, Email, Self-Heal.
 * Run with: npm test
 * 
 * These are lightweight integration tests that verify API route
 * exports and response structures without needing a running server.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================================
// Health Check API Tests
// ============================================================
describe("Health Check API", () => {
  it("should export a GET handler", async () => {
    const mod = await import("@/app/api/health/route");
    expect(mod.GET).toBeDefined();
    expect(typeof mod.GET).toBe("function");
  });

  it("should return structured health data", async () => {
    // Mock the db.execute to avoid needing a real database
    vi.mock("@/db", () => ({
      db: { execute: vi.fn().mockResolvedValue([{ "?column?": 1 }]) },
    }));

    const mod = await import("@/app/api/health/route");
    const response = await mod.GET();
    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("version");
    expect(data).toHaveProperty("services");
    expect(data).toHaveProperty("timestamp");
    expect(Array.isArray(data.services)).toBe(true);
  });
});

// ============================================================
// Email Sender API Tests
// ============================================================
describe("Email Sender API", () => {
  it("should export a POST handler", async () => {
    const mod = await import("@/app/api/email/send/route");
    expect(mod.POST).toBeDefined();
    expect(typeof mod.POST).toBe("function");
  });

  it("should reject requests without required fields", async () => {
    const mod = await import("@/app/api/email/send/route");
    const req = new Request("http://localhost/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: "" }),
    });
    const res = await mod.POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });
});

// ============================================================
// Audit Log API Tests
// ============================================================
describe("Audit Log API", () => {
  it("should export a POST handler", async () => {
    const mod = await import("@/app/api/audit/log/route");
    expect(mod.POST).toBeDefined();
    expect(typeof mod.POST).toBe("function");
  });

  it("should reject requests without tenantId", async () => {
    vi.mock("@/db", () => ({
      db: { insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue([]) }) },
    }));

    const mod = await import("@/app/api/audit/log/route");
    const req = new Request("http://localhost/api/audit/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "test" }),
    });
    const res = await mod.POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("Missing");
  });
});

// ============================================================
// Notification Email API Tests
// ============================================================
describe("Notification Email API", () => {
  it("should export a POST handler", async () => {
    const mod = await import("@/app/api/notifications/email/route");
    expect(mod.POST).toBeDefined();
    expect(typeof mod.POST).toBe("function");
  });

  it("should reject unknown notification types", async () => {
    const mod = await import("@/app/api/notifications/email/route");
    const req = new Request("http://localhost/api/notifications/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId: "test-123", type: "nonexistent_type" }),
    });
    const res = await mod.POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("Unknown notification type");
  });

  it("should render known templates successfully", async () => {
    const mod = await import("@/app/api/notifications/email/route");
    const req = new Request("http://localhost/api/notifications/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId: "test-123", type: "lead_closed", data: { prospectName: "Test User" } }),
    });
    const res = await mod.POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.email.subject).toContain("Lead Closed");
  });
});

// ============================================================
// Self-Healing Monitor Tests
// ============================================================
describe("Self-Healing Monitor", () => {
  it("should export a GET handler", async () => {
    const mod = await import("@/app/api/monitor/self-heal/route");
    expect(mod.GET).toBeDefined();
    expect(typeof mod.GET).toBe("function");
  });
});

// ============================================================
// PayFast Checkout Tests
// ============================================================
describe("PayFast Checkout API", () => {
  it("should export a POST handler", async () => {
    const mod = await import("@/app/api/payfast/checkout/route");
    expect(mod.POST).toBeDefined();
    expect(typeof mod.POST).toBe("function");
  });

  it("should reject invalid tiers", async () => {
    const mod = await import("@/app/api/payfast/checkout/route");
    const req = new Request("http://localhost/api/payfast/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: "nonexistent" }),
    });
    const res = await mod.POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("Invalid");
  });
});

// ============================================================
// Rate Limiter Tests
// ============================================================
describe("Rate Limiter", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should allow requests under the limit", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const result = rateLimit("test-ip-1");
    expect(result.allowed).toBe(true);
  });

  it("should block excessive requests", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    // Make 21 requests (limit is 20/min)
    for (let i = 0; i < 20; i++) {
      rateLimit("test-ip-flood");
    }
    const result = rateLimit("test-ip-flood");
    expect(result.allowed).toBe(false);
  });
});

// ============================================================
// SEO Agent API Tests
// ============================================================
describe("SEO Agent API", () => {
  it("should export a POST handler", async () => {
    const mod = await import("@/app/api/agents/seo/route");
    expect(mod.POST).toBeDefined();
    expect(typeof mod.POST).toBe("function");
  });

  it("should reject requests without action", async () => {
    const mod = await import("@/app/api/agents/seo/route");
    const req = new Request("http://localhost/api/agents/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await mod.POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("action");
  });

  it("should reject unknown actions", async () => {
    const mod = await import("@/app/api/agents/seo/route");
    const req = new Request("http://localhost/api/agents/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "nonexistent" }),
    });
    const res = await mod.POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("Unknown action");
  });
});

// ============================================================
// Design Agent API Tests
// ============================================================
describe("Design Agent API", () => {
  it("should export a POST handler", async () => {
    const mod = await import("@/app/api/agents/design/route");
    expect(mod.POST).toBeDefined();
    expect(typeof mod.POST).toBe("function");
  });

  it("should reject requests without action", async () => {
    const mod = await import("@/app/api/agents/design/route");
    const req = new Request("http://localhost/api/agents/design", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await mod.POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("action");
  });

  it("should reject unknown actions", async () => {
    const mod = await import("@/app/api/agents/design/route");
    const req = new Request("http://localhost/api/agents/design", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "nonexistent" }),
    });
    const res = await mod.POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("Unknown action");
  });
});

// ============================================================
// Content Factory API Tests
// ============================================================
describe("Content Factory API", () => {
  it("should export a POST handler", async () => {
    const mod = await import("@/app/api/agents/content/route");
    expect(mod.POST).toBeDefined();
    expect(typeof mod.POST).toBe("function");
  });

  it("should reject requests without action", async () => {
    const mod = await import("@/app/api/agents/content/route");
    const req = new Request("http://localhost/api/agents/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await mod.POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("action");
  });

  it("should reject unknown actions", async () => {
    const mod = await import("@/app/api/agents/content/route");
    const req = new Request("http://localhost/api/agents/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "nonexistent" }),
    });
    const res = await mod.POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("Unknown action");
  });
});

// ============================================================
// Orchestrator API Tests
// ============================================================
describe("Orchestrator API", () => {
  it("should export GET and POST handlers", async () => {
    const mod = await import("@/app/api/agents/orchestrate/route");
    expect(mod.GET).toBeDefined();
    expect(mod.POST).toBeDefined();
    expect(typeof mod.GET).toBe("function");
    expect(typeof mod.POST).toBe("function");
  });

  it("should return pipelines on GET", async () => {
    const mod = await import("@/app/api/agents/orchestrate/route");
    const res = await mod.GET();
    const data = await res.json();
    expect(data.pipelines).toBeDefined();
    expect(Array.isArray(data.pipelines)).toBe(true);
    expect(data.pipelines.length).toBeGreaterThan(0);
  });

  it("should reject POST without pipelineId", async () => {
    const mod = await import("@/app/api/agents/orchestrate/route");
    const req = new Request("http://localhost/api/agents/orchestrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await mod.POST(req as any);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("pipelineId");
  });
});
