"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, Crown, Copy, CheckCircle, Shield,
  TrendingUp, Camera, Lock, Eye, EyeOff, Save, AlertCircle,
  CheckCircle2, Loader2,
} from "lucide-react";

type Tab = "profile" | "security" | "referral";

type Toast = { type: "success" | "error"; message: string } | null;

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [toast, setToast] = useState<Toast>(null);
  const [copied, setCopied] = useState(false);

  // ——— Profile tab ———
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    tradingExperience: "intermediate",
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // ——— Avatar ———
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ——— Security tab ———
  const [passwords, setPasswords] = useState({
    current: "", newPass: "", confirm: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  // Pre-fill form when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        phone: user.phone || "",
        tradingExperience: user.tradingExperience || "intermediate",
      });
      if (user.avatar) setAvatarPreview(user.avatar);
    }
  }, [user]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // ——— Avatar upload ———
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Image must be under 5 MB");
      return;
    }

    setAvatarUploading(true);
    try {
      // Get Cloudinary signature
      const sigRes = await fetch("/api/admin/cloudinary-signature");
      const { signature, timestamp, apiKey, cloudName, folder } = await sigRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder || "avatars");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!uploadRes.ok) throw new Error("Upload failed");
      const uploadData = await uploadRes.json();
      const avatarUrl = uploadData.secure_url;

      // Save URL to DB
      const saveRes = await fetch("/api/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl }),
      });

      if (!saveRes.ok) throw new Error("Failed to save avatar");

      setAvatarPreview(avatarUrl);
      await refreshUser();
      showToast("success", "Profile photo updated!");
    } catch (err: any) {
      showToast("error", err.message || "Avatar upload failed");
    } finally {
      setAvatarUploading(false);
    }
  };

  // ——— Save profile ———
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      showToast("error", "Name cannot be empty");
      return;
    }
    setProfileSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      await refreshUser();
      showToast("success", "Profile saved successfully!");
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  // ——— Change password ———
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      showToast("error", "New passwords do not match");
      return;
    }
    if (passwords.newPass.length < 6) {
      showToast("error", "Password must be at least 6 characters");
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.newPass,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password change failed");
      setPasswords({ current: "", newPass: "", confirm: "" });
      showToast("success", "Password changed successfully!");
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setPwSaving(false);
    }
  };

  // ——— Referral ———
  const copyReferral = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user.referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "referral", label: "Referral" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Title */}
      <h1 className="font-display text-3xl text-white tracking-wider">PROFILE &amp; SETTINGS</h1>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
              toast.type === "success"
                ? "bg-elite-green/10 border-elite-green/30 text-elite-green"
                : "bg-elite-red/10 border-elite-red/30 text-elite-red"
            }`}
          >
            {toast.type === "success"
              ? <CheckCircle2 size={18} />
              : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Header Card */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar */}
        <div className="relative group shrink-0">
          <div
            className="w-24 h-24 rounded-2xl border-2 border-elite-gold/30 overflow-hidden cursor-pointer bg-gradient-to-br from-elite-gold/20 to-blue-700/20 flex items-center justify-center"
            onClick={() => fileRef.current?.click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-display text-4xl text-elite-gold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
              {avatarUploading
                ? <Loader2 size={22} className="text-white animate-spin" />
                : <Camera size={22} className="text-white" />}
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-7 h-7 bg-elite-gold rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Camera size={12} className="text-black" />
          </button>
        </div>

        {/* User info */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-display text-2xl text-white">{user?.name}</h2>
          <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-3">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-elite-gold/10 border border-elite-gold/20 text-elite-gold text-xs font-medium">
              <Crown size={11} /> {user?.plan?.toUpperCase()}
            </span>
            {user?.isVerified && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-elite-green/10 border border-elite-green/20 text-elite-green text-xs font-medium">
                <Shield size={11} /> Verified
              </span>
            )}
            {user?.tradingExperience && (
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs capitalize">
                {user.tradingExperience}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-2">Click the photo to change your profile picture</p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 p-1 bg-elite-surface/60 rounded-xl border border-elite-border/40 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-elite-gold text-black shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {/* ——— Profile Tab ——— */}
        {tab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-card p-6 md:p-8"
          >
            <h2 className="font-display text-lg text-white tracking-wider mb-6">EDIT PROFILE</h2>
            <form onSubmit={handleProfileSave} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="input-field pl-11"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                {/* Email — read only */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email <span className="text-xs text-gray-600">(cannot change)</span></label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="input-field pl-11 opacity-40 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="input-field pl-11"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                {/* Trading Experience */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Trading Experience</label>
                  <select
                    value={profileData.tradingExperience}
                    onChange={(e) => setProfileData({ ...profileData, tradingExperience: e.target.value })}
                    className="input-field"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="btn-primary flex items-center gap-2 disabled:opacity-60"
                >
                  {profileSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {profileSaving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ——— Security Tab ——— */}
        {tab === "security" && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-card p-6 md:p-8"
          >
            <h2 className="font-display text-lg text-white tracking-wider mb-2">CHANGE PASSWORD</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your current password to set a new one.</p>

            <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
              {/* Current Password */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showCurrent ? "text" : "password"}
                    required
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="input-field pl-11 pr-11"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    minLength={6}
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    className="input-field pl-11 pr-11"
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Strength indicator */}
                {passwords.newPass.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passwords.newPass.length >= i * 2
                            ? passwords.newPass.length >= 8 ? "bg-elite-green" : "bg-yellow-400"
                            : "bg-elite-border"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className={`input-field pl-11 ${
                      passwords.confirm && passwords.confirm !== passwords.newPass
                        ? "border-elite-red/50"
                        : passwords.confirm && passwords.confirm === passwords.newPass
                        ? "border-elite-green/50"
                        : ""
                    }`}
                    placeholder="Re-enter new password"
                  />
                  {passwords.confirm && passwords.confirm === passwords.newPass && (
                    <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-elite-green" />
                  )}
                </div>
                {passwords.confirm && passwords.confirm !== passwords.newPass && (
                  <p className="text-xs text-elite-red mt-1">Passwords do not match</p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={pwSaving}
                  className="btn-primary flex items-center gap-2 disabled:opacity-60"
                >
                  {pwSaving ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                  {pwSaving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ——— Referral Tab ——— */}
        {tab === "referral" && (
          <motion.div
            key="referral"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-elite-gold" />
              <h2 className="font-display text-lg text-white tracking-wider">REFERRAL PROGRAM</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Share your unique referral link. Earn rewards when friends join Fx Insights Hub through your link.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Referral Code</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-elite-surface border border-elite-border rounded-lg px-4 py-3 text-sm text-elite-gold font-mono tracking-widest">
                    {user?.referralCode}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Referral Link</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-elite-surface border border-elite-border rounded-lg px-4 py-3 text-sm text-gray-300 font-mono truncate">
                    {typeof window !== "undefined" ? window.location.origin : ""}/register?ref={user?.referralCode}
                  </div>
                  <button
                    onClick={copyReferral}
                    className="px-4 py-3 rounded-lg bg-elite-gold/10 border border-elite-gold/20 text-elite-gold hover:bg-elite-gold/20 transition-colors flex items-center gap-2 shrink-0"
                  >
                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-elite-gold/5 border border-elite-gold/15">
                <p className="text-sm text-gray-400">
                  <span className="text-elite-gold font-semibold">How it works:</span> When someone registers using your referral link, they get credited to your account. Referral rewards are updated regularly.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
