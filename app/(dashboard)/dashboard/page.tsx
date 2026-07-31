"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  Signal,
  Video,
  Copy,
  Crown,
  ArrowRight,
  Clock,
  Target,
  Zap,
  BookOpen,
  Loader2,
} from "lucide-react";

interface ActivityItem {
  id: string;
  pair: string;
  type: string;
  status: string;
  result: string;
  pips: number;
  createdAt: string;
}

interface DashboardStats {
  signalsThisMonth: number;
  lessonsWatched: number;
  copyTradingActive: boolean;
  winRate: number;
  recentActivity: ActivityItem[];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const data = await res.json();
        
        let watchedCount = 0;
        if (typeof window !== "undefined") {
          try {
            const watched = JSON.parse(localStorage.getItem("watched_videos") || "[]");
            watchedCount = Array.isArray(watched) ? watched.length : 0;
          } catch (e) {
            console.error(e);
          }
        }

        if (res.ok && data.stats) {
          setStats({
            signalsThisMonth: data.stats.signalsThisMonth,
            lessonsWatched: watchedCount,
            copyTradingActive: data.stats.copyTradingActive,
            winRate: data.stats.winRate,
            recentActivity: data.stats.recentActivity || [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      getStats();
    }
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-white tracking-wider">
              WELCOME BACK, <span className="text-[#FF4053]">{user?.name?.split(" ")[0]?.toUpperCase() || "TRADER"}</span>
            </h1>
            <p className="text-slate-500 dark:text-gray-400 mt-2">
              Here&apos;s what&apos;s happening in your trading journey today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Crown size={16} className="text-[#FF4053]" />
            <span className="text-[#FF4053] font-medium capitalize">{user?.plan} Plan</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12 glass-card">
          <Loader2 className="animate-spin text-elite-gold mr-2" size={24} />
          <span className="text-slate-500 dark:text-gray-400 text-sm">Retrieving your trading performance...</span>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Signals This Month", value: stats.signalsThisMonth, icon: Signal, color: "text-[#FF4053]", bg: "bg-[#FF4053]/10" },
            { label: "Lessons Watched", value: stats.lessonsWatched, icon: Video, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Win Rate", value: `${stats.winRate}%`, icon: Target, color: "text-[#00E676]", bg: "bg-[#00E676]/10" },
            { label: "Copy Trading", value: stats.copyTradingActive ? "Active" : "Inactive", icon: Copy, color: stats.copyTradingActive ? "text-[#00E676]" : "text-slate-400 dark:text-slate-500 dark:text-gray-400", bg: stats.copyTradingActive ? "bg-[#00E676]/10" : "bg-slate-100 dark:bg-gray-500/10" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <p className="font-display text-2xl text-slate-900 dark:text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-slate-500 dark:text-slate-500 dark:text-gray-400 text-xs mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: "Latest Signals",
            description: "View today's active trading signals",
            icon: Signal,
            href: "/dashboard/signals",
            color: "from-elite-gold/20 to-blue-600/20",
          },
          {
            title: "Courses",
            description: "Continue your education",
            icon: BookOpen,
            href: "/dashboard/courses",
            color: "from-blue-500/20 to-blue-700/20",
          },
          {
            title: "Live Session",
            description: "Next session in 2 hours",
            icon: Zap,
            href: "/dashboard/live",
            color: "from-elite-green/20 to-green-700/20",
          },
        ].map((action, i) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <Link
              href={action.href}
              className="glass-card-hover p-6 block group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} border border-[#FF4053]/10 flex items-center justify-center mb-4`}>
                <action.icon size={22} className="text-slate-900 dark:text-slate-900 dark:text-white" />
              </div>
              <h3 className="font-display text-lg text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-white tracking-wider mb-1">{action.title}</h3>
              <p className="text-slate-500 dark:text-gray-400 text-sm">{action.description}</p>
              <div className="flex items-center gap-1 mt-4 text-[#FF4053] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Go</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-white tracking-wider">RECENT ACTIVITY</h2>
          <Link href="/dashboard/signals" className="text-[#FF4053] text-sm hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="py-8 text-center text-slate-400 dark:text-gray-500 text-sm">
              Loading recent activity...
            </div>
          ) : !stats?.recentActivity || stats.recentActivity.length === 0 ? (
            <div className="py-8 text-center text-slate-400 dark:text-gray-500 text-sm">
              No recent signal activity in database.
            </div>
          ) : (
            stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-[#FF4053]/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === "BUY" ? "bg-[#00E676]/10" : "bg-[#FF4053]/10"
                  }`}>
                    <TrendingUp size={18} className={activity.type === "BUY" ? "text-[#00E676]" : "text-[#FF4053]"} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">{activity.pair}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                        activity.type === "BUY" ? "bg-[#00E676]/20 text-[#00E676]" : "bg-[#FF4053]/20 text-[#FF4053]"
                      }`}>
                        {activity.type}
                      </span>
                    </div>
                    <p className="text-slate-400 dark:text-gray-400 text-xs flex items-center gap-1 mt-1">
                      <Clock size={10} />
                      {timeAgo(activity.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-mono font-semibold ${activity.pips >= 0 ? "text-elite-green" : "text-elite-red"}`}>
                    {activity.pips >= 0 ? "+" : ""}{activity.pips} pips
                  </span>
                  <p className="text-slate-500 dark:text-gray-400 text-xs capitalize">{activity.result}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
