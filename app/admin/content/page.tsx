"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Video, FileText, Upload, Plus, Trash2 } from "lucide-react";

type Tab = "videos" | "blog";

const videos = [
  { id: 1, title: "Forex Basics: Understanding Currency Pairs", category: "Basics", duration: "12:34", isFree: true },
  { id: 2, title: "Support & Resistance Mastery", category: "Technical Analysis", duration: "18:45", isFree: false },
  { id: 3, title: "Risk Management: The 1% Rule", category: "Risk Management", duration: "15:20", isFree: false },
];

const blogPosts = [
  { id: 1, title: "EUR/USD Weekly Analysis: Bullish Momentum Building", category: "Forex", status: "Published", date: "2024-01-15" },
  { id: 2, title: "Gold (XAU/USD) Technical Outlook", category: "Gold", status: "Draft", date: "2024-01-14" },
];

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<Tab>("videos");
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-white tracking-wider">CONTENT MANAGEMENT</h1>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Add Content
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("videos")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "videos"
              ? "bg-elite-gold/10 text-elite-gold border border-elite-gold/20"
              : "bg-elite-surface text-gray-400 border border-elite-border hover:text-white"
          }`}
        >
          <Video size={16} />
          Videos
        </button>
        <button
          onClick={() => setActiveTab("blog")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "blog"
              ? "bg-elite-gold/10 text-elite-gold border border-elite-gold/20"
              : "bg-elite-surface text-gray-400 border border-elite-border hover:text-white"
          }`}
        >
          <FileText size={16} />
          Blog Posts
        </button>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-card p-6"
        >
          <h2 className="font-display text-lg text-white tracking-wider mb-4">
            {activeTab === "videos" ? "UPLOAD VIDEO" : "CREATE BLOG POST"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Title</label>
              <input type="text" className="input-field" placeholder="Enter title..." />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select className="input-field">
                <option>Basics</option>
                <option>Technical Analysis</option>
                <option>Risk Management</option>
                <option>Psychology</option>
              </select>
            </div>
            {activeTab === "videos" && (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Video URL</label>
                  <input type="url" className="input-field" placeholder="YouTube/Vimeo URL or upload..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Duration (minutes)</label>
                  <input type="number" className="input-field" placeholder="15" />
                </div>
              </>
            )}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">
                {activeTab === "videos" ? "Description" : "Content"}
              </label>
              <textarea rows={4} className="input-field resize-none" placeholder={activeTab === "videos" ? "Video description..." : "Blog post content..."} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button className="btn-primary flex items-center gap-2">
                <Upload size={16} />
                {activeTab === "videos" ? "Upload Video" : "Publish Post"}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content List */}
      <div className="glass-card overflow-hidden">
        {activeTab === "videos" ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-elite-border/50">
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Video</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Duration</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Access</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video.id} className="border-b border-elite-border/30 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-900/50 to-blue-600/30 flex items-center justify-center">
                          <Video size={16} className="text-blue-400" />
                        </div>
                        <span className="text-white text-sm">{video.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">{video.category}</td>
                    <td className="p-4 text-gray-400 text-sm font-mono">{video.duration}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${video.isFree ? "bg-elite-green/10 text-elite-green" : "bg-elite-gold/10 text-elite-gold"}`}>
                        {video.isFree ? "Free" : "Premium"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-gray-500 hover:text-elite-red transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-elite-border/50">
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Title</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.map((post) => (
                  <tr key={post.id} className="border-b border-elite-border/30 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-white text-sm">{post.title}</td>
                    <td className="p-4 text-gray-400 text-sm">{post.category}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${post.status === "Published" ? "bg-elite-green/10 text-elite-green" : "bg-gray-500/10 text-gray-400"}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">{post.date}</td>
                    <td className="p-4">
                      <button className="text-gray-500 hover:text-elite-red transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
