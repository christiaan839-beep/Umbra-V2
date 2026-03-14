import { db } from "@/db";
import { scheduledContent } from "@/db/schema";
import { desc } from "drizzle-orm";
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Target
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ShowcasePage() {
  // Fetch real, autonomously generated content from the UMBRA system
  const contents = await db
    .select()
    .from(scheduledContent)
    .orderBy(desc(scheduledContent.createdAt))
    .limit(12);

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans selection:bg-[#00B7FF]/30 pb-24">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#00B7FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-violet-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <div className="pt-32 pb-16 px-6 relative z-10 max-w-6xl mx-auto text-center border-b border-white/5 mb-16">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md mb-8">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-xs tracking-[0.2em] text-emerald-400 font-medium uppercase">Live Proof of Work</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
          100% Autonomous. <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#00B7FF] to-violet-500">Zero Humans.</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed mb-8">
          This page displays real social media content generated autonomously by the UMBRA AGI Swarm. No copywriters. No social media managers. Real-time value deployment.
        </p>
        <Link href="/scan">
          <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] font-bold tracking-wide uppercase text-sm">
            Audit My Marketing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {contents.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-black/40">
            <Sparkles className="w-12 h-12 text-[#00B7FF] mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-light mb-2">Engines initializing...</h3>
            <p className="text-neutral-500">The Swarm is currently generating the first batch of content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((post) => (
              <div key={post.id} className="bg-[#0A0A0A] border border-white/5 hover:border-[#00B7FF]/30 transition-colors p-6 rounded-2xl flex flex-col h-full group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center">
                    {post.platform.toLowerCase() === 'instagram' && <Instagram className="w-5 h-5 text-pink-500" />}
                    {post.platform.toLowerCase() === 'twitter' && <Twitter className="w-5 h-5 text-blue-400" />}
                    {post.platform.toLowerCase() === 'linkedin' && <Linkedin className="w-5 h-5 text-blue-600" />}
                    {!['instagram', 'twitter', 'linkedin'].includes(post.platform.toLowerCase()) && <Target className="w-5 h-5 text-neutral-400" />}
                  </div>
                  <div>
                    <h4 className="text-white font-medium capitalize tracking-wide">{post.platform} Target</h4>
                    <p className="text-xs text-neutral-500 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {format(new Date(post.scheduledAt), "MMM d, yyyy • HH:mm")}
                    </p>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-[#C0C8D4] text-sm leading-relaxed whitespace-pre-line mb-4 selection:bg-[#00B7FF]/30">
                    {post.topic}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5">
                  <p className="text-[10px] text-[#00B7FF] font-mono tracking-widest uppercase mb-2">Imagen Render Prompt</p>
                  <p className="text-xs text-neutral-500 line-clamp-2 italic">
                    &quot;{post.imagePrompt}&quot;
                  </p>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="px-2 py-1 rounded bg-[#00B7FF]/10 text-[#00B7FF] text-[9px] font-mono uppercase tracking-widest border border-[#00B7FF]/20">
                    AI GEN-2.5
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
