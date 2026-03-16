"use client";

import React, { useState, useEffect } from "react";
import { CalendarCheck, UserPlus, Loader2, Sparkles, Phone, Mail, Building, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PdfExportButton from "@/components/ui/PdfExportButton";

interface Booking {
  id: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  businessName?: string;
  date: string;
  time: string;
  status: string;
  qualificationNotes?: string;
  source?: string;
}

export default function BookingAgentPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isQualifying, setIsQualifying] = useState(false);
  const [qualification, setQualification] = useState<Record<string, unknown> | null>(null);

  const [form, setForm] = useState({
    leadName: "", leadEmail: "", leadPhone: "", businessName: "", message: "",
    date: "", time: ""
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await fetch("/api/agents/booking");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const qualifyLead = async () => {
    if (!form.leadName || !form.leadEmail) return;
    setIsQualifying(true);
    setQualification(null);
    try {
      const res = await fetch("/api/agents/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "qualify", ...form })
      });
      const data = await res.json();
      setQualification(data.qualification);
    } catch (e) { console.error(e); }
    finally { setIsQualifying(false); }
  };

  const bookAppointment = async () => {
    if (!form.date || !form.time) return;
    try {
      await fetch("/api/agents/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "book", ...form,
          qualificationNotes: (qualification as Record<string, unknown>)?.qualificationNotes || ""
        })
      });
      setForm({ leadName: "", leadEmail: "", leadPhone: "", businessName: "", message: "", date: "", time: "" });
      setQualification(null);
      loadBookings();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <CalendarCheck className="w-3 h-3" /> Speed-to-Lead Engine
        </div>
        <h1 className="text-3xl font-bold serif-text text-white">AI Booking Agent</h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl">
          Qualify leads instantly with AI and book appointments in under 5 minutes. The system scores each lead, generates personalized responses, and logs everything to your pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border border-glass-border">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" /> New Lead
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-text-secondary shrink-0" />
                <input type="text" value={form.leadName} onChange={e => setForm({...form, leadName: e.target.value})} placeholder="Lead Name *" className="w-full bg-onyx/50 border border-glass-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400" />
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-text-secondary shrink-0" />
                <input type="email" value={form.leadEmail} onChange={e => setForm({...form, leadEmail: e.target.value})} placeholder="Email *" className="w-full bg-onyx/50 border border-glass-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400" />
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-text-secondary shrink-0" />
                <input type="tel" value={form.leadPhone} onChange={e => setForm({...form, leadPhone: e.target.value})} placeholder="Phone" className="w-full bg-onyx/50 border border-glass-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400" />
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-text-secondary shrink-0" />
                <input type="text" value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} placeholder="Business Name" className="w-full bg-onyx/50 border border-glass-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400" />
              </div>
              <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Their message / inquiry..." rows={3} className="w-full bg-onyx/50 border border-glass-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400" />

              <button onClick={qualifyLead} disabled={isQualifying || !form.leadName || !form.leadEmail}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl px-4 py-3 text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50">
                {isQualifying ? <><Loader2 className="w-4 h-4 animate-spin" /> Qualifying...</> : <><Sparkles className="w-4 h-4" /> AI Qualify Lead</>}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {qualification && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-6 border border-emerald-500/20 bg-emerald-500/5">
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-widest">AI Qualification</h3>
                <div className="mb-4">
                  <span className="text-xs text-text-secondary">Lead Score</span>
                  <div className="text-3xl font-bold text-emerald-400">{(qualification as Record<string, unknown>)?.leadScore as number || 0}<span className="text-lg text-text-secondary">/100</span></div>
                </div>
                <div className="mb-4">
                  <span className="text-xs text-text-secondary block mb-1">Urgency</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${(qualification as Record<string, unknown>)?.urgencyLevel === "high" ? "bg-rose-500/10 text-rose-400" : (qualification as Record<string, unknown>)?.urgencyLevel === "medium" ? "bg-amber-500/10 text-amber-400" : "bg-neutral-500/10 text-neutral-400"}`}>
                    {(qualification as Record<string, unknown>)?.urgencyLevel as string}
                  </span>
                </div>
                <div className="mb-4 text-xs text-text-secondary">{(qualification as Record<string, unknown>)?.qualificationNotes as string}</div>

                <div className="border-t border-glass-border pt-4 mt-4 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Book Appointment</h4>
                  <div className="flex gap-2">
                    <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="flex-1 bg-onyx/50 border border-glass-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
                    <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="flex-1 bg-onyx/50 border border-glass-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
                  </div>
                  <button onClick={bookAppointment} disabled={!form.date || !form.time}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-xl px-4 py-2.5 text-sm font-bold hover:bg-neutral-200 transition-colors disabled:opacity-50">
                    <CheckCircle2 className="w-4 h-4" /> Confirm Booking
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-2" id="report-content">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-emerald-400" /> Upcoming Appointments</h2>
            <PdfExportButton fileName="Booking_Report" />
          </div>
          
          {isLoading ? (
            <div className="glass-card p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>
          ) : bookings.length === 0 ? (
            <div className="glass-card p-12 text-center border border-glass-border border-dashed">
              <CalendarCheck className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No Appointments Yet</h3>
              <p className="text-sm text-text-secondary">Qualify leads on the left panel to start booking appointments.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking, i) => (
                <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 border border-glass-border hover:border-emerald-500/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{booking.leadName}</h4>
                      <p className="text-xs text-text-secondary">{booking.leadEmail} {booking.businessName && `• ${booking.businessName}`}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400">{booking.date} @ {booking.time}</div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${booking.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : booking.status === "completed" ? "bg-electric/10 text-electric" : "bg-rose-500/10 text-rose-400"}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  {booking.qualificationNotes && <p className="text-xs text-text-secondary mt-2 border-t border-glass-border pt-2">{booking.qualificationNotes}</p>}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
