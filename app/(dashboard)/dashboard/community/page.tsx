"use client";

import { motion } from "framer-motion";
import { MessageSquare, Users, Award, BookOpen, Flame } from "lucide-react";

export default function CommunityComingSoon() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between border-b border-elite-border/30 pb-4">
        <h1 className="font-display text-3xl text-white tracking-wider">COMMUNITY HUB</h1>
        <span className="text-xs text-elite-gold bg-elite-gold/10 px-3 py-1 rounded-full border border-elite-gold/20 flex items-center gap-1">
          <Flame size={12} className="animate-pulse" /> Launching Q3 2026
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-12 text-center space-y-8 relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-elite-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center mx-auto shadow-lg shadow-elite-gold/5 relative">
          <MessageSquare size={40} className="text-elite-gold" />
        </div>

        {/* Text */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl text-white tracking-wider">INTERACTIVE FORUM COMING SOON!!</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Our dedicated members-only chat, discussion board, and collaborative trade planning workspace is currently under development. Get ready to network, share setups, and grow together as a collective.
          </p>
        </div>

        {/* Features preview */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 text-left">
          {[
            { title: "Discussion Boards", desc: "Categorized threads for Forex, Crypto, Indices, and General Chat.", icon: Users },
            { title: "Trade Showcases", desc: "Post your chart markups, trading results, and receive peer reviews.", icon: Award },
            { title: "Mentor Q&A Feed", desc: "Submit questions directly to Peleboss and get pinned video responses.", icon: BookOpen },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <Icon size={16} className="text-elite-gold mb-2" />
                <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Telegram/WhatsApp reminder */}
        <div className="p-4 rounded-xl bg-elite-gold/5 border border-elite-gold/20 max-w-md mx-auto text-center">
          <p className="text-gray-400 text-xs leading-relaxed mb-3">
            While the forum is under construction, join our active group chats on Telegram and WhatsApp:
          </p>
          <div className="flex gap-2 justify-center">
            <a href="https://wa.link/cu9c9s" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 text-xs font-semibold transition-colors">WhatsApp Community</a>
            <a href="https://t.me/+eaNhaqhRdYc1ZWU0" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold transition-colors">Telegram Signals</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
