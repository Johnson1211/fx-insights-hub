"use client";

import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowRight, Clock } from "lucide-react";
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
  createdAt: string;
}

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    try {
      const res = await fetch("/api/signals?limit=10");
      const data = await res.json();
      setSignals(data.signals || []);
    } catch (error) {
      console.error("Failed to fetch signals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="section-padding">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Live Signals</span>
            <h1 className="font-display text-4xl md:text-6xl text-white mt-3 tracking-wider">
              TRADING <span className="gold-gradient-text">SIGNALS</span>
            </h1>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              View our recent trading signals and performance history. Create a free account to access our real-time interactive trading dashboard.
            </p>
          </div>
        </ScrollReveal>

        {/* Signals List */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-white tracking-wider">LATEST SIGNALS</h2>
            <span className="text-xs text-elite-green bg-elite-green/10 px-3 py-1 rounded-full border border-elite-green/20">
              Live Preview
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-elite-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : signals.length === 0 ? (
            <div className="glass-card p-12 text-center text-gray-500">
              No active signals at the moment. Check back soon!
            </div>
          ) : (
            <div className="space-y-4">
              {signals.map((signal, i) => (
                <ScrollReveal key={signal._id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="glass-card p-6 border-l-4"
                    style={{
                      borderLeftColor: signal.type === "BUY" ? "#00E676" : "#FF1744",
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            signal.type === "BUY" ? "bg-elite-green/10" : "bg-elite-red/10"
                          }`}
                        >
                          {signal.type === "BUY" ? (
                            <TrendingUp size={24} className="text-elite-green" />
                          ) : (
                            <TrendingDown size={24} className="text-elite-red" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-lg text-white">{signal.pair}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold ${
                                signal.type === "BUY"
                                  ? "bg-elite-green/20 text-elite-green"
                                  : "bg-elite-red/20 text-elite-red"
                              }`}
                            >
                              {signal.type}
                            </span>
                            <span className="text-xs text-gray-500 bg-elite-surface px-2 py-0.5 rounded">
                              {signal.timeframe}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                            <span className="font-mono">Entry: {signal.entryPrice}</span>
                            <span className="font-mono text-elite-red">SL: {signal.stopLoss}</span>
                            <span className="font-mono text-elite-green">TP: {signal.takeProfit1}</span>
                            {signal.takeProfit2 && (
                              <span className="font-mono text-elite-green">TP2: {signal.takeProfit2}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              signal.status === "Active"
                                ? "bg-elite-green/10 text-elite-green border border-elite-green/20"
                                : signal.result === "Win"
                                ? "bg-elite-green/10 text-elite-green"
                                : "bg-elite-red/10 text-elite-red"
                            }`}
                          >
                            <Clock size={12} />
                            {signal.status === "Active" ? "Active" : signal.result}
                          </span>
                        </div>
                        {signal.pips !== undefined && signal.pips !== null && (
                          <span className={`font-mono font-semibold text-sm ${signal.pips >= 0 ? "text-elite-green" : "text-elite-red"}`}>
                            {signal.pips >= 0 ? "+" : ""}{signal.pips} pips
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{formatDate(signal.createdAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>

        {/* Free Dashboard CTA Card */}
        <ScrollReveal>
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <div className="glass-card p-8 bg-gradient-to-br from-elite-gold/5 to-transparent border border-elite-gold/15">
              <h2 className="font-display text-2xl text-white tracking-wider mb-3">WANT REAL-TIME ALERTS & ANALYTICS?</h2>
              <p className="text-gray-400 text-sm max-w-xl mx-auto mb-6">
                Sign up for a free membership to access our live trader dashboard, copy trading channels, full video libraries, and live webinars.
              </p>
              <Link href="/register" className="btn-primary text-sm inline-flex items-center gap-2">
                Create Free Account
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
