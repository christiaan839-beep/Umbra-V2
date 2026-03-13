import { NextRequest, NextResponse } from "next/server";
import { getClients, getClient, createClient, updateClient, deleteClient, getAggregateMetrics } from "@/lib/clients";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const client = getClient(id);
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, client });
  }

  if (searchParams.get("aggregate") === "true") {
    return NextResponse.json({ success: true, metrics: getAggregateMetrics() });
  }

  return NextResponse.json({ success: true, clients: getClients() });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const client = createClient(data);
    return NextResponse.json({ success: true, client });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    const client = updateClient(id, updates);
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, client });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  deleteClient(id);
  return NextResponse.json({ success: true });
}
