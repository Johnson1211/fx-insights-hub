"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, TrendingUp, TrendingDown, Trash2, X, Save, Pencil, ChevronDown,
} from "lucide-react";

interface Signal {
  _id: string;
  pair: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2?: number;
  timeframe: string;
  volatilityIndex?: string;
  analysis: string;
  chartImage?: string;
  status: string;
  result?: string;
  pips?: number;
  createdAt: string;
}

type FormState = {
  pair: string;
  type: "BUY" | "SELL";
  entryPrice: string;
  stopLoss: string;
  takeProfit1: string;
  takeProfit2: string;
  timeframe: string;
  volatilityIndex: string;
  analysis: string;
  chartImage: string;
  status: string;
  result: string;
  pips: string;
};

const PAIRS = [
  "EUR/USD", "GBP/USD", "USD/JPY", "XAU/USD", "BTC/USD",
  "GBP/JPY", "AUD/USD", "USD/CHF", "EUR/GBP", "NZD/USD",
];
const TIMEFRAMES = ["M15", "H1", "H4", "D1"];

const emptyForm = (): FormState => ({
  pair: "EUR/USD",
  type: "BUY",
  entryPrice: "",
  stopLoss: "",
  takeProfit1: "",
  takeProfit2: "",
  timeframe: "H1",
  volatilityIndex: "",
  analysis: "",
  chartImage: "",
  status: "Active",
  result: "",
  pips: "",
});

const signalToForm = (s: Signal): FormState => ({
  pair: s.pair,
  type: s.type,
  entryPrice: String(s.entryPrice),
  stopLoss: String(s.stopLoss),
  takeProfit1: String(s.takeProfit1),
  takeProfit2: s.takeProfit2 ? String(s.takeProfit2) : "",
  timeframe: s.timeframe,
  volatilityIndex: s.volatilityIndex || "",
  analysis: s.analysis,
  chartImage: s.chartImage || "",
  status: s.status,
  result: s.result || "",
  pips: s.pips ? String(s.pips) : "",
});

export default function AdminSignals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormState>(emptyForm());

  // Edit state
  const [editingSignal, setEditingSignal] = useState<Signal | null>(null);
  const [editData, setEditData] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);

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

  const [chartUploading, setChartUploading] = useState(false);

  const handleChartUpload = async (
    file: File,
    data: FormState,
    set: React.Dispatch<React.SetStateAction<FormState>>
  ) => {
    setChartUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/supabase", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload failed");
      }
      const json = await res.json();
      set({ ...data, chartImage: json.url });
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setChartUploading(false);
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
          volatilityIndex: formData.volatilityIndex || undefined,
          chartImage: formData.chartImage || null,
          pips: formData.pips ? parseFloat(formData.pips) : undefined,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData(emptyForm());
        fetchSignals();
      }
    } catch (error) {
      console.error("Failed to create signal:", error);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSignal) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/signals?id=${editingSignal._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editData,
          entryPrice: parseFloat(editData.entryPrice),
          stopLoss: parseFloat(editData.stopLoss),
          takeProfit1: parseFloat(editData.takeProfit1),
          takeProfit2: editData.takeProfit2 ? parseFloat(editData.takeProfit2) : undefined,
          volatilityIndex: editData.volatilityIndex || undefined,
          chartImage: editData.chartImage || null,
          pips: editData.pips ? parseFloat(editData.pips) : undefined,
        }),
      });
      if (res.ok) {
        setEditingSignal(null);
        fetchSignals();
      }
    } catch (error) {
      console.error("Failed to edit signal:", error);
    } finally {
      setSaving(false);
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

  const openEdit = (signal: Signal) => {
    setEditingSignal(signal);
    setEditData(signalToForm(signal));
  };

  // Shared fields renderer to avoid duplication
  const renderFields = (
    data: FormState,
    set: React.Dispatch<React.SetStateAction<FormState>>,
    isEdit = false
  ) => (
    <>
      {/* Row 1: Pair / Type / Timeframe */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Currency Pair</label>
        <select
          value={data.pair}
          onChange={(e) => set({ ...data, pair: e.target.value })}
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
              onClick={() => set({ ...data, type: t })}
              className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
                data.type === t
                  ? t === "BUY"
                    ? "bg-elite-green/20 text-elite-green border border-elite-green/30"
                    : "bg-elite-red/20 text-elite-red border border-elite-red/30"
                  : "bg-elite-surface text-gray-400 border border-elite-border"
              }`}
            >
              {t === "BUY"
                ? <TrendingUp size={16} className="inline mr-1" />
                : <TrendingDown size={16} className="inline mr-1" />}
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Timeframe</label>
        <select
          value={data.timeframe}
          onChange={(e) => set({ ...data, timeframe: e.target.value })}
          className="input-field"
        >
          {TIMEFRAMES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Row 2: Entry / SL / TP1 */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Entry Price</label>
        <input
          type="number" step="0.00001" required
          value={data.entryPrice}
          onChange={(e) => set({ ...data, entryPrice: e.target.value })}
          className="input-field" placeholder="1.08450"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Stop Loss</label>
        <input
          type="number" step="0.00001" required
          value={data.stopLoss}
          onChange={(e) => set({ ...data, stopLoss: e.target.value })}
          className="input-field" placeholder="1.08200"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Take Profit 1</label>
        <input
          type="number" step="0.00001" required
          value={data.takeProfit1}
          onChange={(e) => set({ ...data, takeProfit1: e.target.value })}
          className="input-field" placeholder="1.09000"
        />
      </div>

      {/* Row 3: TP2 / Lot Size / (Status for edit) */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Take Profit 2 (Optional)</label>
        <input
          type="number" step="0.00001"
          value={data.takeProfit2}
          onChange={(e) => set({ ...data, takeProfit2: e.target.value })}
          className="input-field" placeholder="1.09500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Volatility Index
          <span className="ml-2 text-xs text-gray-600">(e.g. V75, V100, 0.01)</span>
        </label>
        <input
          type="text"
          value={data.volatilityIndex}
          onChange={(e) => set({ ...data, volatilityIndex: e.target.value })}
          className="input-field" placeholder="e.g. V75, V100, 1.00"
        />
      </div>

      {isEdit && (
        <div>
          <label className="block text-sm text-gray-400 mb-2">Status</label>
          <div className="flex gap-2">
            {(["Active", "Closed"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set({ ...data, status: s })}
                className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all border ${
                  data.status === s
                    ? s === "Active"
                      ? "bg-elite-green/20 text-elite-green border-elite-green/30"
                      : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                    : "bg-elite-surface text-gray-400 border-elite-border"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result & Pips — show on edit only */}
      {isEdit && (
        <>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Result</label>
            <select
              value={data.result}
              onChange={(e) => set({ ...data, result: e.target.value })}
              className="input-field"
            >
              <option value="">— None —</option>
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
              <option value="Breakeven">Breakeven</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Pips</label>
            <input
              type="number" step="0.1"
              value={data.pips}
              onChange={(e) => set({ ...data, pips: e.target.value })}
              className="input-field" placeholder="50"
            />
          </div>
        </>
      )}

      {/* Chart Image Upload */}
      <div className="md:col-span-2 lg:col-span-3">
        <label className="block text-sm text-gray-400 mb-2">Trade Chart Image (Supabase Storage)</label>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-elite-surface border border-elite-border">
          {data.chartImage ? (
            <div className="flex items-center gap-3 w-full justify-between">
              <div className="flex items-center gap-3">
                <img src={data.chartImage} alt="Chart preview" className="w-12 h-12 rounded-lg object-cover border border-elite-border" />
                <span className="text-xs text-gray-500 font-mono truncate max-w-[200px]">Chart uploaded</span>
              </div>
              <button
                type="button"
                onClick={() => set({ ...data, chartImage: "" })}
                className="text-xs text-elite-red hover:underline font-semibold"
              >
                Remove Chart
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleChartUpload(file, data, set);
                }}
                className="hidden"
                id={`chart-upload-${isEdit ? 'edit' : 'new'}`}
              />
              <label
                htmlFor={`chart-upload-${isEdit ? 'edit' : 'new'}`}
                className="btn-outline py-2 px-4 text-xs font-semibold cursor-pointer rounded-lg flex items-center gap-2"
              >
                {chartUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-elite-gold border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Choose Chart Image"
                )}
              </label>
              <span className="text-xs text-gray-500">Supports JPG, PNG, GIF up to 5MB</span>
            </div>
          )}
        </div>
      </div>

      {/* Full-width analysis */}
      <div className={isEdit ? "md:col-span-2 lg:col-span-3" : "md:col-span-2 lg:col-span-3"}>
        <label className="block text-sm text-gray-400 mb-2">Analysis / Notes</label>
        <textarea
          rows={3}
          value={data.analysis}
          onChange={(e) => set({ ...data, analysis: e.target.value })}
          className="input-field resize-none"
          placeholder="Technical analysis and reasoning for this signal..."
        />
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-white tracking-wider">SIGNAL MANAGEMENT</h1>
        <button
          onClick={() => { setShowForm(!showForm); setFormData(emptyForm()); }}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "New Signal"}
        </button>
      </div>

      {/* Create Signal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 overflow-hidden"
          >
            <h2 className="font-display text-lg text-white tracking-wider mb-6">CREATE NEW SIGNAL</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderFields(formData, setFormData, false)}
              <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save size={16} /> Publish Signal
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingSignal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setEditingSignal(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg text-white tracking-wider">
                  EDIT SIGNAL — <span className="text-elite-gold">{editingSignal.pair}</span>
                </h2>
                <button
                  onClick={() => setEditingSignal(null)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleEdit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderFields(editData, setEditData, true)}
                <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingSignal(null)}
                    className="btn-outline flex items-center gap-2"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex items-center gap-2 disabled:opacity-60"
                  >
                    <Save size={16} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signals List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-elite-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : signals.length === 0 ? (
        <div className="glass-card p-16 text-center text-gray-500">
          <TrendingUp size={40} className="mx-auto mb-4 opacity-30" />
          <p>No signals yet. Create your first signal above.</p>
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
                {/* Left: Icon + details */}
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    signal.type === "BUY" ? "bg-elite-green/10" : "bg-elite-red/10"
                  }`}>
                    {signal.type === "BUY"
                      ? <TrendingUp size={20} className="text-elite-green" />
                      : <TrendingDown size={20} className="text-elite-red" />}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-white">{signal.pair}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                        signal.type === "BUY"
                          ? "bg-elite-green/20 text-elite-green"
                          : "bg-elite-red/20 text-elite-red"
                      }`}>
                        {signal.type}
                      </span>
                      <span className="text-xs text-gray-500 bg-elite-surface px-2 py-0.5 rounded">
                        {signal.timeframe}
                      </span>
                      {signal.volatilityIndex && (
                        <span className="text-xs text-elite-gold bg-elite-gold/10 border border-elite-gold/20 px-2 py-0.5 rounded font-mono">
                          VI: {signal.volatilityIndex}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
                      <span className="font-mono">E: {signal.entryPrice}</span>
                      <span className="font-mono text-elite-red">SL: {signal.stopLoss}</span>
                      <span className="font-mono text-elite-green">TP1: {signal.takeProfit1}</span>
                      {signal.takeProfit2 && (
                        <span className="font-mono text-elite-green">TP2: {signal.takeProfit2}</span>
                      )}
                      {signal.pips != null && (
                        <span className="font-mono text-gray-500">{signal.pips > 0 ? "+" : ""}{signal.pips} pips</span>
                      )}
                    </div>
                    {signal.analysis && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1 max-w-md">{signal.analysis}</p>
                    )}
                    {signal.chartImage && (
                      <div className="mt-3">
                        <span className="text-[10px] text-gray-500 block mb-1">Attached Chart Image:</span>
                        <a href={signal.chartImage} target="_blank" rel="noopener noreferrer" className="inline-block group relative">
                          <img src={signal.chartImage} alt="Chart" className="w-40 h-24 rounded-lg object-cover border border-elite-border hover:opacity-90 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity">
                            <span className="text-[10px] text-white font-medium">View Original</span>
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Status + Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    signal.status === "Active"
                      ? "bg-elite-green/10 text-elite-green border-elite-green/20"
                      : signal.result === "Win"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                  }`}>
                    {signal.status}{signal.result ? ` · ${signal.result}` : ""}
                  </span>
                  <button
                    onClick={() => openEdit(signal)}
                    className="p-2 text-gray-500 hover:text-elite-gold transition-colors"
                    title="Edit signal"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(signal._id)}
                    className="p-2 text-gray-500 hover:text-elite-red transition-colors"
                    title="Delete signal"
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
