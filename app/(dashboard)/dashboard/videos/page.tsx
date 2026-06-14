"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Play, Lock, Clock, BookOpen, BarChart3, Brain, Shield, CheckCircle, ExternalLink, Loader2 } from "lucide-react";

const categories = [
  { id: "all", label: "All Videos", icon: Play },
  { id: "basics", label: "Basics", icon: BookOpen },
  { id: "technical", label: "Technical Analysis", icon: BarChart3 },
  { id: "psychology", label: "Psychology", icon: Brain },
  { id: "risk", label: "Risk Management", icon: Shield },
];

const videos = [
  { id: 1, title: "Forex Basics: Understanding Currency Pairs", category: "basics", duration: "12:34", thumbnail: "bg-gradient-to-br from-blue-900/50 to-blue-600/30", isFree: true, watched: true },
  { id: 2, title: "Support & Resistance Mastery", category: "technical", duration: "18:45", thumbnail: "bg-gradient-to-br from-purple-900/50 to-purple-600/30", isFree: true, watched: false },
  { id: 3, title: "Risk Management: The 1% Rule", category: "risk", duration: "15:20", thumbnail: "bg-gradient-to-br from-green-900/50 to-green-600/30", isFree: true, watched: false },
  { id: 4, title: "Trading Psychology: Mastering Emotions", category: "psychology", duration: "22:10", thumbnail: "bg-gradient-to-br from-indigo-900/50 to-indigo-600/30", isFree: true, watched: false },
  { id: 5, title: "Fibonacci Retracement Strategy", category: "technical", duration: "25:30", thumbnail: "bg-gradient-to-br from-pink-900/50 to-pink-600/30", isFree: true, watched: false },
  { id: 6, title: "Understanding Market Structure", category: "basics", duration: "14:15", thumbnail: "bg-gradient-to-br from-cyan-900/50 to-cyan-600/30", isFree: true, watched: true },
];

export default function VideoLibrary() {
  const { user, refreshUser } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null);
  
  // Lock screen state
  const [derivIdInput, setDerivIdInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="text-elite-gold animate-spin" />
      </div>
    );
  }

  const isApproved = user.role === "admin" || user.brokerApproved;
  const partnerLink = process.env.NEXT_PUBLIC_DERIV_LINK || "https://track.deriv.com/_eaNhaqhRdYc1ZWU0/1/";

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/user/deriv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ derivId: derivIdInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit ID");
      
      await refreshUser();
      setShowEditForm(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVideos = activeCategory === "all" 
    ? videos 
    : videos.filter((v) => v.category === activeCategory);

  // Locked Screen render
  if (!isApproved) {
    const isPending = user.derivStatus === "pending" && !showEditForm;

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Premium Content</span>
          <h1 className="font-display text-4xl text-white mt-3 tracking-wider flex items-center justify-center gap-2">
            <Lock className="text-elite-gold" size={30} /> UNLOCK VIDEO LESSONS
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
            Access to our comprehensive trading lessons, strategy breakdowns, and webinars is reserved for members registered under our Introducing Broker (IB) partner link on Deriv.
          </p>
        </div>

        {isPending ? (
          /* Pending Status Card */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center space-y-6 border border-elite-gold/20 bg-gradient-to-br from-elite-gold/5 to-transparent"
          >
            <div className="w-16 h-16 rounded-full bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center mx-auto animate-pulse">
              <Clock size={32} className="text-elite-gold" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-white tracking-wide">VERIFICATION PENDING</h2>
              <p className="text-gray-400 text-sm mt-3 max-w-md mx-auto leading-relaxed">
                Your submitted Deriv Account ID <strong className="text-white">({user.derivId})</strong> is currently being verified by our admin team.
              </p>
              <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                Verification is usually completed in less than 24 hours. Your lessons will automatically unlock once approved.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => {
                  setDerivIdInput(user.derivId || "");
                  setShowEditForm(true);
                }}
                className="text-gray-400 hover:text-white transition-colors text-xs underline"
              >
                Submit a different Account ID
              </button>
            </div>
          </motion.div>
        ) : (
          /* Verification Form & Instructions */
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* Step 1: Register */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center font-display text-elite-gold font-bold">1</div>
                <h3 className="font-display text-lg text-white tracking-wider">REGISTER VIA OUR PARTNER LINK</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Click the partner link below to register a real trading account with our partner broker, **Deriv**.
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Note: If you already have a Deriv account, you must create a new one using a different email address under our link to link it to our IB network.
                </p>
              </div>
              <div className="pt-8">
                <a
                  href={partnerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                >
                  Register on Deriv
                  <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>

            {/* Step 2: Submit ID */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 flex flex-col justify-between"
            >
              <form onSubmit={handleVerifySubmit} className="space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center font-display text-elite-gold font-bold">2</div>
                  <h3 className="font-display text-lg text-white tracking-wider">SUBMIT ACCOUNT ID FOR APPROVAL</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Once registered, enter your Deriv Account ID (e.g. CR123456 or CID number) below to request access.
                  </p>

                  {error && (
                    <div className="p-3 rounded-lg bg-elite-red/10 border border-elite-red/20 text-elite-red text-xs text-center">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Deriv Account ID / CID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CR123456"
                      value={derivIdInput}
                      onChange={(e) => setDerivIdInput(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-outline w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Submit ID for Verification"
                    )}
                  </button>
                  {showEditForm && (
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className="w-full text-center text-xs text-gray-500 hover:text-gray-400 transition-colors mt-3"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // Active / Approved Video Library Screen
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-white tracking-wider">VIDEO LIBRARY</h1>
        <div className="text-sm text-gray-400">
          {videos.filter((v) => v.watched).length} / {videos.length} watched
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "bg-elite-gold/10 text-elite-gold border border-elite-gold/20"
                : "bg-elite-surface text-gray-400 border border-elite-border hover:text-white"
            }`}
          >
            <cat.icon size={16} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video, i) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedVideo(video)}
            className="glass-card-hover overflow-hidden cursor-pointer group"
          >
            <div className={`aspect-video ${video.thumbnail} relative flex items-center justify-center`}>
              {video.watched && (
                <div className="absolute top-3 right-3">
                  <CheckCircle size={18} className="text-elite-green" />
                </div>
              )}

              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={24} className="text-white ml-1" />
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-mono">
                {video.duration}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">{video.title}</h3>
              <p className="text-gray-500 text-xs capitalize">{video.category}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-4xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-elite-surface flex items-center justify-center">
              <div className="text-center">
                <Play size={48} className="text-elite-gold mx-auto mb-4" />
                <p className="text-white font-medium">{selectedVideo.title}</p>
                <p className="text-gray-500 text-sm mt-2">Video player would load here</p>
              </div>
            </div>
            <div className="p-6">
              <h2 className="font-display text-xl text-white tracking-wider mb-2">{selectedVideo.title}</h2>
              <p className="text-gray-400 text-sm">Duration: {selectedVideo.duration}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
