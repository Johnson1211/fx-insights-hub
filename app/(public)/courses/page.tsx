"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { useAuth } from "@/hooks/useAuth";
import { 
  BookOpen, 
  Shield, 
  Zap, 
  Users, 
  Check, 
  Wallet, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lock,
  Computer,
  Award
} from "lucide-react";

const courseSummary = [
  "Introduction to Financial Markets",
  "Forex Market Fundamentals",
  "Trading Platforms (MT5)",
  "Candlestick Mastery",
  "Market Structure (Technical Analysis)",
  "CRT Trading Model",
  "Market Range Concept",
  "Fundamental Analysis",
  "Risk Management (Trade Management)",
  "Trading Psychology",
];

const whoThisIsFor = [
  { text: "Complete beginners", desc: "No prior trading or financial experience required." },
  { text: "Aspiring Forex Traders", desc: "Learn to build a consistent, logical trading plan." },
  { text: "People seeking a proven strategy", desc: "Master the CRT Trading Model to refine entries and exits." },
  { text: "Risk-conscious investors", desc: "Understand capital preservation and custom risk management parameters." },
];

const modules = [
  {
    title: "1. Intro to Financial Markets",
    description: "Overview of global markets, forex trading structures, and major market participants.",
    icon: BookOpen,
  },
  {
    title: "2. Forex Market Fundamentals",
    description: "Understanding currency pairs, pips, leverage, bid/ask spreads, and basic calculations.",
    icon: TrendingUp,
  },
  {
    title: "3. Trading Platforms (MT5)",
    description: "Setting up MetaTrader 5, navigating charts, executing orders, and using drawing tools.",
    icon: Computer,
  },
  {
    title: "4. Candlestick Mastery",
    description: "Mastering price action structures, single candle forms, and high-probability candlestick patterns.",
    icon: Award,
  },
  {
    title: "5. Market Structure",
    description: "Identifying trend direction, key support/resistance levels, and supply/demand zones.",
    icon: Zap,
  },
  {
    title: "6. CRT Trading Model",
    description: "Mastering the proprietary CRT entry, execution, and exit validation model.",
    icon: Shield,
  },
  {
    title: "7. Market Range Concept",
    description: "Analyzing premium vs. discount pricing, market equilibrium, and trading range consolidations.",
    icon: Wallet,
  },
  {
    title: "8. Fundamental Analysis",
    description: "Evaluating interest rates, central bank news, economic indicators, and news events.",
    icon: Users,
  },
  {
    title: "9. Risk Management",
    description: "Implementing strict position sizing, risk-to-reward ratios, and trade management plans.",
    icon: Lock,
  },
  {
    title: "10. Trading Psychology",
    description: "Developing discipline, creating a trading journal, and mastering trading emotions.",
    icon: Shield,
  },
];

const skillsGained = [
  { title: "Forex Market Literacy", desc: "Understanding price movement, order flow, and trading mechanics." },
  { title: "Precision Technical Analysis", desc: "Identifying high-probability trends, structures, and entry zones." },
  { title: "Proprietary CRT Execution", desc: "Applying a systematic, backtested model for entries and exits." },
  { title: "Advanced Risk Control", desc: "Protecting trading equity using proper position sizing and risk parameters." },
  { title: "Professional Trading Mindset", desc: "Developing the discipline and focus required to trade without anxiety." },
];

export default function CoursesPublicPage() {
  const { user } = useAuth();

  const handleAccessAction = () => {
    if (user) {
      window.location.href = "/dashboard/courses";
    } else {
      window.location.href = "/login?redirect=/dashboard/courses";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-[#08080A] transition-colors duration-300">
      <div className="section-padding">
        
        {/* Header Hero */}
        <ScrollReveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-[#1D4ED8] text-sm font-semibold tracking-widest uppercase">Official Academy</span>
            <h1 className="font-display text-4xl md:text-6xl text-slate-900 dark:text-white mt-3 tracking-wider leading-tight font-bold">
              FOREX TRADING <span className="text-[#1D4ED8]">MASTERCLASS</span>
            </h1>
            <p className="text-slate-500 dark:text-gray-400 mt-6 text-lg leading-relaxed">
              This course provides real skills, clear understanding, and practical strategies for analyzing, trading, and mastering forex markets—all without the usual hype, scams, or confusion.
            </p>
            <p className="text-[#1D4ED8] font-medium mt-4 text-sm">
              No prior technical knowledge or trading experience is necessary. Learn the right way and make informed financial decisions.
            </p>
            <button
              onClick={handleAccessAction}
              className="mt-8 btn-primary px-8 py-4 text-sm flex items-center justify-center gap-2 mx-auto"
            >
              Access Courses Panel
              <ArrowRight size={16} />
            </button>
          </div>
        </ScrollReveal>

        {/* Course Summary Bullet Grid */}
        <ScrollReveal>
          <div className="max-w-4xl mx-auto bg-white dark:bg-[#111116] border border-gray-200 dark:border-white/10 rounded-2xl p-8 bg-gradient-to-br from-[#1D4ED8]/5 to-transparent shadow-sm mb-20">
            <h3 className="font-display text-xl text-slate-900 dark:text-white text-center tracking-wider mb-6 font-bold">WHAT YOU&apos;LL LEARN AT A GLANCE</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseSummary.map((summary, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-lg p-3">
                  <Check size={16} className="text-[#00E676] shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-gray-300 font-medium">{summary}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Who This Is For & Core Skills */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20 items-stretch">
          
          {/* Who this is for */}
          <ScrollReveal direction="left">
            <div className="bg-white dark:bg-[#111116] border border-gray-200 dark:border-white/10 rounded-2xl p-8 h-full shadow-sm">
              <h2 className="font-display text-2xl text-slate-900 dark:text-white tracking-wider mb-6 flex items-center gap-2 font-bold">
                <Users className="text-[#1D4ED8]" size={22} /> WHO THIS IS FOR
              </h2>
              <div className="space-y-6">
                {whoThisIsFor.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 flex items-center justify-center font-display text-[#1D4ED8] font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-semibold text-sm">{item.text}</h4>
                      <p className="text-slate-500 dark:text-gray-400 text-xs mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Core Skills Gained */}
          <ScrollReveal direction="right">
            <div className="bg-white dark:bg-[#111116] border border-gray-200 dark:border-white/10 rounded-2xl p-8 h-full shadow-sm">
              <h2 className="font-display text-2xl text-slate-900 dark:text-white tracking-wider mb-6 flex items-center gap-2 font-bold">
                <Award className="text-[#1D4ED8]" size={22} /> CORE SKILLS GAINED
              </h2>
              <div className="space-y-5">
                {skillsGained.map((skill, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] mt-2 shrink-0" />
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-semibold text-sm">{skill.title}</h4>
                      <p className="text-slate-500 dark:text-gray-400 text-xs mt-1 leading-relaxed">{skill.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* Modules curriculum breakdown */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="text-[#1D4ED8] text-sm font-semibold tracking-widest uppercase">Curriculum Modules</span>
            <h2 className="font-display text-3xl md:text-4xl text-slate-900 dark:text-white mt-3 tracking-wider font-bold">
              DETAILED MODULE <span className="text-[#1D4ED8]">BREAKDOWN</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <ScrollReveal key={mod.title} delay={i * 0.05}>
                <div className="bg-white dark:bg-[#111116] border border-gray-200 dark:border-white/10 rounded-2xl p-6 h-full flex flex-col justify-between hover:border-[#1D4ED8]/30 shadow-sm transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 flex items-center justify-center mb-4">
                      <Icon size={20} className="text-[#1D4ED8]" />
                    </div>
                    <h3 className="font-display text-lg text-slate-900 dark:text-white tracking-wider mb-3 font-bold">{mod.title}</h3>
                    <p className="text-slate-500 dark:text-gray-400 text-xs leading-relaxed">{mod.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal>
          <div className="max-w-4xl mx-auto mt-20 text-center">
            <div className="bg-white dark:bg-[#111116] border border-gray-200 dark:border-white/10 rounded-2xl p-10 bg-gradient-to-br from-[#1D4ED8]/5 via-transparent to-[#1D4ED8]/5 shadow-sm">
              <h2 className="font-display text-2xl md:text-3xl text-slate-900 dark:text-white tracking-wider mb-3 font-bold">READY TO START YOUR FOREX TRADING JOURNEY?</h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
                By the end of this course, you will move from complete beginner to disciplined forex trader, able to independently analyze global charts, execute trades, and manage risk using the CRT model.
              </p>
              <button
                onClick={handleAccessAction}
                className="btn-primary px-10 py-4 text-sm inline-flex items-center gap-2"
              >
                Access Course Lessons
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
