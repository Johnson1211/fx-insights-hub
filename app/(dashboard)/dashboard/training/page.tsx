"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Calendar, MapPin, UserCheck, CalendarCheck, Flame, Loader2, CheckCircle2, AlertCircle, Clock, FileText } from "lucide-react";

interface Booking {
  id: string;
  type: string;
  status: string;
  preferredDate: string;
  notes?: string;
  createdAt: string;
}

export default function TrainingDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [type, setType] = useState("mentorship");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/user/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error("Failed to load user bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError("Please pick a preferred date.");
      return;
    }

    setError("");
    setSubmitting(true);
    setSuccess(false);

    try {
      const preferredDate = `${date}T${time}:00`;
      const res = await fetch("/api/user/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, preferredDate, notes }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit booking");

      setSuccess(true);
      setNotes("");
      setDate("");
      fetchBookings();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-elite-green/10 text-elite-green border border-elite-green/20">
            Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-elite-red/10 text-elite-red border border-elite-red/20">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
            Pending Review
          </span>
        );
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "bootcamp":
        return "Physical Bootcamp";
      case "classroom":
        return "Classroom Seminar";
      default:
        return "1-on-1 Mentorship";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      <div className="flex items-center justify-between border-b border-elite-border/30 pb-4">
        <h1 className="font-display text-3xl text-white tracking-wider">ACADEMY TRAINING</h1>
        <span className="text-xs text-elite-gold bg-elite-gold/10 px-3 py-1 rounded-full border border-elite-gold/20 flex items-center gap-1">
          <GraduationCap size={12} /> Education Center
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Request Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-display text-xl text-white tracking-wide">REQUEST TRAINING SESSION</h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Schedule direct personal consultations or reserve classroom physical seminar seats. Select your training style, preferred date, and leave notes on your current trading level.
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-4 pt-2">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Type Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Training Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="mentorship">1-on-1 Private Mentorship</option>
                    <option value="bootcamp">Physical Classroom Bootcamp</option>
                    <option value="classroom">Classroom Training Seminar</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field py-2.5 text-sm"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Preferred Time</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="input-field py-2.5 text-sm"
                  />
                </div>
              </div>

              {/* Discussion notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Topics & Goals</label>
                <textarea
                  rows={3}
                  className="input-field text-sm resize-none"
                  placeholder="Tell Peleboss about your trading background, account size, goals, or topics you want to prioritize..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Feedback banners */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-2 p-3 bg-elite-green/10 border border-elite-green/20 rounded-lg text-xs text-elite-green"
                  >
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    <span>Booking requested successfully! Peleboss and our review team will update your request shortly. Check your notifications.</span>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-2 p-3 bg-elite-red/10 border border-elite-red/20 rounded-lg text-xs text-elite-red"
                  >
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Submitting Request...
                  </>
                ) : (
                  <>
                    <CalendarCheck size={16} /> Submit Reservation Request
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Historical Logs */}
        <div className="space-y-6">
          {/* Seminar rules */}
          <div className="glass-card p-6 bg-elite-gold/5 border-elite-gold/10 space-y-3">
            <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-1.5">
              <Flame size={16} className="text-elite-gold" /> Seminar Benefits
            </h3>
            <ul className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-elite-gold mt-1.5 shrink-0" />
                <span>30% early-bird ticket discounts to physical bootcamps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-elite-gold mt-1.5 shrink-0" />
                <span>Private MT4/MT5 portfolio and risk audit reviews</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-elite-gold mt-1.5 shrink-0" />
                <span>Access to exclusive classroom trading setups documents</span>
              </li>
            </ul>
          </div>

          {/* Bookings log */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-display text-base text-white tracking-wide flex items-center gap-1.5">
              <Clock size={16} className="text-elite-gold" /> REQUEST HISTORY
            </h3>

            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 size={20} className="animate-spin text-elite-gold" />
              </div>
            ) : bookings.length === 0 ? (
              <p className="text-center text-xs text-gray-500 py-6 italic">No booking requests found</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">{getTypeLabel(booking.type)}</span>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="text-gray-400 space-y-1">
                      <p className="flex items-center gap-1">
                        <Calendar size={11} className="text-elite-gold" />
                        <span>
                          {new Date(booking.preferredDate).toLocaleDateString()} at{" "}
                          {new Date(booking.preferredDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </p>
                      {booking.notes && (
                        <p className="text-gray-500 bg-black/25 p-2 rounded mt-1.5 italic font-medium leading-relaxed">
                          "{booking.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
