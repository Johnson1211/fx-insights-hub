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
} from "lucide-react";
import { useState } from "react";

const stats = [
  { value: 1000, suffix: "+", label: "Active Members", icon: Users },
  { value: 87, suffix: "%", label: "Win Rate", icon: Target },
  { value: 8, suffix: "+", label: "Years Experience", icon: Award },
  { value: 1200000, suffix: "", prefix: "$", label: "Profits Generated", icon: TrendingUp },
];

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

const testimonials = [
  {
    name: "Michael Chen",
    role: "Premium Member",
    avatar: "MC",
    rating: 5,
    text: "The signals here are incredibly accurate. My account is up 34% in just 3 months. By far the best trading community online.",
  },
  {
    name: "Sarah Williams",
    role: "Copy Trader",
    avatar: "SW",
    rating: 5,
    text: "Copy trading has been flawless. Setup was done in less than 5 minutes and I see profits coming in while at my full-time job.",
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

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeMedia, setActiveMedia] = useState<{ type: "video" | "image"; url: string; title: string } | null>(null);

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

        <div className="relative z-10 section-padding text-center max-w-5xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elite-gold/10 border border-elite-gold/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-elite-green animate-pulse" />
              <span className="text-sm text-elite-gold font-medium">Live Signals Active Now</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-none tracking-wider mb-6"
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
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Join the elite community of profitable forex traders at Fx Insights Hub. Get professional signals, live coaching, and copy trading that actually works.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              Start Trading Now
              <ArrowRight size={18} className="inline ml-2" />
            </Link>
            <Link href="/services" className="btn-outline text-lg px-8 py-4">
              View Services
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-gray-500 text-sm"
          >
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-elite-green" />
              <span>Secure Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-elite-green" />
              <span>1,000+ Members</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-elite-gold" />
              <span>4.9/5 Rating</span>
            </div>
          </motion.div>
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
                    alt="Ofori Agyei Samuel — Peleboss"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 glass-card p-4 animate-pulse-glow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-elite-green/20 flex items-center justify-center">
                      <TrendingUp size={20} className="text-elite-green" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">8+ Years</p>
                      <p className="text-gray-500 text-xs">Trading Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Meet The Founder</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mt-3 tracking-wider mb-2">
                OFORI AGYEI <span className="gold-gradient-text">SAMUEL</span>
              </h2>
              <p className="text-elite-gold font-semibold tracking-widest uppercase text-sm mb-6">Also Known As Peleboss</p>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  With over 8 years of experience in the forex markets, Peleboss has developed a systematic approach to trading that emphasizes risk management, technical precision, and psychological discipline.
                </p>
                <p>
                  His journey evolved into a global community of over 1,000 profitable traders through Fx Insights Hub — a platform dedicated to empowering everyday people to achieve financial freedom through forex.
                </p>
                <p>
                  His philosophy is simple: "Protect your capital first, profits will follow." Every signal, every lesson, every live session is designed with this principle at its core.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="glass-card px-5 py-3">
                  <p className="font-display text-2xl text-white">$1.2M+</p>
                  <p className="text-gray-500 text-xs">Verified Profits</p>
                </div>
                <div className="glass-card px-5 py-3">
                  <p className="font-display text-2xl text-white">87%</p>
                  <p className="text-gray-500 text-xs">Signal Accuracy</p>
                </div>
                <div className="glass-card px-5 py-3">
                  <p className="font-display text-2xl text-white">1,000+</p>
                  <p className="text-gray-500 text-xs">Students Trained</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="section-padding">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Testimonials</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mt-3 tracking-wider">
                TRADER <span className="gold-gradient-text">SUCCESS STORIES</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.15}>
                <div className="glass-card-hover p-8 h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={16} className="text-elite-gold fill-elite-gold" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-elite-gold/30 to-blue-600/30 border border-elite-gold/30 flex items-center justify-center">
                      <span className="text-elite-gold text-sm font-bold">{t.avatar}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
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
