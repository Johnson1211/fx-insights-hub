"use client";

import { motion } from "framer-motion";
import { GraduationCap, MapPin, UserCheck, CalendarCheck, Flame } from "lucide-react";

export default function TrainingComingSoon() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between border-b border-elite-border/30 pb-4">
        <h1 className="font-display text-3xl text-white tracking-wider">ACADEMY TRAINING</h1>
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
          <GraduationCap size={40} className="text-elite-gold" />
        </div>

        {/* Text */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl text-white tracking-wider">INTERACTIVE TRAINING SEMINARS COMING SOON!!</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Register for advanced physical bootcamps, interactive classroom sessions, and 1-on-1 private mentorship programs. Learn capital scaling models, market psychological rules, and live execution directly from **Peleboss**.
          </p>
        </div>

        {/* Features preview */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 text-left">
          {[
            { title: "Physical Bootcamps", desc: "Hands-on, in-person training events in professional classrooms.", icon: MapPin },
            { title: "1-on-1 Mentorship", desc: "Private consultation sessions and custom trading model analysis.", icon: UserCheck },
            { title: "Custom Schedule", desc: "Book flexible hours and sessions that align with your timezone.", icon: CalendarCheck },
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

        {/* Info box */}
        <div className="p-4 rounded-xl bg-elite-gold/5 border border-elite-gold/20 max-w-md mx-auto flex gap-3 items-center text-left">
          <GraduationCap size={20} className="text-elite-gold shrink-0" />
          <p className="text-gray-400 text-xs leading-relaxed">
            Training plan subscribers will get early access booking slots and 30% discount keys to all physical events.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
