"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, Crown, Shield, Camera, Lock,
  Eye, EyeOff, Save, AlertCircle, CheckCircle2, Loader2,
} from "lucide-react";

type Tab = "profile" | "security";
type Toast = { type: "success" | "error"; message: string } | null;

export default function AdminSettingsPage() {
  const { user, refreshUser } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [toast, setToast] = useState<Toast>(null);

  // ——— Profile tab ———
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
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
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload/supabase", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        throw new Error(errData.error || "Upload failed");
      }

      const uploadData = await uploadRes.json();
      const avatarUrl = uploadData.url;

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

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
  ];

  // Password Strength Meter
  const getStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 6) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getStrength(passwords.newPass);
  const strengthText = ["Weak", "Medium", "Strong", "Excellent"];
  const strengthColor = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Title */}
      <h1 className="font-display text-3xl text-white tracking-wider">ADMIN SETTINGS</h1>

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
            className="w-24 h-24 rounded-2xl border-2 border-elite-red/30 overflow-hidden cursor-pointer bg-gradient-to-br from-elite-red/20 to-red-700/20 flex items-center justify-center"
            onClick={() => fileRef.current?.click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-display text-4xl text-elite-red">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
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
            className="absolute -bottom-2 -right-2 w-7 h-7 bg-elite-red rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Camera size={12} className="text-white" />
          </button>
        </div>

        {/* User info */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-display text-2xl text-white">{user?.name}</h2>
          <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-3">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-elite-red/10 border border-elite-red/20 text-elite-red text-xs font-medium">
              <Crown size={11} /> {user?.role?.toUpperCase()}
            </span>
            {user?.isVerified && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-elite-green/10 border border-elite-green/20 text-elite-green text-xs font-medium">
                <Shield size={11} /> System Owner
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
                ? "bg-elite-red text-white shadow"
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
            <h2 className="font-display text-lg text-white tracking-wider mb-6">EDIT ADMIN PROFILE</h2>
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
              </div>

              {/* Submit button */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="btn-primary flex items-center gap-2 px-6 py-3 disabled:opacity-50 text-sm font-semibold"
                  style={{ backgroundImage: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)" }}
                >
                  {profileSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Save Changes
                    </>
                  )}
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
            <h2 className="font-display text-lg text-white tracking-wider mb-6">SECURITY &amp; PASSWORD</h2>
            <form onSubmit={handlePasswordChange} className="space-y-5">
              {/* Current password */}
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Grid of new and confirm */}
              <div className="grid md:grid-cols-2 gap-5">
                {/* New password */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">New Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showNew ? "text" : "password"}
                      required
                      value={passwords.newPass}
                      onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                      className="input-field pl-11 pr-11"
                      placeholder="Min 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  {passwords.newPass && (
                    <div className="mt-2.5 space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-500">Password Strength:</span>
                        <span className="font-semibold text-white">{strengthText[strength - 1] || "Very Weak"}</span>
                      </div>
                      <div className="h-1.5 w-full bg-elite-surface rounded-full overflow-hidden flex gap-0.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-full flex-1 transition-all duration-300 ${
                              strength >= step ? strengthColor[strength - 1] : "bg-transparent"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="password"
                      required
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="input-field pl-11"
                      placeholder="••••••••"
                    />
                  </div>

                  {/* Live match indicator */}
                  {passwords.confirm && passwords.newPass !== passwords.confirm && (
                    <p className="text-elite-red text-xs mt-2 flex items-center gap-1.5">
                      <AlertCircle size={12} /> Passwords do not match
                    </p>
                  )}
                  {passwords.confirm && passwords.newPass === passwords.confirm && (
                    <p className="text-elite-green text-xs mt-2 flex items-center gap-1.5">
                      <CheckCircle2 size={12} /> Passwords match
                    </p>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={pwSaving || !passwords.current || !passwords.newPass || passwords.newPass !== passwords.confirm}
                  className="btn-primary flex items-center gap-2 px-6 py-3 disabled:opacity-50 text-sm font-semibold"
                  style={{ backgroundImage: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)" }}
                >
                  {pwSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Lock size={16} /> Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
