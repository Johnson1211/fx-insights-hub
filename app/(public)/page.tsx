"use client";

import { motion, AnimatePresence } from "framer-motion";
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
    a: "Members get full access to all daily trading daily signals, our complete video library, online/in-person training sessions, lifetime coaching, community chat, and support.",
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

function LiveTradingSimulator() {
  const [price, setPrice] = useState(1.08420);
  const [points, setPoints] = useState<number[]>([1.08350, 1.08380, 1.08360, 1.08400, 1.08390, 1.08420]);
  const [ticks, setTicks] = useState(0);
  const [profit, setProfit] = useState(482.50);
  const [activeSignal, setActiveSignal] = useState({ pair: "EURUSD", type: "BUY", entry: 1.08360, current: 1.08420, pips: 6 });
  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.45) * 0.00010;
      setPrice(prev => {
        const nextPrice = Number((prev + delta).toFixed(5));
        setPoints(p => {
          const nextPoints = [...p.slice(1), nextPrice];
          return nextPoints;
        });
        
        setActiveSignal(sig => {
          const newPips = Math.round((nextPrice - sig.entry) * 10000);
          return {
            ...sig,
            current: nextPrice,
            pips: newPips
          };
        });

        setProfit(prof => Number((prof + (delta > 0 ? 1.50 : -1.00)).toFixed(2)));

        return nextPrice;
      });

      setTicks(t => t + 1);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleMockTrade = (type: "BUY" | "SELL") => {
    setLastAction(type);
    setTimeout(() => {
      setLastAction(null);
    }, 2000);
  };

  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal || 0.001;
  const svgCoords = points.map((val, index) => {
    const x = (index / (points.length - 1)) * 280 + 10;
    const y = 110 - ((val - minVal) / range) * 90;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="w-full max-w-sm glass-card border border-elite-border/60 rounded-2xl p-5 shadow-2xl relative overflow-hidden bg-elite-card/30">
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-elite-gold/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-elite-border/30 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-elite-green animate-pulse" />
          <span className="text-[10px] font-bold text-gray-400 tracking-wider">LIVE FEED: EURUSD</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Bid Price</span>
          <div className="font-display text-2xl text-white font-semibold flex items-baseline gap-1 mt-0.5">
            <span>{price.toFixed(5).slice(0, 5)}</span>
            <span className="text-elite-gold font-bold">{price.toFixed(5).slice(5, 7)}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Simulated P/L</span>
          <div className={`font-display text-2xl font-bold mt-0.5 ${profit >= 0 ? "text-elite-green" : "text-elite-red"}`}>
            {profit >= 0 ? "+" : ""}${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="h-32 bg-black/40 rounded-xl border border-elite-border/30 p-2 relative overflow-hidden flex items-end">
        <div className="absolute inset-0 grid grid-rows-4 grid-cols-6 pointer-events-none opacity-[0.03]">
          {[...Array(24)].map((_, i) => <div key={i} className="border-t border-l border-white" />)}
        </div>

        <AnimatePresence>
          {lastAction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 ${lastAction === "BUY" ? "bg-elite-green" : "bg-elite-red"} pointer-events-none z-10`}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {lastAction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: -20 }}
              exit={{ opacity: 0 }}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-xs font-bold z-20 px-3 py-1.5 rounded-md border shadow-lg ${
                lastAction === "BUY" ? "bg-elite-green/20 border-elite-green text-elite-green" : "bg-elite-red/20 border-elite-red text-elite-red"
              }`}
            >
              {lastAction} ORDER SENT
            </motion.div>
          )}
        </AnimatePresence>

        <svg className="w-full h-full" viewBox="0 0 300 120">
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c5a880" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#c5a880" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d={`M 10,110 L ${svgCoords} L ${280 + 10},110 Z`}
            fill="url(#chartGlow)"
            className="transition-all duration-700 ease-in-out"
          />
          <polyline
            fill="none"
            stroke="#c5a880"
            strokeWidth="2"
            points={svgCoords}
            className="transition-all duration-700 ease-in-out"
          />
          <circle
            cx={290}
            cy={110 - ((points[points.length - 1] - minVal) / range) * 90}
            r="4"
            fill="#c5a880"
            className="animate-pulse"
          />
        </svg>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-elite-border/20 flex justify-between items-center text-xs">
        <div className="flex gap-2 items-center">
          <span className="font-semibold text-white">Signal Alert:</span>
          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
            activeSignal.type === "BUY" ? "bg-elite-green/10 text-elite-green border border-elite-green/25" : "bg-elite-red/10 text-elite-red border border-elite-red/25"
          }`}>
            {activeSignal.type}
          </span>
          <span className="text-gray-400 font-mono">{activeSignal.pair}</span>
        </div>
        <div className="text-right">
          <span className={`font-semibold ${activeSignal.pips >= 0 ? "text-elite-green" : "text-elite-red"}`}>
            {activeSignal.pips >= 0 ? "+" : ""}{activeSignal.pips} pips
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={() => handleMockTrade("BUY")}
          className="py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-elite-green hover:bg-emerald-500/15 font-semibold text-[11px] transition-all tracking-wider hover:scale-[1.02] active:scale-[0.98]"
        >
          EXECUTE BUY
        </button>
        <button
          onClick={() => handleMockTrade("SELL")}
          className="py-2 rounded-xl border border-red-500/20 bg-red-500/5 text-elite-red hover:bg-red-500/15 font-semibold text-[11px] transition-all tracking-wider hover:scale-[1.02] active:scale-[0.98]"
        >
          EXECUTE SELL
        </button>
      </div>
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-elite-bg">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-elite-gold/5 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />

          {/* Floating Candlesticks */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-elite-gold/30 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: `${Math.random() * 60}%`,
                  width: `${4 + Math.random() * 8}px`,
                  height: `${40 + Math.random() * 120}px`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 section-padding max-w-7xl mx-auto pt-28 lg:pt-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column (Hero Content) */}
            <div className="lg:col-span-7 space-y-6 text-left flex flex-col items-start">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elite-gold/10 border border-elite-gold/20">
                  <span className="w-2 h-2 rounded-full bg-elite-green animate-pulse" />
                  <span className="text-sm text-elite-gold font-medium">Live Signals Active Now</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-none tracking-wider uppercase"
              >
                MASTER <span className="gold-gradient-text">FOREX</span>
                <br />
                <span className="text-gray-400">TRADING WITH</span>{" "}
                <span className="gold-gradient-text">PRECISION</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed"
              >
                Join the elite community of profitable forex traders at Fx Insights Hub. Get professional signals, live coaching, and copy trading that actually works.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center"
              >
                <Link href="/register" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto text-center flex items-center justify-center">
                  Start Trading Now
                  <ArrowRight size={18} className="inline ml-2" />
                </Link>
                <Link href="/services" className="btn-outline text-base px-8 py-3.5 w-full sm:w-auto text-center">
                  View Services
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="mt-8 flex flex-wrap gap-6 text-gray-500 text-xs"
              >
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-elite-green" />
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-elite-green" />
                  <span>{statsData.totalLessons} Lessons Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-elite-gold" />
                  <span>{statsData.winRate}% Verified Win Rate</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column (Live Simulator) — Dark animated trading backdrop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-5 w-full flex justify-center lg:justify-end relative"
            >
              {/* Dark animated background panel behind the card */}
              <div className="absolute inset-0 -mx-6 -my-8 lg:-mx-12 lg:-my-16 rounded-3xl overflow-hidden pointer-events-none">
                {/* Deep dark base */}
                <div className="absolute inset-0 bg-[#050b14]" />

                {/* Radial gold glow top-right */}
                <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-elite-gold/10 blur-3xl" />
                {/* Radial blue glow bottom-left */}
                <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-blue-700/15 blur-3xl" />
                {/* Centre pulse */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-80 h-80 rounded-full bg-elite-gold/10 blur-3xl" />
                </motion.div>

                {/* SVG grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c5a880" strokeWidth="0.6" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Floating animated candlestick bars */}
                {[...Array(14)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute bottom-0 rounded-t-sm ${i % 3 === 0 ? "bg-emerald-500/30" : "bg-elite-gold/20"}`}
                    style={{
                      left: `${4 + i * 7}%`,
                      width: `${5 + (i % 3) * 3}px`,
                      height: `${20 + Math.sin(i) * 40 + 15}px`,
                    }}
                    animate={{
                      height: [
                        `${20 + Math.sin(i) * 40 + 15}px`,
                        `${30 + Math.sin(i + 1) * 50 + 20}px`,
                        `${20 + Math.sin(i) * 40 + 15}px`,
                      ],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3 + (i % 4),
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {/* Moving horizontal scan line */}
                <motion.div
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-elite-gold/20 to-transparent"
                  animate={{ y: ["0%", "100%", "0%"] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* The actual simulator card, positioned above the background */}
              <div className="relative z-10 py-8 w-full flex justify-center lg:justify-end">
                <LiveTradingSimulator />
              </div>
            </motion.div>
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
            className="text-gray-500"
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
                  <div className="font-display text-3xl md:text-4xl text-white mb-2">
                    <AnimatedCounter
                      end={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 relative">
        <div className="section-padding">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">What We Offer</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mt-3 tracking-wider">
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
                <div className="glass-card-hover p-8 h-full group">
                  <div className="w-14 h-14 rounded-xl bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center mb-6 group-hover:bg-elite-gold/20 transition-colors">
                    <service.icon className="w-7 h-7 text-elite-gold" />
                  </div>
                  <h3 className="font-display text-xl text-white tracking-wider mb-3">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Proof & Media Showcase Section */}
      <section className="py-24 bg-elite-card/30 relative">
        <div className="section-padding">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Verified Proof</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mt-3 tracking-wider">
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
                className={`flex flex-col items-center justify-center p-6 rounded-xl border text-center transition-all ${social.color} hover:scale-105`}
              >
                <social.icon className="w-8 h-8 mb-2" />
                <span className="font-semibold text-sm text-white">{social.name}</span>
                <span className="text-gray-500 text-xs mt-1">{social.desc}</span>
              </a>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Left side: Video presentation and video testimonies */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-display text-xl text-white tracking-wider mb-4 flex items-center gap-2">
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
                    <div className="w-16 h-16 rounded-full bg-elite-gold/90 flex items-center justify-center shadow-lg shadow-elite-gold/20 animate-pulse-glow">
                      <Play className="text-elite-bg fill-elite-bg w-6 h-6 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-elite-surface/40">
                  <h4 className="font-semibold text-white">Fx Insights Hub Video Presentation</h4>
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
                      <h4 className="font-semibold text-white text-sm">{vid.title}</h4>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{vid.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Image screenshot proof list */}
            <div className="space-y-6">
              <h3 className="font-display text-xl text-white tracking-wider mb-4 flex items-center gap-2">
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
                    className="glass-card overflow-hidden group cursor-pointer border border-elite-border/40 hover:border-elite-gold/50 transition-colors"
                  >
                    <div className="aspect-square relative bg-elite-surface overflow-hidden">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-semibold px-2 py-1 bg-elite-bg/85 border border-elite-gold/30 rounded-md">View Fullscreen</span>
                      </div>
                    </div>
                    <div className="p-2 text-center bg-elite-surface/30">
                      <span className="text-white text-xs font-medium block truncate">{img.title}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact box */}
              <div className="glass-card p-6 bg-gradient-to-br from-elite-gold/5 to-transparent border border-elite-gold/10">
                <h4 className="font-semibold text-elite-gold text-sm mb-2">Want to submit your results?</h4>
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
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
            onClick={() => setActiveMedia(null)}
          >
            <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setActiveMedia(null)}
                className="absolute -top-12 right-0 text-white hover:text-elite-gold transition-colors flex items-center gap-1 bg-elite-surface px-3 py-1 rounded-md border border-elite-border text-sm"
              >
                Close
              </button>
              {activeMedia.type === "image" && (
                <img
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg border border-elite-border"
                />
              )}
            </div>
            <p className="text-white font-medium text-lg mt-4">{activeMedia.title}</p>
          </div>
        )}
      </section>

      {/* Mentor Section */}
      <section className="py-24 bg-elite-card/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-elite-gold/5 via-transparent to-transparent" />
        <div className="section-padding relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-elite-surface to-elite-card border border-elite-border/50">
                  <img
                    src={`${SUPABASE_MEDIA}/Founder.jpeg`}
                    alt="Peleboss — Founder"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 glass-card p-4 animate-pulse-glow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-elite-green/20 flex items-center justify-center">
                      <TrendingUp size={20} className="text-elite-green" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{statsData.yearsExperience}+ Years</p>
                      <p className="text-gray-500 text-xs">Trading Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
 
            <ScrollReveal direction="right">
              <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Meet The Founder</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mt-3 tracking-wider mb-6">
                PELE<span className="gold-gradient-text">BOSS</span>
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
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
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="glass-card px-5 py-3">
                  <p className="font-display text-2xl text-white">
                    {statsData.profitsGenerated > 0 ? `$${(statsData.profitsGenerated / 1000).toFixed(0)}k+` : "$0"}
                  </p>
                  <p className="text-gray-500 text-xs">Verified Profits</p>
                </div>
                <div className="glass-card px-5 py-3">
                  <p className="font-display text-2xl text-white">{statsData.winRate}%</p>
                  <p className="text-gray-500 text-xs">Signal Accuracy</p>
                </div>
                <div className="glass-card px-5 py-3">
                  <p className="font-display text-2xl text-white">{statsData.totalLessons}+</p>
                  <p className="text-gray-500 text-xs">Course Lessons</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-elite-card/50">
        <div className="section-padding max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">FAQ</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mt-3 tracking-wider">
                COMMON <span className="gold-gradient-text">QUESTIONS</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="glass-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-medium text-white pr-4">{faq.q}</span>
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
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-elite-bg via-elite-card to-elite-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-elite-gold/10 via-transparent to-transparent" />
        <div className="section-padding relative z-10 text-center max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-4xl md:text-6xl text-white tracking-wider mb-6">
              READY TO <span className="gold-gradient-text">LEVEL UP?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Join thousands of traders who have transformed their trading with Fx Insights Hub. Your journey to consistent profitability starts today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary text-lg px-10 py-4">
                Join The Community
                <ArrowRight size={18} className="inline ml-2" />
              </Link>
              <Link href="/services" className="btn-outline text-lg px-10 py-4">
                View Services
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
