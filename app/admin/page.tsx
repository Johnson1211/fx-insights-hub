"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Signal,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminStats {
  totalMembers: number;
  membersChange: number;
  activeSubscribers: number;
  subscribersChange: number;
  signalsThisMonth: number;
  signalsChange: number;
  revenue: number;
  revenueChange: number;
  manualProfits: number;
}

function timeAgo(dateString: string) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.round(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } catch {
    return dateString;
  }
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Manual profits state
  const [manualProfitsVal, setManualProfitsVal] = useState<string>("");
  const [savingProfits, setSavingProfits] = useState(false);
  const [profitsMessage, setProfitsMessage] = useState({ text: "", type: "success" });

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (res.ok) {
          setStats(data.stats);
          setRecentActivity(data.recentActivity || []);
          if (data.stats && data.stats.manualProfits !== undefined) {
            setManualProfitsVal(data.stats.manualProfits.toString());
          }
        }
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminStats();
  }, []);

  const handleSaveProfits = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfits(true);
    setProfitsMessage({ text: "", type: "success" });

    try {
      const res = await fetch("/api/admin/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manualProfits: Number(manualProfitsVal) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save manual profits");

      setProfitsMessage({ text: "Manual profits updated successfully!", type: "success" });
      if (stats) {
        setStats({ ...stats, manualProfits: Number(manualProfitsVal) });
      }
    } catch (err: any) {
      setProfitsMessage({ text: err.message || "Failed to update manual profits", type: "error" });
    } finally {
      setSavingProfits(false);
    }
  };

  const statsItems = stats ? [
    { label: "Total Members", value: stats.totalMembers, change: stats.membersChange, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Active Subscribers", value: stats.activeSubscribers, change: stats.subscribersChange, icon: DollarSign, color: "text-elite-green", bg: "bg-elite-green/10" },
    { label: "Signals This Month", value: stats.signalsThisMonth, change: stats.signalsChange, icon: Signal, color: "text-elite-gold", bg: "bg-elite-gold/10" },
    { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, change: stats.revenueChange, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-400/10" },
  ] : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-white tracking-wider">ADMIN DASHBOARD</h1>
        <span className="text-slate-400 dark:text-slate-500 dark:text-gray-400 text-sm">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12 glass-card">
          <Loader2 className="animate-spin text-elite-gold mr-2" size={24} />
          <span className="text-slate-500 dark:text-gray-400 text-sm">Loading admin performance metrics...</span>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsItems.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.change >= 0 ? "text-elite-green" : "text-elite-red"}`}>
                  {stat.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <p className="font-display text-2xl text-slate-900 dark:text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-slate-500 dark:text-slate-500 dark:text-gray-400 text-xs mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Create Signal", href: "/admin/signals", desc: "Post a new trading signal", color: "from-elite-gold/20 to-blue-600/20" },
          { label: "Manage Users", href: "/admin/users", desc: "View and edit members", color: "from-blue-500/20 to-blue-700/20" },
          { label: "Upload Content", href: "/admin/content", desc: "Add videos or blog posts", color: "from-purple-500/20 to-purple-700/20" },
        ].map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <Link
              href={action.href}
              className="glass-card-hover p-6 block"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} border border-[#FF4053]/10 flex items-center justify-center mb-4`}>
                <Activity size={22} className="text-slate-900 dark:text-slate-900 dark:text-white" />
              </div>
              <h3 className="font-display text-lg text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-white tracking-wider">{action.label}</h3>
              <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">{action.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Combined Activity and Manual Profits section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h2 className="font-display text-xl text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-white tracking-wider mb-6">RECENT ACTIVITY</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-6 text-slate-500 dark:text-gray-400 text-sm">
                Loading activities...
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-6 text-slate-500 dark:text-gray-400 text-sm">
                No recent activity found.
              </div>
            ) : (
              recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-[#FF4053]/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === "signal" ? "bg-[#FF4053]" :
                      activity.type === "user" ? "bg-blue-400" :
                      activity.type === "payment" ? "bg-[#00E676]" : "bg-purple-400"
                    }`} />
                    <div>
                      <p className="text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-white text-sm font-medium">{activity.action}</p>
                      <p className="text-slate-500 dark:text-slate-500 dark:text-gray-400 text-xs">{activity.detail}</p>
                    </div>
                  </div>
                  <span className="text-slate-400 dark:text-slate-500 dark:text-gray-400 text-xs">{timeAgo(activity.time)}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Manual Profits Statistic Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6 flex flex-col justify-between"
        >
          <div>
            <h2 className="font-display text-xl text-slate-900 dark:text-white tracking-wider mb-6">MANUAL PROFITS</h2>
            <p className="text-slate-500 dark:text-gray-400 text-xs leading-relaxed mb-6">
              Manually set the &quot;Profits Generated&quot; statistic shown on the public landing page. This overrides automatic pip calculations.
            </p>

            {profitsMessage.text && (
              <div className={`p-3 rounded-lg text-xs text-center mb-4 border ${
                profitsMessage.type === "success" 
                  ? "bg-elite-green/10 border-elite-green/20 text-elite-green" 
                  : "bg-elite-red/10 border-elite-red/20 text-elite-red"
              }`}>
                {profitsMessage.text}
              </div>
            )}

            <form onSubmit={handleSaveProfits} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Total Profits ($)</label>
                <input
                  type="number"
                  required
                  disabled={user?.role !== "superadmin"}
                  placeholder="e.g. 1200000"
                  value={manualProfitsVal}
                  onChange={(e) => setManualProfitsVal(e.target.value)}
                  className="input-field py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={savingProfits || user?.role !== "superadmin"}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {savingProfits ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : user?.role === "superadmin" ? (
                  "Save Profits"
                ) : (
                  "Superadmin Only"
                )}
              </button>
            </form>
          </div>
          <div className="mt-8 border-t border-gray-200 dark:border-white/5 pt-4 text-center">
            <span className="text-[10px] text-slate-400 dark:text-gray-600 block">
              {user?.role === "superadmin" ? "System settings update immediately" : "Superadmin privilege required to edit stats"}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
