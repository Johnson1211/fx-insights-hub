"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { User, Mail, Phone, Crown, Copy, CheckCircle, Shield, TrendingUp } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: "",
    experience: "intermediate",
  });

  const copyReferral = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user.referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="font-display text-3xl text-white tracking-wider">PROFILE & SETTINGS</h1>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-elite-gold/30 to-amber-600/30 border-2 border-elite-gold/30 flex items-center justify-center shrink-0">
            <span className="font-display text-4xl text-elite-gold">{user?.name?.charAt(0) || "U"}</span>
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl text-white tracking-wider">{user?.name}</h2>
            <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-elite-gold/10 border border-elite-gold/20 text-elite-gold text-xs font-medium">
                <Crown size={12} />
                {user?.plan?.toUpperCase()}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-elite-green/10 border border-elite-green/20 text-elite-green text-xs font-medium">
                <Shield size={12} />
                Verified
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Referral Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-elite-gold" />
          <h2 className="font-display text-lg text-white tracking-wider">REFERRAL PROGRAM</h2>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Share your referral link and earn commissions when friends join Fx Insights Hub.
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-elite-surface border border-elite-border rounded-lg px-4 py-3 text-sm text-gray-300 font-mono truncate">
            {window?.location?.origin || ""}/register?ref={user?.referralCode}
          </div>
          <button
            onClick={copyReferral}
            className="px-4 py-3 rounded-lg bg-elite-gold/10 border border-elite-gold/20 text-elite-gold hover:bg-elite-gold/20 transition-colors flex items-center gap-2"
          >
            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </motion.div>

      {/* Edit Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 md:p-8"
      >
        <h2 className="font-display text-lg text-white tracking-wider mb-6">EDIT PROFILE</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field pl-11"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={formData.email}
                disabled
                className="input-field pl-11 opacity-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Phone</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field pl-11"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Trading Experience</label>
            <select
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="input-field"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm text-gray-400 mb-2">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className="input-field resize-none"
            placeholder="Tell us about your trading journey..."
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button className="btn-primary">Save Changes</button>
        </div>
      </motion.div>
    </div>
  );
}
