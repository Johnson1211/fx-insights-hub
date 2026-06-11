"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Filter, Search, Star, Clock, Target } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Signal {
  _id: string;
  pair: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2?: number;
  timeframe: string;
  status: string;
  result?: string;
  pips?: number;
  analysis: string;
  createdAt: string;
}

export default function DashboardSignals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [filtered, setFiltered] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSignals();
  }, []);

  useEffect(() => {
    let result = signals;
    if (filter !== "all") {
      result = result.filter((s) => s.status.toLowerCase() === filter);
    }
    if (search) {
      result = result.filter((s) => s.pair.toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(result);
  }, [signals, filter, search]);

  const fetchSignals = async () => {
    try {
      const res = await fetch("/api/signals?limit=50");
      const data = await res.json();
      setSignals(data.signals || []);
      setFiltered(data.signals || []);
    } catch (error) {
      console.error("Failed to fetch signals:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: signals.length,
    active: signals.filter((s) => s.status === "Active").length,
    wins: signals.filter((s) => s.result === "Win").length,
    totalPips: signals.reduce((acc, s) => acc + (s.pips || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-white tracking-wider">TRADING SIGNALS</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search pair..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 py-2 text-sm w-48"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field py-2 text-sm w-36"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Signals", value: stats.total, icon: Target, color: "text-elite-gold" },
          { label: "Active", value: stats.active, icon: Clock, color: "text-blue-400" },
          { label: "Wins", value: stats.wins, icon: TrendingUp, color: "text-elite-green" },
          { label: "Total Pips", value: stats.totalPips, icon: TrendingUp, color: stats.totalPips >= 0 ? "text-elite-green" : "text-elite-red" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={18} className={stat.color} />
              <span className="font-display text-2xl text-white">{stat.value}</span>
            </div>
            <p className="text-gray-500 text-xs">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Signals List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-elite-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((signal, i) => (
            <motion.div
              key={signal._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 border-l-4 hover:border-l-elite-gold transition-all"
              style={{
                borderLeftColor: signal.type === "BUY" ? "#00E676" : "#FF1744",
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    signal.type === "BUY" ? "bg-elite-green/10" : "bg-elite-red/10"
                  }`}>
                    {signal.type === "BUY" ? (
                      <TrendingUp size={24} className="text-elite-green" />
                    ) : (
                      <TrendingDown size={24} className="text-elite-red" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-lg text-white">{signal.pair}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        signal.type === "BUY" ? "bg-elite-green/20 text-elite-green" : "bg-elite-red/20 text-elite-red"
                      }`}>
                        {signal.type}
                      </span>
                      <span className="text-xs text-gray-500 bg-elite-surface px-2 py-0.5 rounded">
                        {signal.timeframe}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-400">Entry: <span className="font-mono text-white">{signal.entryPrice}</span></span>
                      <span className="text-gray-400">SL: <span className="font-mono text-elite-red">{signal.stopLoss}</span></span>
                      <span className="text-gray-400">TP: <span className="font-mono text-elite-green">{signal.takeProfit1}</span></span>
                      {signal.takeProfit2 && (
                        <span className="text-gray-400">TP2: <span className="font-mono text-elite-green">{signal.takeProfit2}</span></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    signal.status === "Active"
                      ? "bg-elite-green/10 text-elite-green border border-elite-green/20"
                      : signal.result === "Win"
                      ? "bg-elite-green/10 text-elite-green"
                      : "bg-elite-red/10 text-elite-red"
                  }`}>
                    {signal.status === "Active" ? "Active" : signal.result}
                  </span>
                  {signal.pips !== undefined && (
                    <span className={`font-mono font-semibold ${signal.pips >= 0 ? "text-elite-green" : "text-elite-red"}`}>
                      {signal.pips >= 0 ? "+" : ""}{signal.pips} pips
                    </span>
                  )}
                  <button className="text-gray-500 hover:text-elite-gold transition-colors">
                    <Star size={18} />
                  </button>
                  <span className="text-gray-500 text-xs">{formatDate(signal.createdAt)}</span>
                </div>
              </div>

              {signal.analysis && (
                <div className="mt-4 pt-4 border-t border-elite-border/30">
                  <p className="text-gray-400 text-sm">{signal.analysis}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
