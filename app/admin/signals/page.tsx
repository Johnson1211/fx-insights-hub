"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, TrendingUp, TrendingDown, Trash2, X, Save } from "lucide-react";

interface Signal {
  _id: string;
  pair: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2?: number;
  timeframe: string;
  analysis: string;
  status: string;
  result?: string;
  pips?: number;
  createdAt: string;
}

const PAIRS = ["EUR/USD", "GBP/USD", "USD/JPY", "XAU/USD", "BTC/USD", "GBP/JPY", "AUD/USD", "USD/CHF", "EUR/GBP", "NZD/USD"];
const TIMEFRAMES = ["M15", "H1", "H4", "D1"];

export default function AdminSignals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    pair: "EUR/USD",
    type: "BUY" as "BUY" | "SELL",
    entryPrice: "",
    stopLoss: "",
    takeProfit1: "",
    takeProfit2: "",
    timeframe: "H1",
    analysis: "",
  });

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    try {
      const res = await fetch("/api/admin/signals");
      const data = await res.json();
      setSignals(data.signals || []);
    } catch (error) {
      console.error("Failed to fetch signals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          entryPrice: parseFloat(formData.entryPrice),
          stopLoss: parseFloat(formData.stopLoss),
          takeProfit1: parseFloat(formData.takeProfit1),
          takeProfit2: formData.takeProfit2 ? parseFloat(formData.takeProfit2) : undefined,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({
          pair: "EUR/USD",
          type: "BUY",
          entryPrice: "",
          stopLoss: "",
          takeProfit1: "",
          takeProfit2: "",
          timeframe: "H1",
          analysis: "",
        });
        fetchSignals();
      }
    } catch (error) {
      console.error("Failed to create signal:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this signal?")) return;
    try {
      await fetch(`/api/admin/signals?id=${id}`, { method: "DELETE" });
      fetchSignals();
    } catch (error) {
      console.error("Failed to delete signal:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-white tracking-wider">SIGNAL MANAGEMENT</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "New Signal"}
        </button>
      </div>

      {/* Create Signal Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-card p-6"
        >
          <h2 className="font-display text-lg text-white tracking-wider mb-6">CREATE NEW SIGNAL</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Currency Pair</label>
              <select
                value={formData.pair}
                onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
                className="input-field"
              >
                {PAIRS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Signal Type</label>
              <div className="flex gap-2">
                {(["BUY", "SELL"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: t })}
                    className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
                      formData.type === t
                        ? t === "BUY"
                          ? "bg-elite-green/20 text-elite-green border border-elite-green/30"
                          : "bg-elite-red/20 text-elite-red border border-elite-red/30"
                        : "bg-elite-surface text-gray-400 border border-elite-border"
                    }`}
                  >
                    {t === "BUY" ? <TrendingUp size={16} className="inline mr-1" /> : <TrendingDown size={16} className="inline mr-1" />}
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Timeframe</label>
              <select
                value={formData.timeframe}
                onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                className="input-field"
              >
                {TIMEFRAMES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Entry Price</label>
              <input
                type="number"
                step="0.00001"
                required
                value={formData.entryPrice}
                onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                className="input-field"
                placeholder="1.08450"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Stop Loss</label>
              <input
                type="number"
                step="0.00001"
                required
                value={formData.stopLoss}
                onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                className="input-field"
                placeholder="1.08200"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Take Profit 1</label>
              <input
                type="number"
                step="0.00001"
                required
                value={formData.takeProfit1}
                onChange={(e) => setFormData({ ...formData, takeProfit1: e.target.value })}
                className="input-field"
                placeholder="1.09000"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Take Profit 2 (Optional)</label>
              <input
                type="number"
                step="0.00001"
                value={formData.takeProfit2}
                onChange={(e) => setFormData({ ...formData, takeProfit2: e.target.value })}
                className="input-field"
                placeholder="1.09500"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm text-gray-400 mb-2">Analysis / Notes</label>
              <textarea
                rows={3}
                value={formData.analysis}
                onChange={(e) => setFormData({ ...formData, analysis: e.target.value })}
                className="input-field resize-none"
                placeholder="Technical analysis and reasoning for this signal..."
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save size={16} />
                Publish Signal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Signals List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-elite-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {signals.map((signal, i) => (
            <motion.div
              key={signal._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card p-5 border-l-4"
              style={{ borderLeftColor: signal.type === "BUY" ? "#00E676" : "#FF1744" }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    signal.type === "BUY" ? "bg-elite-green/10" : "bg-elite-red/10"
                  }`}>
                    {signal.type === "BUY" ? (
                      <TrendingUp size={20} className="text-elite-green" />
                    ) : (
                      <TrendingDown size={20} className="text-elite-red" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{signal.pair}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                        signal.type === "BUY" ? "bg-elite-green/20 text-elite-green" : "bg-elite-red/20 text-elite-red"
                      }`}>
                        {signal.type}
                      </span>
                      <span className="text-xs text-gray-500 bg-elite-surface px-2 py-0.5 rounded">{signal.timeframe}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                      <span className="font-mono">E: {signal.entryPrice}</span>
                      <span className="font-mono text-elite-red">SL: {signal.stopLoss}</span>
                      <span className="font-mono text-elite-green">TP: {signal.takeProfit1}</span>
                      {signal.takeProfit2 && (
                        <span className="font-mono text-elite-green">TP2: {signal.takeProfit2}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    signal.status === "Active"
                      ? "bg-elite-green/10 text-elite-green border border-elite-green/20"
                      : signal.result === "Win"
                      ? "bg-elite-green/10 text-elite-green"
                      : "bg-elite-red/10 text-elite-red"
                  }`}>
                    {signal.status}
                  </span>
                  <button
                    onClick={() => handleDelete(signal._id)}
                    className="p-2 text-gray-500 hover:text-elite-red transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
