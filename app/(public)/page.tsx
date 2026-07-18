"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ForexTicker } from "@/components/animations/ForexTicker";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import {
  TrendingUp,
  Users,
  Target,
  Award,
  Play,
  ArrowRight,
  Shield,
  Zap,
  BookOpen,
  MessageCircle,
  Star,
  ChevronDown,
  Send,
  Youtube,
  Facebook,
  Copy,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";

const services = [
  {
    icon: BookOpen,
    title: "Online Training Session",
    description: "Comprehensive live interactive webinars covering forex basics, technical analysis, and advanced strategies.",
  },
  {
    icon: Users,
    title: "In-Person Training Session",
    description: "Hands-on, face-to-face mentorship and workshops in a professional setting for direct practical learning.",
  },
  {
    icon: Zap,
    title: "Signal Services",
    description: "Daily high-probability buy/sell alerts with precise entry, take profit, and stop loss parameters.",
  },
  {
    icon: Target,
    title: "Lifetime Coaching & Guidance",
    description: "Continuous professional mentorship, psychology coaching, and custom capital risk models directly with Peleboss.",
  },
];

const faqs = [
  {
    q: "What is included in the platform access?",
    a: "Members get full access to all daily trading signals, our complete video library, online/in-person training sessions, lifetime coaching, community chat, and support.",
  },
  {
    q: "How accurate are the trading signals?",
    a: "Our signals maintain an average win rate of 87% based on rigorous technical and fundamental analysis. Each signal includes detailed rationale and risk parameters.",
  },
  {
    q: "Are there any hidden subscription costs?",
    a: "No, all of our services—including signals, webinars, in-person workshops, and lifetime coaching—are currently 100% free of charge.",
  },
  {
    q: "What platforms are supported for copy trading?",
    a: "We support MetaTrader 4 (MT4) and MetaTrader 5 (MT5) for copy trading. Setup takes less than 5 minutes with our step-by-step guide.",
  },
  {
    q: "How do I get started?",
    a: "Simply create a free account to gain instant access to our trading dashboard, video tutorials, and daily signals, or contact us to schedule training sessions.",
  },
];

const SUPABASE_MEDIA = "https://jvxmtsmslyokplooyfwz.supabase.co/storage/v1/object/public/media";

// Live Candle Chart and Trading Simulator for the Hero Section
function TradingConsoleSimulator() {
  const [candles, setCandles] = useState<{ o: number; h: number; l: number; c: number }[]>([]);
  const [currentPrice, setCurrentPrice] = useState(1.0845);
  const [pipProfit, setPipProfit] = useState(0);
  const [status, setStatus] = useState("RUNNING");
  const entryPrice = 1.0820;
  const takeProfit = 1.0870;
  const stopLoss = 1.0795;

  useEffect(() => {
    const initial = [];
    let price = 1.0805;
    for (let i = 0; i < 15; i++) {
      const change = (Math.random() - 0.35) * 0.0006;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * 0.0003;
      const low = Math.min(open, close) - Math.random() * 0.0003;
      initial.push({ o: open, h: high, l: low, c: close });
      price = close;
    }
    setCandles(initial);
    setCurrentPrice(price);
  }, []);

  useEffect(() => {
    if (candles.length === 0) return;

    let timer: NodeJS.Timeout;
    let tickTimer: NodeJS.Timeout;

    const runSimulation = () => {
      tickTimer = setInterval(() => {
        setCurrentPrice((prev) => {
          const drift = 0.00008;
          const noise = (Math.random() - 0.42) * 0.00012;
          const next = prev + drift + noise;
          
          const pips = Math.round((next - entryPrice) * 10000);
          setPipProfit(pips);

          if (next >= takeProfit) {
            setStatus("TP HIT! (+50 PIPS)");
            clearInterval(tickTimer);
            clearInterval(timer);
            setTimeout(() => {
              setStatus("ANALYZING NEXT SETUP");
              setTimeout(() => {
                setStatus("RUNNING");
                let price = 1.0805;
                const newInit = [];
                for (let i = 0; i < 15; i++) {
                  const change = (Math.random() - 0.35) * 0.0006;
                  const open = price;
                  const close = price + change;
                  const high = Math.max(open, close) + Math.random() * 0.0003;
                  const low = Math.min(open, close) - Math.random() * 0.0003;
                  newInit.push({ o: open, h: high, l: low, c: close });
                  price = close;
                }
                setCandles(newInit);
                setCurrentPrice(price);
                runSimulation();
              }, 2000);
            }, 3000);
            return takeProfit;
          }
          if (next <= stopLoss) {
            setStatus("SL HIT (-25 PIPS)");
            clearInterval(tickTimer);
            clearInterval(timer);
            setTimeout(() => {
              setStatus("ANALYZING NEXT SETUP");
              setTimeout(() => {
                setStatus("RUNNING");
                let price = 1.0805;
                const newInit = [];
                for (let i = 0; i < 15; i++) {
                  const change = (Math.random() - 0.35) * 0.0006;
                  const open = price;
                  const close = price + change;
                  const high = Math.max(open, close) + Math.random() * 0.0003;
                  const low = Math.min(open, close) - Math.random() * 0.0003;
                  newInit.push({ o: open, h: high, l: low, c: close });
                  price = close;
                }
                setCandles(newInit);
                setCurrentPrice(price);
                runSimulation();
              }, 2000);
            }, 3000);
            return stopLoss;
          }
          return next;
        });
      }, 150);

      timer = setInterval(() => {
        setCandles((prev) => {
          const lastCandle = prev[prev.length - 1];
          const open = lastCandle.c;
          const close = currentPrice;
          const high = Math.max(open, close) + Math.random() * 0.0002;
          const low = Math.min(open, close) - Math.random() * 0.0002;
          return [...prev.slice(1), { o: open, h: high, l: low, c: close }];
        });
      }, 3500);
    };

    runSimulation();

    return () => {
      clearInterval(timer);
      clearInterval(tickTimer);
    };
  }, [candles.length]);

  const minVal = 1.0775;
  const maxVal = 1.0895;
  const scaleY = (val: number) => {
    const pct = (val - minVal) / (maxVal - minVal);
    return 180 - pct * 140 - 20; 
  };

  return (
    <div className="bg-[#050c18]/90 border border-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] w-full max-w-sm sm:max-w-md mx-auto flex flex-col space-y-4">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-elite-green animate-pulse" />
          <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#94A3B8] uppercase">EUR/USD LIVE TERMINAL</span>
        </div>
        <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
          <span className="text-[9px] sm:text-[10px] font-bold text-amber-400">
            {status}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 text-center bg-black/40 p-2 sm:p-3 rounded-lg border border-white/5">
        <div>
          <span className="text-[9px] text-[#64748B] block uppercase tracking-wider">Entry</span>
          <span className="text-xs sm:text-sm font-mono font-bold text-gray-300">{entryPrice.toFixed(4)}</span>
        </div>
        <div>
          <span className="text-[9px] text-[#64748B] block uppercase tracking-wider">Market</span>
          <span className="text-xs sm:text-sm font-mono font-bold text-amber-300">{currentPrice.toFixed(4)}</span>
        </div>
        <div>
          <span className="text-[9px] text-[#64748B] block uppercase tracking-wider">Gain</span>
          <span className={`text-xs sm:text-sm font-mono font-bold ${pipProfit >= 0 ? "text-elite-green" : "text-elite-red"}`}>
            {pipProfit >= 0 ? `+${pipProfit}` : pipProfit} Pips
          </span>
        </div>
      </div>

      {/* SVG Candlestick Chart */}
      <div className="h-44 w-full bg-black/50 rounded-lg relative overflow-hidden border border-white/10">
        {/* Horizontal Lines for entry, target, stop loss */}
        <div className="absolute left-0 right-0 border-t border-dashed border-elite-green/40 z-0" style={{ top: `${(scaleY(takeProfit) / 180) * 100}%` }}>
          <span className="absolute right-1 -top-2.5 text-[8px] font-bold text-elite-green/80 bg-[#050c18] px-1 rounded">TP: {takeProfit.toFixed(4)}</span>
        </div>
        <div className="absolute left-0 right-0 border-t border-solid border-blue-500/40 z-0" style={{ top: `${(scaleY(entryPrice) / 180) * 100}%` }}>
          <span className="absolute right-1 -top-2.5 text-[8px] font-bold text-blue-400 bg-[#050c18] px-1 rounded">ENTRY: {entryPrice.toFixed(4)}</span>
        </div>
        <div className="absolute left-0 right-0 border-t border-dashed border-elite-red/40 z-0" style={{ top: `${(scaleY(stopLoss) / 180) * 100}%` }}>
          <span className="absolute right-1 -top-2.5 text-[8px] font-bold text-elite-red/80 bg-[#050c18] px-1 rounded">SL: {stopLoss.toFixed(4)}</span>
        </div>

        {/* Current price marker line */}
        <div className="absolute left-0 right-0 border-t border-amber-500/60 z-10" style={{ top: `${(scaleY(currentPrice) / 180) * 100}%` }}>
          <span className="absolute left-1 -top-2.5 text-[8px] font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/20">
            {currentPrice.toFixed(4)}
          </span>
        </div>

        {/* SVG Drawing candles */}
        <svg className="w-full h-full p-2" viewBox="0 0 240 180" preserveAspectRatio="none">
          {candles.map((candle, idx) => {
            const x = idx * 15 + 10;
            const w = 8;
            const yOpen = scaleY(candle.o);
            const yClose = scaleY(candle.c);
            const yHigh = scaleY(candle.h);
            const yLow = scaleY(candle.l);

            const isGreen = candle.c >= candle.o;
            const color = isGreen ? "#10B981" : "#EF4444";

            return (
              <g key={idx}>
                <line x1={x + w / 2} y1={yHigh} x2={x + w / 2} y2={yLow} stroke={color} strokeWidth="1.5" />
                <rect
                  x={x}
                  y={Math.min(yOpen, yClose)}
                  width={w}
                  height={Math.max(2, Math.abs(yOpen - yClose))}
                  fill={color}
                  rx="1.5"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Console Footer */}
      <div className="flex items-center justify-between text-[9px] text-[#64748B] font-mono tracking-wider">
        <span>STRATEGY: ORDER FLOW BREAKOUT</span>
        <span>VERIFIED RESULTS</span>
      </div>
    </div>
  );
}

// Compounding Growth Calculator for the landing page
function PotentialEarningsCalculator() {
  const [capital, setCapital] = useState(1000);
  const [pips, setPips] = useState(600);
  const [risk, setRisk] = useState("medium");

  const riskMultiplier = risk === "low" ? 0.5 : risk === "medium" ? 1.0 : 2.5;
  const estimatedMonthlyProfit = Math.round(capital * (pips * 0.0002) * riskMultiplier);
  const roi = ((estimatedMonthlyProfit / capital) * 100).toFixed(0);

  const projection3M = Math.round(capital * Math.pow(1 + estimatedMonthlyProfit / capital, 3));
  const projection6M = Math.round(capital * Math.pow(1 + estimatedMonthlyProfit / capital, 6));
  const projection12M = Math.round(capital * Math.pow(1 + estimatedMonthlyProfit / capital, 12));

  return (
    <div className="glass-card p-6 sm:p-10 max-w-4xl mx-auto border border-elite-border/50 shadow-xl bg-elite-card">
      <div className="grid md:grid-cols-2 gap-10 sm:gap-12 items-center">
        {/* Sliders Area */}
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-body">
              <span className="font-semibold text-gray-200">Starting Account Balance</span>
              <span className="font-mono font-bold text-elite-gold text-lg sm:text-xl">${capital.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="100"
              max="25000"
              step="100"
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="w-full h-1.5 bg-elite-surface rounded-lg appearance-none cursor-pointer accent-elite-gold"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>$100</span>
              <span>$10,000</span>
              <span>$25,000</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-body">
              <span className="font-semibold text-gray-200">Target Monthly Pips</span>
              <span className="font-mono font-bold text-elite-gold text-lg sm:text-xl">{pips} Pips</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={pips}
              onChange={(e) => setPips(Number(e.target.value))}
              className="w-full h-1.5 bg-elite-surface rounded-lg appearance-none cursor-pointer accent-elite-gold"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>100 pips</span>
              <span>1,000 pips</span>
              <span>2,000 pips</span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-sm font-semibold text-gray-200 block">Risk Management Level</span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Conservative", value: "low", desc: "1% risk/trade" },
                { name: "Balanced", value: "medium", desc: "2% risk/trade" },
                { name: "Aggressive", value: "high", desc: "5% risk/trade" },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRisk(r.value)}
                  className={`p-3 rounded-xl border text-center transition-all duration-300 flex flex-col items-center justify-center ${
                    risk === r.value
                      ? "border-elite-gold bg-elite-gold/5 text-elite-gold font-bold shadow-sm"
                      : "border-elite-border bg-elite-surface text-gray-400 hover:bg-elite-border/30"
                  }`}
                >
                  <span className="text-[11px] sm:text-xs block tracking-wide">{r.name}</span>
                  <span className="text-[8px] sm:text-[9px] text-gray-400 font-normal mt-0.5">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Display Projections */}
        <div className="bg-elite-surface border border-elite-border rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center pb-6 border-b border-elite-border/50">
            <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Projected Monthly Profits</span>
            <div className="font-display text-4xl sm:text-5xl text-elite-gold mt-2 font-bold tracking-wide">${estimatedMonthlyProfit.toLocaleString()}</div>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-elite-green/10 text-elite-green text-xs font-bold font-mono">
              +{roi}% Est. Monthly ROI
            </span>
          </div>

          <div className="space-y-4">
            <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase block">Compounding Growth Projection</span>
            
            <div className="space-y-3 font-body">
              <div>
                <div className="flex justify-between items-center text-xs sm:text-sm mb-1">
                  <span className="text-gray-300 font-medium">3 Months Compounded</span>
                  <span className="font-mono font-bold text-gray-100">${projection3M.toLocaleString()}</span>
                </div>
                <div className="w-full bg-elite-border rounded-full h-1.5 overflow-hidden">
                  <div className="bg-elite-blue h-1.5 rounded-full" style={{ width: `${Math.min(100, (projection3M / projection12M) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs sm:text-sm mb-1">
                  <span className="text-gray-300 font-medium">6 Months Compounded</span>
                  <span className="font-mono font-bold text-gray-100">${projection6M.toLocaleString()}</span>
                </div>
                <div className="w-full bg-elite-border rounded-full h-1.5 overflow-hidden">
                  <div className="bg-elite-blue h-1.5 rounded-full" style={{ width: `${Math.min(100, (projection6M / projection12M) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs sm:text-sm mb-1">
                  <span className="text-gray-300 font-medium">12 Months Compounded</span>
                  <span className="font-mono font-bold text-elite-gold text-sm sm:text-base">${projection12M.toLocaleString()}</span>
                </div>
                <div className="w-full bg-elite-border rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-elite-blue to-elite-gold h-1.5 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-gray-400 text-center leading-relaxed italic mt-4 border-t border-elite-border/40 pt-4">
            *Compounding is calculated assuming all profits remain inside the account. Trading involves significant risk.
          </div>
        </div>
      </div>
    </div>
  );
}

// Dynamic Active Signals feed pulling from database
function SignalTerminalPreview() {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSignals() {
      try {
        const res = await fetch("/api/signals?limit=4");
        if (res.ok) {
          const data = await res.json();
          if (data.signals) {
            setSignals(data.signals);
          }
        }
      } catch (err) {
        console.error("Failed to fetch signals:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSignals();
  }, []);

  const handleCopy = (sig: any) => {
    const tp2Text = sig.takeProfit2 ? ` | TP2: ${sig.takeProfit2}` : "";
    const text = `${sig.pair} ${sig.type} | Entry: ${sig.entryPrice} | TP1: ${sig.takeProfit1}${tp2Text} | SL: ${sig.stopLoss} (Shared by Fx Insights Hub)`;
    navigator.clipboard.writeText(text);
    setCopiedId(sig.id || sig._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-2 border-elite-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (signals.length === 0) {
    return (
      <div className="text-center py-12 bg-elite-card rounded-2xl border border-elite-border/50 max-w-lg mx-auto shadow-sm">
        <p className="text-white font-semibold text-sm">No signals available in the database.</p>
        <p className="text-gray-400 text-xs mt-1">Check back later or register to view full live console updates.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {signals.map((sig) => {
        const isActive = sig.status === "Active";
        const isBuy = sig.type === "BUY";
        const formattedDate = new Date(sig.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
        
        return (
          <div key={sig.id || sig._id} className="glass-card p-6 border border-elite-border/50 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex flex-col justify-between bg-elite-card">
            {/* Pair & Buy/Sell Tag */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-mono font-bold text-lg text-gray-100">{sig.pair}</h4>
                <span className="text-[10px] text-gray-400">{formattedDate}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                isBuy ? "bg-elite-green/10 text-elite-green border border-elite-green/20" : "bg-elite-red/10 text-elite-red border border-elite-red/20"
              }`}>
                {sig.type}
              </span>
            </div>

            {/* Target Fields */}
            <div className="space-y-2 font-mono text-xs text-gray-300 mb-6 bg-elite-surface p-4 rounded-xl border border-elite-border/30">
              <div className="flex justify-between">
                <span className="text-gray-400">Entry Zone:</span>
                <span className="font-bold text-gray-100">{sig.entryPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">TP1 Target:</span>
                <span className="font-bold text-elite-blue">{sig.takeProfit1}</span>
              </div>
              {sig.takeProfit2 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">TP2 Target:</span>
                  <span className="font-bold text-amber-500">{sig.takeProfit2}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-elite-border/30 pt-2 mt-2">
                <span className="text-gray-400">Stop Loss:</span>
                <span className="font-bold text-elite-red">{sig.stopLoss}</span>
              </div>
            </div>

            {/* Status & Trigger Action */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Status:</span>
                <span className={`font-bold ${isActive ? "text-amber-500 animate-pulse font-bold" : "text-elite-green font-bold"}`}>
                  {isActive ? "ACTIVE & LIVE" : sig.pips ? `+${sig.pips} PIP TARGET HIT` : "CLOSED"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(sig)}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs border transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  copiedId === (sig.id || sig._id)
                    ? "bg-elite-green/15 border-elite-green text-elite-green"
                    : "border-elite-border bg-elite-surface text-gray-200 hover:bg-elite-border/50"
                }`}
              >
                {copiedId === (sig.id || sig._id) ? (
                  <>
                    <Check size={14} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} className="opacity-75" />
                    Copy Trading Signal
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeMedia, setActiveMedia] = useState<{ type: "video" | "image"; url: string; title: string } | null>(null);
  const [statsData, setStatsData] = useState({
    totalLessons: 10,
    totalSignals: 100,
    winRate: 87,
    yearsExperience: 8,
    profitsGenerated: 1200000,
  });

  useEffect(() => {
    async function fetchPublicStats() {
      try {
        const res = await fetch("/api/public/stats");
        if (res.ok) {
          const data = await res.json();
          setStatsData({
            totalLessons: data.totalLessons ?? 10,
            totalSignals: data.totalSignals ?? 100,
            winRate: data.winRate ?? 87,
            yearsExperience: data.yearsExperience ?? 8,
            profitsGenerated: data.profitsGenerated ?? 1200000,
          });
        }
      } catch (err) {
        console.error("Failed to fetch public stats:", err);
      }
    }
    fetchPublicStats();
  }, []);

  const stats = [
    { value: statsData.totalLessons, suffix: "+", label: "Course Lessons", icon: BookOpen },
    { value: statsData.winRate, suffix: "%", label: "Win Rate", icon: Target },
    { value: statsData.yearsExperience, suffix: "+", label: "Years Experience", icon: Award },
    { value: statsData.profitsGenerated, suffix: "", prefix: "$", label: "Profits Generated", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-elite-bg">
      {/* Dynamic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050c18]">
        {/* Looping Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-80"
            src="/Videos_images/hero-bg.mp4"
          />
          {/* Dark overlay with fade-out at bottom to blend with next section */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050c18]/85 via-[#050c18]/60 to-[#F8FAFC]/50 z-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050c18]/95 via-[#050c18]/70 to-transparent hidden lg:block z-0" />
        </div>

        <div className="relative z-10 section-padding max-w-7xl mx-auto pt-28 lg:pt-32 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center w-full">
            {/* Left side: Heading, subheadings, buttons, badges */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 max-w-3xl mx-auto lg:mx-0">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-elite-green animate-pulse" />
                  <span className="text-sm text-amber-300 font-semibold">Live Signals Active Now</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#F8FAFC] leading-none tracking-wide uppercase"
                style={{ textShadow: "0 4px 24px rgba(0, 0, 0, 0.8), 0 2px 6px rgba(0, 0, 0, 0.9)" }}
              >
                MASTER <span className="text-amber-400">FOREX</span>
                <br />
                <span className="text-[#F8FAFC]">TRADING WITH</span>{" "}
                <span className="text-amber-400">PRECISION</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed"
              >
                Join the elite community of profitable forex traders at Fx Insights Hub. Get professional signals, live coaching, and copy trading that actually works.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center lg:justify-start"
              >
                <Link href="/register" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto text-center flex items-center justify-center">
                  Start Trading Now
                  <ArrowRight size={18} className="inline ml-2" />
                </Link>
                <Link
                  href="/services"
                  className="border border-[#94A3B8]/40 text-[#F8FAFC] hover:bg-white/5 hover:border-[#F8FAFC] transition-all duration-300 rounded-lg text-base px-8 py-3.5 w-full sm:w-auto text-center font-medium"
                >
                  View Services
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start text-[#F8FAFC] text-xs font-semibold"
              >
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/45 border border-white/10 shadow-md backdrop-blur-sm hover:border-white/20 transition-colors duration-300">
                  <Shield size={14} className="text-elite-green" />
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/45 border border-white/10 shadow-md backdrop-blur-sm hover:border-white/20 transition-colors duration-300">
                  <BookOpen size={14} className="text-elite-green" />
                  <span>{statsData.totalLessons} Lessons Available</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/45 border border-white/10 shadow-md backdrop-blur-sm hover:border-white/20 transition-colors duration-300">
                  <TrendingUp size={14} className="text-amber-400" />
                  <span>{statsData.winRate}% Verified Win Rate</span>
                </div>
              </motion.div>
            </div>

            {/* Right side: Live Simulator */}
            <div className="lg:col-span-5 w-full flex justify-center z-10">
              <TradingConsoleSimulator />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[#E2E8F0]"
          >
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </section>

      {/* Forex Ticker */}
      <ForexTicker />

      {/* Stats Section */}
      <section className="py-20 bg-elite-bg relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-elite-gold/5 via-transparent to-transparent" />
        <div className="section-padding relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="text-center p-6 glass-card-hover">
                  <stat.icon className="w-8 h-8 text-elite-gold mx-auto mb-4" />
                  <div className="font-display text-3xl md:text-4xl text-white mb-2 font-bold">
                    <AnimatedCounter
                      end={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="text-gray-400 text-sm font-semibold">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Compounding Growth Calculator Section (NEW) */}
      <section className="py-24 relative bg-elite-surface/30 border-y border-elite-border/30">
        <div className="section-padding">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Compound Calculator</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mt-3 tracking-wider font-bold">
                FOREX <span className="gold-gradient-text">EARNINGS CALCULATOR</span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Estimate how compound interest builds wealth. Toggle starting capital and target pips with balanced risk.
              </p>
            </div>
          </ScrollReveal>

          <PotentialEarningsCalculator />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 relative bg-elite-bg">
        <div className="section-padding">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">What We Offer</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mt-3 tracking-wider font-bold">
                ELITE <span className="gold-gradient-text">SERVICES</span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Everything you need to become a consistently profitable forex trader, all in one platform.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 0.1}>
                <div className="glass-card-hover p-8 h-full group border border-elite-border/40 hover:border-elite-gold/30 hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center mb-6 group-hover:bg-elite-gold/20 transition-colors">
                    <service.icon className="w-7 h-7 text-elite-gold" />
                  </div>
                  <h3 className="font-display text-xl text-white tracking-wider mb-3 font-bold">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Active Signals Feed Preview (NEW) */}
      <section className="py-24 relative bg-elite-surface/40 border-t border-elite-border/30">
        <div className="section-padding">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Live Signal Preview</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mt-3 tracking-wider font-bold">
                ACTIVE <span className="gold-gradient-text">TRADING SIGNALS</span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Real-time preview of recent and active signals shared directly from our member console dashboard.
              </p>
            </div>
          </ScrollReveal>

          <SignalTerminalPreview />
        </div>
      </section>

      {/* Proof & Media Showcase Section */}
      <section className="py-24 bg-elite-card/30 relative border-t border-elite-border/30">
        <div className="section-padding">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Verified Proof</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mt-3 tracking-wider font-bold">
                COMMUNITY <span className="gold-gradient-text">RESULTS & PROOF</span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Real videos, profit screenshots, and live testimonies from members of our trading community. No login required.
              </p>
            </div>
          </ScrollReveal>

          {/* Social Community Quick Access Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto mb-16">
            {[
              { name: "Telegram Group", desc: "Free Signals", href: "https://t.me/+eaNhaqhRdYc1ZWU0", icon: Send, color: "border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400" },
              { name: "WhatsApp Chat", desc: "Direct Support", href: "https://wa.link/cu9c9s", icon: MessageCircle, color: "border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-400" },
              { name: "YouTube Channel", desc: "Daily Analysis", href: "https://youtube.com/@fxinsightshub?si=DRHhDCOj3ZXiE7Qi", icon: Youtube, color: "border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400" },
              { name: "TikTok Account", desc: "Short Education", href: "https://www.tiktok.com/@fxinsighthub_peleboss?_r=1&_t=ZS-975CcYIO2Ue", icon: Play, color: "border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400" },
              { name: "Facebook Page", desc: "Community Updates", href: "https://www.facebook.com/share/18TRs2FDvx/?mibextid=wwXIfr", icon: Facebook, color: "border-blue-600/20 bg-blue-600/5 hover:bg-blue-600/10 text-blue-500" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center p-6 rounded-xl border text-center transition-all duration-300 ${social.color} hover:scale-105 hover:shadow-md`}
              >
                <social.icon className="w-8 h-8 mb-2" />
                <span className="font-semibold text-sm text-white font-bold">{social.name}</span>
                <span className="text-gray-500 text-xs mt-1">{social.desc}</span>
              </a>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Left side: Video presentation and video testimonies */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-display text-xl text-white tracking-wider mb-4 flex items-center gap-2 font-bold">
                <Play className="text-elite-gold w-5 h-5" /> Video Proof & Introductions
              </h3>

              {/* Main Presentation Video */}
              <div className="glass-card overflow-hidden group relative">
                <div className="aspect-video relative bg-black flex items-center justify-center">
                  <video
                    src={`${SUPABASE_MEDIA}/fxinsights.mp4`}
                    className="w-full h-full object-contain"
                    controls
                    poster={`${SUPABASE_MEDIA}/img1.jpeg`}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-elite-gold/90 flex items-center justify-center shadow-lg shadow-elite-gold/25 animate-pulse-glow">
                      <Play className="text-white fill-white w-6 h-6 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-elite-surface/40">
                  <h4 className="font-semibold text-white font-bold">Fx Insights Hub Video Presentation</h4>
                  <p className="text-gray-400 text-sm mt-1">Watch our live breakdown of trading signals, dashboard services, and educational resources.</p>
                </div>
              </div>

              {/* Grid of video testimonies */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Trading Preview", src: `${SUPABASE_MEDIA}/Trading%20preview.mp4`, desc: "Watch how a community member consistently hits profit targets using our professional signals." },
                  { title: "Live Group Review", src: `${SUPABASE_MEDIA}/Founder1.mp4`, desc: "A live video recording showing our WhatsApp community sharing daily profit screenshots." },
                ].map((vid) => (
                  <div key={vid.title} className="glass-card overflow-hidden flex flex-col h-full bg-elite-card/45">
                    <div className="aspect-video relative bg-black">
                      <video src={vid.src} className="w-full h-full object-contain" controls />
                    </div>
                    <div className="p-4 flex-1">
                      <h4 className="font-semibold text-white text-sm font-bold">{vid.title}</h4>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{vid.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Image screenshot proof list */}
            <div className="space-y-6">
              <h3 className="font-display text-xl text-white tracking-wider mb-4 flex items-center gap-2 font-bold">
                <Star className="text-elite-gold w-5 h-5" /> Student Profit Proofs
              </h3>
              
              <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {[
                  { title: "Trading Conference", url: `${SUPABASE_MEDIA}/Trading%20Conference.jpeg` },
                  { title: "Student Testimony", url: `${SUPABASE_MEDIA}/Student%20Testimony.jpeg` },
                  { title: "Student Performance", url: `${SUPABASE_MEDIA}/img1.jpeg` },
                  { title: "Trading Conference 1", url: `${SUPABASE_MEDIA}/Trading%20Conference_1.jpeg` },
                  { title: "Trading Conference 2", url: `${SUPABASE_MEDIA}/Trading%20Conference_2.jpeg` },
                  { title: "Founder Photo", url: `${SUPABASE_MEDIA}/Founder.jpeg` },
                ].map((img) => (
                  <div
                    key={img.url}
                    onClick={() => setActiveMedia({ type: "image", url: img.url, title: img.title })}
                    className="glass-card overflow-hidden group cursor-pointer border border-elite-border/40 hover:border-elite-gold/50 transition-colors duration-300"
                  >
                    <div className="aspect-square relative bg-elite-surface overflow-hidden">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[#F8FAFC] text-[10px] font-semibold px-2 py-1 bg-[#050c18]/85 border border-elite-gold/30 rounded-md">View Fullscreen</span>
                      </div>
                    </div>
                    <div className="p-2 text-center bg-elite-surface/30">
                      <span className="text-white text-xs font-semibold block truncate">{img.title}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact box */}
              <div className="glass-card p-6 bg-gradient-to-br from-elite-gold/5 to-transparent border border-elite-gold/10">
                <h4 className="font-semibold text-elite-gold text-sm mb-2 font-bold">Want to submit your results?</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Send your screenshot or video to us on WhatsApp or Telegram, and we will feature it in our verified community proof gallery!
                </p>
                <div className="flex gap-2 mt-4">
                  <a href="https://wa.link/cu9c9s" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 text-xs font-semibold transition-colors">WhatsApp Support</a>
                  <a href="https://t.me/+eaNhaqhRdYc1ZWU0" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold transition-colors">Join Telegram</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        {activeMedia && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
            onClick={() => setActiveMedia(null)}
          >
            <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setActiveMedia(null)}
                className="absolute -top-12 right-0 text-white hover:text-elite-gold transition-colors flex items-center gap-1 bg-[#050c18] px-3 py-1.5 rounded-md border border-white/10 text-xs font-bold"
              >
                Close Window
              </button>
              {activeMedia.type === "image" && (
                <img
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg border border-white/10"
                />
              )}
            </div>
            <p className="text-[#F8FAFC] font-semibold text-lg mt-4">{activeMedia.title}</p>
          </div>
        )}
      </section>

      {/* Mentor Section */}
      <section className="py-24 bg-elite-card/50 relative overflow-hidden border-t border-elite-border/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-elite-gold/5 via-transparent to-transparent" />
        <div className="section-padding relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="relative max-w-md mx-auto lg:mx-0">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-elite-surface to-elite-card border border-elite-border/50 shadow-md">
                  <img
                    src={`${SUPABASE_MEDIA}/Founder.jpeg`}
                    alt="Peleboss — Founder"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 glass-card p-4 shadow-lg border border-elite-border/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-elite-green/20 flex items-center justify-center">
                      <TrendingUp size={20} className="text-elite-green" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{statsData.yearsExperience}+ Years</p>
                      <p className="text-gray-500 text-xs">Trading Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
 
            <ScrollReveal direction="right">
              <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Meet The Founder</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mt-3 tracking-wider mb-6 font-bold">
                PELE<span className="gold-gradient-text">BOSS</span>
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed font-body">
                <p>
                  With over {statsData.yearsExperience} years of experience in the forex markets, Peleboss has developed a systematic approach to trading that emphasizes risk management, technical precision, and psychological discipline.
                </p>
                <p>
                  His journey evolved into a global community of profitable traders through Fx Insights Hub — a platform dedicated to empowering everyday people to achieve financial freedom through forex.
                </p>
                <p>
                  His philosophy is simple: "Protect your capital first, profits will follow." Every signal, every lesson, every live session is designed with this principle at its core.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 font-body">
                <div className="glass-card px-5 py-3 border border-elite-border/50 shadow-sm">
                  <p className="font-display text-2xl text-white font-bold">
                    {statsData.profitsGenerated > 0 ? `$${(statsData.profitsGenerated / 1000).toFixed(0)}k+` : "$0"}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">Verified Profits</p>
                </div>
                <div className="glass-card px-5 py-3 border border-elite-border/50 shadow-sm">
                  <p className="font-display text-2xl text-white font-bold">{statsData.winRate}%</p>
                  <p className="text-gray-500 text-xs mt-0.5">Signal Accuracy</p>
                </div>
                <div className="glass-card px-5 py-3 border border-elite-border/50 shadow-sm">
                  <p className="font-display text-2xl text-white font-bold">{statsData.totalLessons}+</p>
                  <p className="text-gray-500 text-xs mt-0.5">Course Lessons</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-elite-bg border-t border-elite-border/30">
        <div className="section-padding max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">FAQ</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mt-3 tracking-wider font-bold">
                COMMON <span className="gold-gradient-text">QUESTIONS</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-4 font-body">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="glass-card overflow-hidden border border-elite-border/50 shadow-sm">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-bold text-white pr-4 text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown
                      size={20}
                      className={`text-elite-gold shrink-0 transition-transform duration-300 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-elite-surface/20"
                  >
                    <p className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-elite-border/20 pt-4">{faq.a}</p>
                  </motion.div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden border-t border-elite-border/30 bg-[#050c18]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-elite-gold/10 via-transparent to-transparent" />
        <div className="section-padding relative z-10 text-center max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-4xl md:text-6xl text-[#F8FAFC] tracking-wider mb-6 font-bold" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
              READY TO <span className="text-amber-400">LEVEL UP?</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg mb-10 leading-relaxed font-body">
              Join thousands of traders who have transformed their trading with Fx Insights Hub. Your journey to consistent profitability starts today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center font-body">
              <Link href="/register" className="btn-primary text-lg px-10 py-4">
                Join The Community
                <ArrowRight size={18} className="inline ml-2" />
              </Link>
              <Link href="/services" className="border border-white/20 text-[#F8FAFC] hover:bg-white/5 hover:border-[#F8FAFC] transition-all duration-300 rounded-lg text-lg px-10 py-4 font-semibold">
                View Services
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
