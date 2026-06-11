"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Lock, Clock, BookOpen, BarChart3, Brain, Shield, CheckCircle } from "lucide-react";

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
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null);

  const filteredVideos = activeCategory === "all" 
    ? videos 
    : videos.filter((v) => v.category === activeCategory);

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
