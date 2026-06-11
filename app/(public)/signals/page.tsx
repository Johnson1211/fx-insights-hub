"use client";

import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, TrendingDown, Lock, ArrowRight, Clock, Target } from "lucide-react";
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

  const previewSignals = signals.slice(0, 3);
  const lockedSignals = signals.slice(3, 6);

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
              Preview our latest signals. Subscribe to Premium for full access to all active and historical signals with detailed analysis.
            </p>
          </div>
        </ScrollReveal>

        {/* Preview Signals */}
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
          ) : (
            <div className="space-y-4">
              {previewSignals.map((signal, i) => (
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
                            {signal.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(signal.createdAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>

        {/* Locked Signals */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-white tracking-wider">RECENT HISTORY</h2>
            <Lock size={16} className="text-elite-gold" />
          </div>

          <div className="space-y-4">
            {lockedSignals.map((signal, i) => (
              <ScrollReveal key={signal._id} delay={i * 0.1}>
                <div className="glass-card p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-elite-bg/80 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-center">
                      <Lock size={32} className="text-elite-gold mx-auto mb-3" />
                      <p className="text-white font-medium mb-2">Premium Members Only</p>
                      <p className="text-gray-400 text-sm mb-4">Subscribe to access full signal history</p>
                      <Link href="/services" className="btn-primary text-sm inline-flex items-center gap-2">
                        Unlock Access
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 opacity-30">
                    <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center">
                      <Target size={24} className="text-gray-500" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-lg text-white">{signal.pair}</span>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span className="font-mono">Entry: {signal.entryPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
