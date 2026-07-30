"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, AlertTriangle, CheckCircle, Info, Megaphone, Trash2, Loader2, Pin, ExternalLink } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isPinned: boolean;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [link, setLink] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Status message
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "success" });

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg({ text: "", type: "success" });

    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          type,
          link: link || null,
          isPinned,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create announcement");

      setStatusMsg({ text: "Announcement broadcasted successfully!", type: "success" });
      setTitle("");
      setMessage("");
      setLink("");
      setIsPinned(false);
      setType("info");
      
      // Refresh list
      fetchNotifications();
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Failed to create announcement", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    
    try {
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotifications(notifications.filter((n) => n.id !== id));
      } else {
        alert("Failed to delete notification");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const getTypeIcon = (typeVal: string) => {
    switch (typeVal) {
      case "warning":
        return <AlertTriangle size={16} className="text-amber-400" />;
      case "success":
        return <CheckCircle size={16} className="text-elite-green" />;
      case "alert":
        return <Megaphone size={16} className="text-elite-red" />;
      default:
        return <Info size={16} className="text-blue-400" />;
    }
  };

  const getTypeClasses = (typeVal: string) => {
    switch (typeVal) {
      case "warning":
        return "border-amber-500/20 bg-amber-500/5 text-amber-400";
      case "success":
        return "border-emerald-500/20 bg-emerald-500/5 text-elite-green";
      case "alert":
        return "border-red-500/20 bg-red-500/5 text-elite-red";
      default:
        return "border-blue-500/20 bg-blue-500/5 text-blue-400";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-slate-900 dark:text-slate-900 dark:text-white tracking-wider flex items-center gap-3">
          <Bell className="text-elite-gold" /> NOTIFICATIONS & ANNOUNCEMENTS
        </h1>
        <span className="text-slate-500 dark:text-gray-400 text-sm">Send real-time alerts to all users</span>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Creator Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 border border-gray-200 dark:border-white/10">
            <h2 className="font-display text-xl text-slate-900 dark:text-slate-900 dark:text-white tracking-wider mb-6">CREATE ANNOUNCEMENT</h2>

            {statusMsg.text && (
              <div className={`p-4 rounded-lg text-sm text-center mb-6 border ${
                statusMsg.type === "success" 
                  ? "bg-elite-green/10 border-elite-green/20 text-elite-green" 
                  : "bg-elite-red/10 border-elite-red/20 text-elite-red"
              }`}>
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled Live Webinar Tonight"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field py-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type the message detail or announcements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field py-3 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Type / Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="input-field py-3 text-sm bg-white dark:bg-[#111116] select-custom"
                  >
                    <option value="info">Info (Blue)</option>
                    <option value="success">Success (Green)</option>
                    <option value="warning">Warning (Amber)</option>
                    <option value="alert">Alert/Important (Red)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Action Link (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. /dashboard/live"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="input-field py-3 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 border-t border-b border-gray-200 dark:border-white/10 my-4">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded border-elite-border bg-white dark:bg-[#111116] text-elite-gold focus:ring-elite-gold focus:ring-offset-elite-bg cursor-pointer"
                />
                <label htmlFor="pinCheck" className="text-sm text-gray-300 font-medium select-none cursor-pointer flex items-center gap-2">
                  <Pin size={14} className={isPinned ? "text-elite-gold fill-elite-gold" : "text-slate-400 dark:text-slate-500 dark:text-gray-400"} />
                  Pin to Top Announcement Banner (Overrides previous pins)
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-semibold text-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Broadcasting Announcement...
                  </>
                ) : (
                  <>
                    <Megaphone size={16} />
                    Broadcast Announcement
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Banner Preview */}
          <div className="glass-card p-6 border border-gray-200 dark:border-white/10 bg-gradient-to-r from-elite-card/90 to-transparent">
            <h3 className="font-display text-sm text-slate-500 dark:text-gray-400 tracking-wider mb-4 uppercase">Top Banner Live Preview</h3>
            {isPinned ? (
              <div className={`p-4 rounded-xl border flex items-start gap-3 justify-between ${getTypeClasses(type)}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getTypeIcon(type)}</div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{title || "Announcement Title"}</h4>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">{message || "The body text details will be shown here as a ticker banner at the top of pages."}</p>
                    {link && (
                      <span className="inline-flex items-center gap-1 text-xs text-elite-gold font-medium mt-2 hover:underline">
                        Take Action <ExternalLink size={10} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 dark:text-gray-400 text-xs italic text-center py-4 bg-white/[0.01] rounded-lg">Check &quot;Pin to Top Announcement Banner&quot; to see a live banner preview</p>
            )}
          </div>
        </div>

        {/* Existing Broadcast History */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-6 border border-gray-200 dark:border-white/10 h-full flex flex-col">
            <h2 className="font-display text-xl text-slate-900 dark:text-slate-900 dark:text-white tracking-wider mb-6">BROADCAST HISTORY</h2>

            {loading ? (
              <div className="flex flex-col justify-center items-center py-12 flex-1">
                <Loader2 className="animate-spin text-elite-gold mb-2" size={24} />
                <span className="text-slate-500 dark:text-gray-400 text-sm">Loading broadcast history...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-gray-400 text-sm flex-1 flex items-center justify-center">
                No active announcements or notifications found.
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar flex-1">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 flex items-start justify-between gap-4 hover:border-elite-border/60 transition-colors">
                    <div className="flex gap-3 items-start">
                      <div className="mt-1">{getTypeIcon(notif.type)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-900 dark:text-white text-sm">{notif.title}</h4>
                          {notif.isPinned && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-elite-gold/20 text-elite-gold border border-elite-gold/30 flex items-center gap-1">
                              <Pin size={8} className="fill-elite-gold" /> Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 dark:text-gray-400 text-xs mt-1 leading-relaxed">{notif.message}</p>
                        <div className="flex gap-4 items-center mt-3 text-[10px] text-slate-500 dark:text-gray-400">
                          <span>{new Date(notif.createdAt).toLocaleString()}</span>
                          {notif.link && (
                            <span className="flex items-center gap-1 text-elite-gold">
                              Link: {notif.link}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="p-2 text-slate-500 dark:text-gray-400 hover:text-elite-red hover:bg-elite-red/10 rounded-lg transition-colors shrink-0"
                      title="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
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
