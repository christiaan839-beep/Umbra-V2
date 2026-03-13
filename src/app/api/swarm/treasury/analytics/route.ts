import { NextResponse } from "next/server";
import { index, isPineconeReady } from "@/lib/pinecone";
import { embed } from "@/lib/ai";
import { getAllMemories } from "@/lib/memory";

export async function GET() {
  try {
    // Attempt to pull real revenue data from Pinecone first.
    let transactions: any[] = [];
    
    if (isPineconeReady()) {
      try {
        // We do a broad search for revenue events
        const dummyVector = await embed("revenue event");
        const queryRes = await index!.query({
            vector: dummyVector,
            topK: 100,
            includeMetadata: true,
            filter: { type: { $in: ["revenue-event", "refund-event"] } }
        });
        
        transactions = queryRes.matches.map(m => m.metadata);
      } catch (e) {
          console.error("Failed to query pinecone for revenue", e);
      }
    }

    // Fallback/Supplement with local memory for this simulation
    if (transactions.length === 0) {
        transactions = getAllMemories()
            .map(m => m.metadata)
            .filter(meta => meta.type === "revenue-event" || meta.type === "refund-event");
    }

    // Default simulation data if the database is empty (for demo purposes)
    if (transactions.length === 0) {
         transactions = [
            { type: "revenue-event", amount: "4700", status: "succeeded", customerEmail: "ceo@vertex.inc", productName: "Ghost Mode Domain", timestamp: new Date(Date.now() - 3600000).toISOString() },
            { type: "revenue-event", amount: "150000", status: "succeeded", customerEmail: "founder@nexus.co", productName: "Apex Retainer", timestamp: new Date(Date.now() - 86400000).toISOString() },
            { type: "revenue-event", amount: "9900", status: "succeeded", customerEmail: "cmo@omni.net", productName: "Gap Killer Audit", timestamp: new Date(Date.now() - 172800000).toISOString() },
            { type: "refund-event", amount: "4700", status: "refunded", timestamp: new Date(Date.now() - 43200000).toISOString() }
         ];
    }

    // Calculate Analytics
    let grossCents = 0;
    let refundCents = 0;
    let netCents = 0;
    const stripeFeePercent = 0.029;
    const stripeFeeFixedCents = 30;
    
    // Sort youngest to oldest
    const sortedTx = transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    sortedTx.forEach(tx => {
        const amt = parseInt(tx.amount || "0");
        if (tx.type === "revenue-event" && tx.status === "succeeded") {
            grossCents += amt;
            // Stripe processing fee: 2.9% + $0.30
            const fee = Math.round((amt * stripeFeePercent) + stripeFeeFixedCents);
            netCents += (amt - fee);
        } else if (tx.type === "refund-event" && tx.status === "refunded") {
            refundCents += amt;
            netCents -= amt; 
        }
    });

    // Calculate a simulated MRR (assume 60% of gross is recurring for this demo)
    const mrrCents = Math.round(grossCents * 0.6);

    return NextResponse.json({
        success: true,
        data: {
            metrics: {
                gross_revenue_dollars: (grossCents / 100).toFixed(2),
                net_revenue_dollars: (netCents / 100).toFixed(2),
                refund_dollars: (refundCents / 100).toFixed(2),
                mrr_dollars: (mrrCents / 100).toFixed(2),
                transaction_count: transactions.filter(t => t.type === 'revenue-event').length
            },
            recent_transactions: sortedTx.slice(0, 10).map(tx => ({
                id: `tx_${Math.random().toString(36).slice(2, 9)}`,
                ...tx,
                amount_dollars: (parseInt(tx.amount || "0") / 100).toFixed(2)
            }))
        }
    });

  } catch (error: any) {
    console.error("[Analytics Agent Error]:", error);
    return NextResponse.json({ error: "Failed to generate analytics" }, { status: 500 });
  }
}
