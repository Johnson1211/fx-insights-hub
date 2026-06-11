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
} from "lucide-react";

interface DashboardStats {
  signalsThisMonth: number;
  videosWatched: number;
  copyTradingActive: boolean;
  winRate: number;
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    signalsThisMonth: 24,
    videosWatched: 12,
    copyTradingActive: false,
    winRate: 87,
  });

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
            <h1 className="font-display text-3xl md:text-4xl text-white tracking-wider">
              WELCOME BACK, <span className="gold-gradient-text">{user?.name?.split(" ")[0]?.toUpperCase() || "TRADER"}</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Here&apos;s what&apos;s happening in your trading journey today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Crown size={16} className="text-elite-gold" />
            <span className="text-elite-gold font-medium capitalize">{user?.plan} Plan</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Signals This Month", value: stats.signalsThisMonth, icon: Signal, color: "text-elite-gold", bg: "bg-elite-gold/10" },
          { label: "Videos Watched", value: stats.videosWatched, icon: Video, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Win Rate", value: `${stats.winRate}%`, icon: Target, color: "text-elite-green", bg: "bg-elite-green/10" },
          { label: "Copy Trading", value: stats.copyTradingActive ? "Active" : "Inactive", icon: Copy, color: stats.copyTradingActive ? "text-elite-green" : "text-gray-500", bg: stats.copyTradingActive ? "bg-elite-green/10" : "bg-gray-500/10" },
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
            <p className="font-display text-2xl text-white">{stat.value}</p>
            <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: "Latest Signals",
            description: "View today's active trading signals",
            icon: Signal,
            href: "/dashboard/signals",
            color: "from-elite-gold/20 to-amber-600/20",
          },
          {
            title: "Video Library",
            description: "Continue your education",
            icon: BookOpen,
            href: "/dashboard/videos",
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
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} border border-white/5 flex items-center justify-center mb-4`}>
                <action.icon size={22} className="text-white" />
              </div>
              <h3 className="font-display text-lg text-white tracking-wider mb-1">{action.title}</h3>
              <p className="text-gray-400 text-sm">{action.description}</p>
              <div className="flex items-center gap-1 mt-4 text-elite-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
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
          <h2 className="font-display text-xl text-white tracking-wider">RECENT ACTIVITY</h2>
          <Link href="/dashboard/signals" className="text-elite-gold text-sm hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {[
            { pair: "EUR/USD", type: "BUY", result: "TP Hit", pips: 45, time: "2 hours ago" },
            { pair: "GBP/JPY", type: "SELL", result: "Active", pips: 12, time: "5 hours ago" },
            { pair: "XAU/USD", type: "BUY", result: "TP Hit", pips: 78, time: "1 day ago" },
            { pair: "USD/CHF", type: "SELL", result: "SL Hit", pips: -15, time: "2 days ago" },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.type === "BUY" ? "bg-elite-green/10" : "bg-elite-red/10"
                }`}>
                  <TrendingUp size={18} className={activity.type === "BUY" ? "text-elite-green" : "text-elite-red"} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-white">{activity.pair}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      activity.type === "BUY" ? "bg-elite-green/20 text-elite-green" : "bg-elite-red/20 text-elite-red"
                    }`}>
                      {activity.type}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                    <Clock size={10} />
                    {activity.time}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`font-mono font-semibold ${activity.pips >= 0 ? "text-elite-green" : "text-elite-red"}`}>
                  {activity.pips >= 0 ? "+" : ""}{activity.pips} pips
                </span>
                <p className="text-gray-500 text-xs">{activity.result}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
