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
} from "lucide-react";

const stats = [
  { label: "Total Members", value: 2437, change: 12.5, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Active Subscribers", value: 892, change: 8.2, icon: DollarSign, color: "text-elite-green", bg: "bg-elite-green/10" },
  { label: "Signals This Month", value: 156, change: 23.1, icon: Signal, color: "text-elite-gold", bg: "bg-elite-gold/10" },
  { label: "Revenue", value: "$24,560", change: 15.3, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-400/10" },
];

const recentActivity = [
  { action: "New signal posted", detail: "EUR/USD BUY", time: "2 min ago", type: "signal" },
  { action: "User registered", detail: "john.doe@email.com", time: "5 min ago", type: "user" },
  { action: "Subscription upgraded", detail: "Premium to Copy Trader", time: "12 min ago", type: "payment" },
  { action: "Video uploaded", detail: "Risk Management Masterclass", time: "1 hour ago", type: "content" },
  { action: "Signal closed", detail: "GBP/JPY SELL - +45 pips", time: "2 hours ago", type: "signal" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-white tracking-wider">ADMIN DASHBOARD</h1>
        <span className="text-gray-500 text-sm">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
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
            <p className="font-display text-2xl text-white">{stat.value}</p>
            <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

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
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} border border-white/5 flex items-center justify-center mb-4`}>
                <Activity size={22} className="text-white" />
              </div>
              <h3 className="font-display text-lg text-white tracking-wider">{action.label}</h3>
              <p className="text-gray-400 text-sm mt-1">{action.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <h2 className="font-display text-xl text-white tracking-wider mb-6">RECENT ACTIVITY</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === "signal" ? "bg-elite-gold" :
                  activity.type === "user" ? "bg-blue-400" :
                  activity.type === "payment" ? "bg-elite-green" : "bg-purple-400"
                }`} />
                <div>
                  <p className="text-white text-sm font-medium">{activity.action}</p>
                  <p className="text-gray-500 text-xs">{activity.detail}</p>
                </div>
              </div>
              <span className="text-gray-500 text-xs">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
