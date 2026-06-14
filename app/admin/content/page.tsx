"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Video, FileText, Upload, Plus, Trash2, Download, Loader2 } from "lucide-react";

type Tab = "videos" | "blog";

const blogPosts = [
  { id: 1, title: "EUR/USD Weekly Analysis: Bullish Momentum Building", category: "Forex", status: "Published", date: "2024-01-15" },
  { id: 2, title: "Gold (XAU/USD) Technical Outlook", category: "Gold", status: "Draft", date: "2024-01-14" },
];

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<Tab>("videos");
  const [showUpload, setShowUpload] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("basics");
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [isFreePreview, setIsFreePreview] = useState(false);

  const fetchVideos = async () => {
    try {
      setVideosLoading(true);
      const res = await fetch("/api/videos");
      const data = await res.json();
      if (res.ok && data.videos) {
        setVideos(data.videos);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setVideosLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "videos") {
      fetchVideos();
    }
  }, [activeTab]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (activeTab === "videos") {
        const res = await fetch("/api/admin/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            category,
            url,
            duration: duration ? Number(duration) : 0,
            description,
            isFreePreview,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add video");

        // Reset form fields
        setTitle("");
        setCategory("basics");
        setUrl("");
        setDuration("");
        setDescription("");
        setIsFreePreview(false);
        setShowUpload(false);
        fetchVideos();
      } else {
        // Mock blog post logic, just close the upload box
        setShowUpload(false);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await fetch(`/api/admin/videos?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete video");
      fetchVideos();
    } catch (err: any) {
      alert(err.message || "Failed to delete video");
    }
  };

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
          <form onSubmit={handleUploadSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Title</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="basics">Basics</option>
                <option value="technical analysis">Technical Analysis</option>
                <option value="risk management">Risk Management</option>
                <option value="psychology">Psychology</option>
              </select>
            </div>
            {activeTab === "videos" && (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Video URL</label>
                  <input
                    type="url"
                    required
                    className="input-field"
                    placeholder="YouTube/Vimeo URL or direct MP4/WebM URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="15"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="isFreePreview"
                    className="rounded border-elite-border bg-elite-surface text-elite-gold focus:ring-elite-gold cursor-pointer"
                    checked={isFreePreview}
                    onChange={(e) => setIsFreePreview(e.target.checked)}
                  />
                  <label htmlFor="isFreePreview" className="text-sm text-gray-300 cursor-pointer select-none">
                    Free Preview (allows unapproved users to watch this lesson)
                  </label>
                </div>
              </>
            )}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">
                {activeTab === "videos" ? "Description" : "Content"}
              </label>
              <textarea
                rows={4}
                required={activeTab !== "videos"}
                className="input-field resize-none"
                placeholder={activeTab === "videos" ? "Video description..." : "Blog post content..."}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {error && (
              <div className="md:col-span-2 p-3 rounded-lg bg-elite-red/10 border border-elite-red/20 text-elite-red text-sm text-center">
                {error}
              </div>
            )}

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Upload size={16} />
                    {activeTab === "videos" ? "Upload Video" : "Publish Post"}
                  </>
                )}
              </button>
            </div>
          </form>
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
                {videosLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">
                      <Loader2 size={24} className="animate-spin text-elite-gold mx-auto mb-2" />
                      Loading videos...
                    </td>
                  </tr>
                ) : videos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">
                      No videos uploaded yet.
                    </td>
                  </tr>
                ) : (
                  videos.map((video) => (
                    <tr key={video.id} className="border-b border-elite-border/30 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-900/50 to-blue-600/30 flex items-center justify-center">
                            <Video size={16} className="text-blue-400" />
                          </div>
                          <span className="text-white text-sm font-medium">{video.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400 text-sm capitalize">{video.category}</td>
                      <td className="p-4 text-gray-400 text-sm font-mono">{video.duration > 0 ? `${video.duration} mins` : "--"}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded ${video.isFreePreview ? "bg-elite-green/10 text-elite-green" : "bg-elite-gold/10 text-elite-gold"}`}>
                          {video.isFreePreview ? "Free Preview" : "Premium"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {/* Direct download option */}
                          {video.url ? (
                            <a
                              href={video.url}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Download video"
                              className="text-gray-500 hover:text-elite-gold transition-colors"
                            >
                              <Download size={16} />
                            </a>
                          ) : (
                            <span className="text-gray-700 cursor-not-allowed" title="URL hidden/unavailable">
                              <Download size={16} />
                            </span>
                          )}
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
                            title="Delete video"
                            className="text-gray-500 hover:text-elite-red transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
