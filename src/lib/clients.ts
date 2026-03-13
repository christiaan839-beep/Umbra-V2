export interface Client {
  id: string;
  name: string;
  company: string;
  plan: "sovereign" | "ghost" | "franchise";
  status: "active" | "onboarding" | "churned";
  metrics: { revenue: number; leads: number; contentPieces: number; lastActivity: string };
}

const CLIENT_STORE = new Map<string, Client>();

// Seed demo data
[
  { id: "cl_1", name: "Marcus Chen", company: "Nova Capital", plan: "sovereign" as const, status: "active" as const, metrics: { revenue: 28400, leads: 124, contentPieces: 47, lastActivity: "2h ago" } },
  { id: "cl_2", name: "Sarah Mitchell", company: "Apex Fitness", plan: "ghost" as const, status: "active" as const, metrics: { revenue: 14200, leads: 89, contentPieces: 32, lastActivity: "4h ago" } },
  { id: "cl_3", name: "David Park", company: "Horizon SaaS", plan: "franchise" as const, status: "onboarding" as const, metrics: { revenue: 0, leads: 0, contentPieces: 0, lastActivity: "Just now" } },
].forEach(c => CLIENT_STORE.set(c.id, c));

export function getClients() { return Array.from(CLIENT_STORE.values()); }
export function getClient(id: string) { return CLIENT_STORE.get(id); }
export function createClient(data: Omit<Client, "id">) { const id = `cl_${Date.now()}`; const c = { ...data, id }; CLIENT_STORE.set(id, c); return c; }
export function updateClient(id: string, updates: Partial<Client>) { const c = CLIENT_STORE.get(id); if (!c) return null; Object.assign(c, updates); return c; }
export function deleteClient(id: string) { CLIENT_STORE.delete(id); }

export function getAggregateMetrics() {
  const clients = getClients();
  return {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === "active").length,
    totalRevenue: clients.reduce((s, c) => s + c.metrics.revenue, 0),
    totalLeads: clients.reduce((s, c) => s + c.metrics.leads, 0),
    totalContent: clients.reduce((s, c) => s + c.metrics.contentPieces, 0),
  };
}
