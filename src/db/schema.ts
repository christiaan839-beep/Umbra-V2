import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  nodeId: text("node_id").notNull().unique(), // e.g., UMB-NX-77492
  createdAt: timestamp("created_at").defaultNow(),
  plan: text("plan").notNull().default("black-card"), // Future-proofing for tiering
});

export const activeSwarms = pgTable("active_swarms", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  agentAlias: text("agent_alias").notNull(), // COMMANDER, AD-BUYER, etc.
  status: text("status").notNull().default("idle"),
  uptime: timestamp("uptime").defaultNow(),
});

export const globalTelemetry = pgTable("global_telemetry", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  eventType: text("event_type").notNull(), // e.g., "lead_scraped", "video_synthesized"
  payload: text("payload").notNull(), // JSON string representing the asset/data
  timestamp: timestamp("timestamp").defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  tier: text("tier").notNull().default("sovereign"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userEmail: text("user_email").notNull().unique(), // not doing formal FK to allow standalone keys
  config: text("config").notNull().default('{}'), // JSON object stringified
});
