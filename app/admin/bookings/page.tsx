"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, Phone, Mail, CheckCircle2, XCircle, Clock, Loader2, AlertCircle, RefreshCw, X } from "lucide-react";

interface UserDetail {
  name: string;
  email: string;
  phone?: string;
}

interface Booking {
  id: string;
  type: string;
  preferredDate: string;
  notes?: string;
  status: string;
  createdAt: string;
  user: UserDetail;
}

type Toast = { type: "success" | "error"; message: string } | null;

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);

  // Reschedule state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("10:00");
  const [updating, setUpdating] = useState(false);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      } else {
        showToast("error", "Failed to retrieve booking requests.");
      }
    } catch (err) {
      console.error("Failed to load admin bookings:", err);
      showToast("error", "Failed to fetch bookings list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId: string, status: "confirmed" | "cancelled") => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });

      if (res.ok) {
        showToast("success", `Training request status set to ${status}.`);
        fetchBookings();
      } else {
        const data = await res.json();
        showToast("error", data.error || "Failed to update reservation status");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Network error occurred.");
    }
  };

  const openReschedule = (booking: Booking) => {
    setSelectedBooking(booking);
    // Parse preferred date into yyyy-MM-dd and HH:mm
    const dateObj = new Date(booking.preferredDate);
    const dateString = dateObj.toISOString().split("T")[0];
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    setRescheduleDate(dateString);
    setRescheduleTime(`${hours}:${minutes}`);
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !rescheduleDate) return;

    setUpdating(true);
    try {
      const preferredDate = `${rescheduleDate}T${rescheduleTime}:00`;
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          status: "confirmed",
          preferredDate,
        }),
      });

      if (res.ok) {
        showToast("success", "Training session rescheduled and confirmed successfully!");
        setSelectedBooking(null);
        fetchBookings();
      } else {
        const data = await res.json();
        showToast("error", data.error || "Failed to reschedule booking");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Network error occurred during reschedule request.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-elite-green/10 text-elite-green border border-elite-green/20">Approved</span>;
      case "cancelled":
        return <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-elite-red/10 text-elite-red border border-elite-red/20">Cancelled</span>;
      default:
        return <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse">Pending Review</span>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "bootcamp":
        return "Physical Classroom Bootcamp";
      case "classroom":
        return "Classroom Seminar";
      default:
        return "1-on-1 Private Mentorship";
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "bg-elite-green/15 border-elite-green/35 text-elite-green"
                : "bg-elite-red/15 border-elite-red/35 text-elite-red"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
        <h1 className="font-display text-3xl text-slate-900 dark:text-slate-900 dark:text-white tracking-wider">TRAINING RESERVATIONS</h1>
        <button
          onClick={fetchBookings}
          className="text-xs text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white flex items-center gap-1.5 transition-colors uppercase tracking-wider font-semibold"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh Requests
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-elite-gold" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <Calendar size={32} className="text-gray-600 mx-auto mb-3" />
          <p className="text-slate-900 dark:text-slate-900 dark:text-white font-semibold text-sm">No training requests found</p>
          <p className="text-slate-500 dark:text-gray-400 text-xs mt-1">Users bookings will show up here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass-card p-6 flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              {/* Left Section: Details */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs text-elite-gold bg-elite-gold/10 px-3 py-1 rounded-full border border-elite-gold/20 font-bold uppercase tracking-wider">
                    {getTypeLabel(booking.type)}
                  </span>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {/* User info */}
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Requested By</p>
                    <p className="text-slate-900 dark:text-slate-900 dark:text-white font-bold flex items-center gap-1">
                      <User size={12} className="text-elite-gold" /> {booking.user.name}
                    </p>
                    <p className="text-slate-500 dark:text-gray-400 flex items-center gap-1">
                      <Mail size={12} /> {booking.user.email}
                    </p>
                    {booking.user.phone && (
                      <p className="text-slate-500 dark:text-gray-400 flex items-center gap-1">
                        <Phone size={12} /> {booking.user.phone}
                      </p>
                    )}
                  </div>

                  {/* Schedule */}
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Schedule Time</p>
                    <p className="text-slate-900 dark:text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                      <Calendar size={13} className="text-elite-gold" />
                      <span>{new Date(booking.preferredDate).toLocaleDateString()}</span>
                    </p>
                    <p className="text-slate-500 dark:text-gray-400 font-mono ml-4">
                      {new Date(booking.preferredDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  {/* Submission date */}
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Requested On</p>
                    <p className="text-slate-500 dark:text-gray-400">
                      {new Date(booking.createdAt).toLocaleDateString()} at{" "}
                      {new Date(booking.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="bg-black/25 p-3 rounded-lg border border-white/5 text-xs text-gray-300 mt-2 italic max-w-2xl leading-relaxed">
                    <span className="font-semibold text-slate-500 dark:text-gray-400 block not-italic uppercase tracking-wider mb-1 text-[9px]">User Topics & Goals:</span>
                    &quot;{booking.notes}&quot;
                  </div>
                )}
              </div>

              {/* Right Section: Action Controls */}
              <div className="flex md:flex-col gap-2 shrink-0 md:justify-start items-center md:items-stretch">
                {booking.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                      className="px-4 py-2 bg-elite-green/10 hover:bg-elite-green text-elite-green hover:text-elite-bg border border-elite-green/20 hover:border-transparent font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={13} /> Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                      className="px-4 py-2 bg-elite-red/10 hover:bg-elite-red text-elite-red hover:text-elite-bg border border-elite-red/20 hover:border-transparent font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <XCircle size={13} /> Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={() => openReschedule(booking)}
                  className="px-4 py-2 bg-elite-gold/10 hover:bg-elite-gold text-elite-gold hover:text-elite-bg border border-elite-gold/20 hover:border-transparent font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <Calendar size={13} /> Reschedule
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reschedule Modal Overlay */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedBooking(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-md p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5 border-b border-gray-200 dark:border-white/10 pb-3">
                <h3 className="font-display text-lg text-slate-900 dark:text-slate-900 dark:text-white font-bold tracking-wider">RESCHEDULE SESSION</h3>
                <button onClick={() => setSelectedBooking(null)} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <p className="text-slate-500 dark:text-gray-400 text-xs leading-relaxed">
                  Reschedule the training session request for <strong className="text-slate-900 dark:text-slate-900 dark:text-white">{selectedBooking.user.name}</strong>. User will receive an automated email notification and dashboard alert.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase mb-2">New Date</label>
                    <input
                      type="date"
                      required
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="input-field py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase mb-2">New Time</label>
                    <input
                      type="time"
                      required
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      className="input-field py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(null)}
                    className="btn-outline py-2 px-4 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5"
                  >
                    {updating ? (
                      <>
                        <Loader2 size={13} className="animate-spin" /> Rescheduling...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={13} /> Confirm Reschedule
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
