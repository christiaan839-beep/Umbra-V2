export interface ScoredLead {
  id: string;
  name: string;
  email: string;
  company: string;
  score: number;
  tier: "hot" | "warm" | "cold";
  signals: string[];
  source: string;
  lastActivity: string;
}

function calculateScore(lead: { budget?: number; engagement?: number; fit?: number; urgency?: number }): number {
  const budget = Math.min((lead.budget || 0) / 100, 30);      // max 30 pts
  const engagement = Math.min((lead.engagement || 0) * 3, 25); // max 25 pts
  const fit = Math.min((lead.fit || 0) * 5, 25);               // max 25 pts
  const urgency = Math.min((lead.urgency || 0) * 4, 20);       // max 20 pts
  return Math.round(budget + engagement + fit + urgency);
}

function getTier(score: number): "hot" | "warm" | "cold" {
  if (score >= 70) return "hot";
  if (score >= 40) return "warm";
  return "cold";
}

// Demo leads with realistic scoring
const DEMO_LEADS: ScoredLead[] = [
  { id: "l1", name: "Alex Rivera", email: "alex@techventures.co", company: "TechVentures", score: 92, tier: "hot", signals: ["Visited pricing 3x", "Downloaded ROI guide", "Budget: $5k+/mo"], source: "Demo", lastActivity: "12m ago" },
  { id: "l2", name: "Jordan Lee", email: "jordan@growthco.io", company: "GrowthCo", score: 78, tier: "hot", signals: ["Completed demo chat", "Asked about Ghost Mode", "Agency owner"], source: "Organic", lastActivity: "2h ago" },
  { id: "l3", name: "Sam Torres", email: "sam@nextlevel.agency", company: "NextLevel Agency", score: 65, tier: "warm", signals: ["Shared with team", "Budget: $2-5k/mo", "7+ employees"], source: "Referral", lastActivity: "1d ago" },
  { id: "l4", name: "Casey Morgan", email: "casey@startupfuel.com", company: "StartupFuel", score: 51, tier: "warm", signals: ["Opened 3 emails", "Viewed features page"], source: "Email", lastActivity: "3d ago" },
  { id: "l5", name: "Taylor Kim", email: "taylor@localfitness.com", company: "LocalFitness", score: 34, tier: "cold", signals: ["Single page visit", "No email opens"], source: "Ads", lastActivity: "1w ago" },
  { id: "l6", name: "Riley Cooper", email: "riley@ecomboost.com", company: "EcomBoost", score: 88, tier: "hot", signals: ["Requested call", "Budget: $10k+/mo", "Currently using agency"], source: "Demo", lastActivity: "30m ago" },
];

export function getLeads(filter?: "hot" | "warm" | "cold"): ScoredLead[] {
  if (filter) return DEMO_LEADS.filter(l => l.tier === filter);
  return DEMO_LEADS.sort((a, b) => b.score - a.score);
}

export function scoreLead(data: { budget?: number; engagement?: number; fit?: number; urgency?: number }) {
  const score = calculateScore(data);
  return { score, tier: getTier(score) };
}
