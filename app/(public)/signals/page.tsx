"use client";

import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowRight, Clock, Eye, X } from "lucide-react";
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
  chartImage?: string;
  createdAt: string;
}

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 5000);
    return () => clearInterval(interval);
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
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-[#08080A] transition-colors duration-300">
      <div className="section-padding">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-[#1D4ED8] text-sm font-semibold tracking-widest uppercase">Live Signals</span>
            <h1 className="font-display text-4xl md:text-6xl text-slate-900 dark:text-white mt-3 tracking-wider font-bold">
              <span>TRADING</span> <span className="text-[#1D4ED8]">SIGNALS</span>
            </h1>
            <p className="text-slate-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              View our recent trading signals and performance history. Create a free account to access our real-time interactive trading dashboard.
            </p>
          </div>
        </ScrollReveal>

        {/* Signals List */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-slate-900 dark:text-white tracking-wider font-bold">LATEST SIGNALS</h2>
            <span className="text-xs text-[#00E676] bg-[#00E676]/10 px-3 py-1 rounded-full border border-[#00E676]/20">
              Live Preview
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : signals.length === 0 ? (
            <div className="bg-white dark:bg-[#111116] border border-gray-200 dark:border-white/10 rounded-2xl p-12 text-center text-slate-500 dark:text-gray-500 shadow-sm">
              No active signals at the moment. Check back soon!
            </div>
          ) : (
            <div className="space-y-4">
              {signals.map((signal, i) => (
                <ScrollReveal key={signal._id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-white dark:bg-[#111116] border border-gray-200 dark:border-white/10 rounded-2xl p-6 border-l-4 shadow-sm transition-colors duration-300"
                    style={{
                      borderLeftColor: signal.type === "BUY" ? "#00E676" : "#FF1744",
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            signal.type === "BUY" ? "bg-[#00E676]/10" : "bg-[#1D4ED8]/10"
                          }`}
                        >
                          {signal.type === "BUY" ? (
                            <TrendingUp size={24} className="text-[#00E676]" />
                          ) : (
                            <TrendingDown size={24} className="text-[#1D4ED8]" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-lg text-slate-900 dark:text-white">{signal.pair}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold ${
                                signal.type === "BUY"
                                  ? "bg-[#00E676]/15 text-[#00E676]"
                                  : "bg-[#1D4ED8]/15 text-[#1D4ED8]"
                              }`}
                            >
                              {signal.type}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-gray-500 bg-slate-100 dark:bg-[#16161D] px-2 py-0.5 rounded">
                              {signal.timeframe}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-slate-600 dark:text-gray-400">
                            <span className="font-mono">Entry: {signal.entryPrice}</span>
                            <span className="font-mono text-[#1D4ED8]">SL: {signal.stopLoss}</span>
                            <span className="font-mono text-[#00E676]">TP: {signal.takeProfit1}</span>
                            {signal.takeProfit2 && (
                              <span className="font-mono text-[#00E676]">TP2: {signal.takeProfit2}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              signal.status === "Active"
                                ? "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20"
                                : signal.result === "Win"
                                ? "bg-[#00E676]/10 text-[#00E676]"
                                : "bg-[#1D4ED8]/10 text-[#1D4ED8]"
                            }`}
                          >
                            <Clock size={12} />
                            {signal.status === "Active" ? "Active" : signal.result}
                          </span>
                        </div>
                        {signal.pips !== undefined && signal.pips !== null && (
                          <span className={`font-mono font-semibold text-sm ${signal.pips >= 0 ? "text-[#00E676]" : "text-[#1D4ED8]"}`}>
                            {signal.pips >= 0 ? "+" : ""}{signal.pips} pips
                          </span>
                        )}
                        <span className="text-xs text-slate-500 dark:text-gray-500">{formatDate(signal.createdAt)}</span>
                      </div>
                    </div>

                    {signal.chartImage && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                        <span className="text-[10px] text-slate-500 dark:text-gray-500 block mb-2 font-medium">Trade Analysis Chart:</span>
                        <button
                          onClick={() => setLightboxImage(signal.chartImage || null)}
                          className="relative group block overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 max-w-sm"
                        >
                          <img src={signal.chartImage} alt="Trade Chart" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <span className="text-white text-xs font-semibold flex items-center gap-1">
                              <Eye size={14} /> View Full Chart
                            </span>
                          </div>
                        </button>
                      </div>
                    )}
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>

        {/* Free Dashboard CTA Card */}
        <ScrollReveal>
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <div className="bg-white dark:bg-[#111116] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm bg-gradient-to-br from-[#1D4ED8]/5 to-transparent">
              <h2 className="font-display text-2xl text-slate-900 dark:text-white tracking-wider mb-3 font-bold">WANT REAL-TIME ALERTS &amp; ANALYTICS?</h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm max-w-xl mx-auto mb-6">
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 cursor-zoom-out"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightboxImage} alt="Trade Chart Full" className="w-full h-auto max-h-[80vh] rounded-xl object-contain border border-white/10" />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/95 text-white rounded-full transition-colors border border-white/10"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
