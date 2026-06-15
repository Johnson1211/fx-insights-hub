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
  "Wallet setup & security",
  "Safe crypto trading",
  "Scam detection",
  "Portfolio management",
  "Technical Analysis",
  "Spot Trading",
  "Margin Trading",
];

const whoThisIsFor = [
  { text: "Complete beginners", desc: "No prior financial or coding experience required." },
  { text: "Smartphone & Computer users", desc: "Learn to secure and transact assets on any device." },
  { text: "People looking to avoid scams", desc: "Detect and avoid rug pulls, phishing, and fake exchanges." },
  { text: "Aspiring digital asset investors", desc: "Build a solid, logical foundation for long-term growth." },
];

const modules = [
  {
    title: "Wallets",
    description: "Establish and maintain digital asset wallets confidently.",
    icon: Wallet,
  },
  {
    title: "Secure Transactions",
    description: "Execute secure transactions (send, receive, and safeguard digital assets).",
    icon: Shield,
  },
  {
    title: "Exchanges",
    description: "Comprehend the mechanics of cryptocurrency exchanges.",
    icon: Zap,
  },
  {
    title: "Project Analysis",
    description: "Appraise and analyze crypto projects with expert proficiency.",
    icon: BookOpen,
  },
  {
    title: "Risk & Portfolio",
    description: "Implement risk management strategies and build investment portfolios.",
    icon: TrendingUp,
  },
  {
    title: "Scam Prevention",
    description: "Identify and avoid common pitfalls like scams, hacks, and 'rug pulls'.",
    icon: AlertTriangle,
  },
  {
    title: "Technical Analysis",
    description: "Learn how to interpret market data and price movements using charts, indicators, and patterns. This module equips you with the skills to identify trends, predict potential market behavior, and make data-driven trading decisions with confidence.",
    icon: Award,
  },
  {
    title: "Spot Trading",
    description: "Understand the fundamentals of buying and selling cryptocurrencies in real time. You’ll learn how spot markets operate, how to execute trades effectively, and how to manage risk while building a solid foundation in crypto trading.",
    icon: Computer,
  },
  {
    title: "Margin Trading",
    description: "Explore advanced trading strategies using borrowed capital to amplify potential returns. This module covers leverage, risk management, liquidation mechanics, and best practices to trade responsibly in high-risk, high-reward environments.",
    icon: Lock,
  },
];

const skillsGained = [
  { title: "In-depth Market Literacy", desc: "Understanding how the crypto market functions without the hype." },
  { title: "Core Trading Fundamentals", desc: "Gaining the basics of how to enter and exit positions safely." },
  { title: "Practical On-chain Skills", desc: "Hands-on operations for moving and storing assets." },
  { title: "Security Awareness", desc: "A strong foundation in security best practices to prevent loss." },
  { title: "Portfolio Management", desc: "Expertise in constructing and managing a secure crypto portfolio." },
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
    <div className="min-h-screen pt-24 pb-20 bg-elite-bg">
      <div className="section-padding">
        
        {/* Header Hero */}
        <ScrollReveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Official Academy</span>
            <h1 className="font-display text-4xl md:text-6xl text-white mt-3 tracking-wider leading-tight">
              DIGITAL ASSET <span className="gold-gradient-text">BOOTCAMP</span>
            </h1>
            <p className="text-gray-400 mt-6 text-lg leading-relaxed">
              This course provides real skills, clear understanding, and practical strategies for understanding, trading, and securing digital assets—all without the usual hype, scams, or confusion.
            </p>
            <p className="text-elite-gold font-medium mt-4 text-sm">
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
          <div className="max-w-4xl mx-auto glass-card p-8 bg-gradient-to-br from-elite-gold/5 to-transparent border border-elite-gold/15 mb-20">
            <h3 className="font-display text-xl text-white text-center tracking-wider mb-6">WHAT YOU&apos;LL LEARN AT A GLANCE</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseSummary.map((summary, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/[0.02] border border-elite-border/30 rounded-lg p-3">
                  <Check size={16} className="text-elite-green shrink-0" />
                  <span className="text-sm text-gray-300 font-medium">{summary}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Who This Is For & Core Skills */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20 items-stretch">
          
          {/* Who this is for */}
          <ScrollReveal direction="left">
            <div className="glass-card p-8 h-full">
              <h2 className="font-display text-2xl text-white tracking-wider mb-6 flex items-center gap-2">
                <Users className="text-elite-gold" size={22} /> WHO THIS IS FOR
              </h2>
              <div className="space-y-6">
                {whoThisIsFor.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center font-display text-elite-gold font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">{item.text}</h4>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Core Skills Gained */}
          <ScrollReveal direction="right">
            <div className="glass-card p-8 h-full">
              <h2 className="font-display text-2xl text-white tracking-wider mb-6 flex items-center gap-2">
                <Award className="text-elite-gold" size={22} /> CORE SKILLS GAINED
              </h2>
              <div className="space-y-5">
                {skillsGained.map((skill, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-elite-green mt-2 shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold text-sm">{skill.title}</h4>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{skill.desc}</p>
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
            <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Curriculum Modules</span>
            <h2 className="font-display text-3xl md:text-4xl text-white mt-3 tracking-wider">
              DETAILED MODULE <span className="gold-gradient-text">BREAKDOWN</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <ScrollReveal key={mod.title} delay={i * 0.05}>
                <div className="glass-card p-6 h-full flex flex-col justify-between hover:border-elite-gold/30 transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center mb-4">
                      <Icon size={20} className="text-elite-gold" />
                    </div>
                    <h3 className="font-display text-lg text-white tracking-wider mb-3">{mod.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{mod.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal>
          <div className="max-w-4xl mx-auto mt-20 text-center">
            <div className="glass-card p-10 bg-gradient-to-br from-elite-gold/5 via-transparent to-elite-gold/5 border border-elite-gold/20">
              <h2 className="font-display text-2xl md:text-3xl text-white tracking-wider mb-3">READY TO START YOUR CRYPTO JOURNEY?</h2>
              <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
                By the end of this course, you will move from complete beginner to confident digital asset user, able to independently analyze, transact, and invest safely in crypto markets.
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
