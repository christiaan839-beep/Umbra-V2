"use client";

import React, { useState } from "react";
import { Star, Loader2, MessageSquare, Send, Copy, CheckCircle2, AlertTriangle, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  name: string;
  rating: number;
  text: string;
  response?: string;
}

export default function ReputationPage() {
  const [activeTab, setActiveTab] = useState<"respond" | "analyze" | "request">("respond");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [copied, setCopied] = useState(false);

  // Respond form
  const [reviewForm, setReviewForm] = useState({
    reviewerName: "",
    rating: 5,
    reviewText: "",
    businessName: "",
    businessType: "",
  });

  // Analyze
  const [reviews, setReviews] = useState<Review[]>([
    { name: "", rating: 5, text: "" },
    { name: "", rating: 4, text: "" },
    { name: "", rating: 3, text: "" },
  ]);
  const [analysis, setAnalysis] = useState<Record<string, unknown> | null>(null);

  // Request
  const [requestForm, setRequestForm] = useState({ customerName: "", businessName: "", platform: "Google" });
  const [requestMessage, setRequestMessage] = useState("");

  const handleRespond = async () => {
    if (!reviewForm.reviewText) return;
    setIsLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/agents/reputation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "respond", ...reviewForm }),
      });
      const data = await res.json();
      if (data.success) setResponse(data.response);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleAnalyze = async () => {
    const validReviews = reviews.filter(r => r.text);
    if (validReviews.length === 0) return;
    setIsLoading(true);
    setAnalysis(null);
    try {
      const res = await fetch("/api/agents/reputation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "analyze", reviews: validReviews, businessName: reviewForm.businessName || "Our Business" }),
      });
      const data = await res.json();
      if (data.success) setAnalysis(data.analysis);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleRequest = async () => {
    setIsLoading(true);
    setRequestMessage("");
    try {
      const res = await fetch("/api/agents/reputation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate-request", ...requestForm }),
      });
      const data = await res.json();
      if (data.success) setRequestMessage(data.message);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Star className="w-3 h-3" /> Reputation Shield
        </div>
        <h1 className="text-3xl font-bold serif-text text-white">AI Reputation Manager</h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl">
          Generate perfect review responses, analyze sentiment patterns, and request reviews from happy customers. Never lose a customer to a bad review response again.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "respond" as const, label: "Respond to Reviews", icon: MessageSquare },
          { id: "analyze" as const, label: "Analyze Reviews", icon: AlertTriangle },
          { id: "request" as const, label: "Request Reviews", icon: ThumbsUp },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${activeTab === tab.id ? "bg-yellow-500/10 border-yellow-500/30 text-white" : "bg-onyx/30 border-glass-border text-text-secondary"}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* RESPOND TAB */}
      {activeTab === "respond" && (
        <div className="space-y-4">
          <div className="glass-card p-6 border border-glass-border">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Reviewer Name</label>
                <input type="text" value={reviewForm.reviewerName} onChange={e => setReviewForm({...reviewForm, reviewerName: e.target.value})}
                  placeholder="John D." className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setReviewForm({...reviewForm, rating: n})}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${n <= reviewForm.rating ? "bg-yellow-500/20 text-yellow-400" : "bg-onyx/30 text-neutral-600"}`}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Review Text</label>
              <textarea value={reviewForm.reviewText} onChange={e => setReviewForm({...reviewForm, reviewText: e.target.value})}
                placeholder="Paste the customer's review here..." rows={3}
                className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" value={reviewForm.businessName} onChange={e => setReviewForm({...reviewForm, businessName: e.target.value})}
                placeholder="Your Business Name" className="bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none" />
              <input type="text" value={reviewForm.businessType} onChange={e => setReviewForm({...reviewForm, businessType: e.target.value})}
                placeholder="Business Type (e.g. Dental)" className="bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none" />
            </div>
            <button onClick={handleRespond} disabled={isLoading || !reviewForm.reviewText}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black rounded-xl px-4 py-3 text-sm font-bold shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all disabled:opacity-50">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Generate Response
            </button>
          </div>

          <AnimatePresence>
            {response && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI Response
                  </h3>
                  <button onClick={() => copyText(response)} className="text-xs text-electric hover:text-white transition-colors">
                    {copied ? "Copied!" : <><Copy className="w-3 h-3 inline mr-1" /> Copy</>}
                  </button>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">{response}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ANALYZE TAB */}
      {activeTab === "analyze" && (
        <div className="space-y-4">
          <div className="glass-card p-6 border border-glass-border">
            <p className="text-xs text-text-secondary mb-4">Paste multiple reviews to get a sentiment analysis and actionable insights.</p>
            {reviews.map((review, i) => (
              <div key={i} className="grid grid-cols-[80px_auto_1fr] gap-3 mb-3 items-start">
                <input type="text" value={review.name} placeholder={`Name ${i + 1}`}
                  onChange={e => { const r = [...reviews]; r[i].name = e.target.value; setReviews(r); }}
                  className="bg-onyx/50 border border-glass-border rounded-lg px-2 py-2 text-xs text-white" />
                <select value={review.rating}
                  onChange={e => { const r = [...reviews]; r[i].rating = Number(e.target.value); setReviews(r); }}
                  className="bg-onyx/50 border border-glass-border rounded-lg px-2 py-2 text-xs text-white w-16">
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n}★</option>)}
                </select>
                <input type="text" value={review.text} placeholder="Review text..."
                  onChange={e => { const r = [...reviews]; r[i].text = e.target.value; setReviews(r); }}
                  className="bg-onyx/50 border border-glass-border rounded-lg px-3 py-2 text-xs text-white" />
              </div>
            ))}
            <button onClick={() => setReviews([...reviews, { name: "", rating: 5, text: "" }])}
              className="text-xs text-electric hover:text-white transition-colors mb-4">+ Add Another Review</button>
            <button onClick={handleAnalyze} disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black rounded-xl px-4 py-3 text-sm font-bold disabled:opacity-50">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />} Analyze Sentiment
            </button>
          </div>

          {analysis && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 border border-glass-border">
              <pre className="text-sm text-neutral-300 whitespace-pre-wrap overflow-auto">{JSON.stringify(analysis, null, 2)}</pre>
            </motion.div>
          )}
        </div>
      )}

      {/* REQUEST TAB */}
      {activeTab === "request" && (
        <div className="space-y-4">
          <div className="glass-card p-6 border border-glass-border">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <input type="text" value={requestForm.customerName} onChange={e => setRequestForm({...requestForm, customerName: e.target.value})}
                placeholder="Customer Name" className="bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none" />
              <input type="text" value={requestForm.businessName} onChange={e => setRequestForm({...requestForm, businessName: e.target.value})}
                placeholder="Your Business Name" className="bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none" />
              <select value={requestForm.platform} onChange={e => setRequestForm({...requestForm, platform: e.target.value})}
                className="bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white">
                {["Google", "Yelp", "Facebook", "TripAdvisor", "Trustpilot"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <button onClick={handleRequest} disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black rounded-xl px-4 py-3 text-sm font-bold disabled:opacity-50">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />} Generate Review Request
            </button>
          </div>

          {requestMessage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Review Request Message</h3>
                <button onClick={() => copyText(requestMessage)} className="text-xs text-electric">{copied ? "Copied!" : "Copy"}</button>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">{requestMessage}</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
