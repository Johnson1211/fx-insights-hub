"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Upload, Plus, Trash2, Download, Loader2, CheckCircle2, AlertCircle, X, Eye } from "lucide-react";

type Toast = { type: "success" | "error"; message: string } | null;

export default function AdminContent() {
  const [showUpload, setShowUpload] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<Toast>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("basics");
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [isFreePreview, setIsFreePreview] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

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
      showToast("error", "Failed to fetch videos list");
    } finally {
      setVideosLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploadingFile(true);
    setUploadProgress(0);

    try {
      const sigRes = await fetch("/api/admin/cloudinary-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const sigData = await sigRes.json();
      if (!sigRes.ok) throw new Error(sigData.error || "Failed to generate upload signature");

      const { signature, timestamp, folder, apiKey, cloudName } = sigData;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        setUploadingFile(false);
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setUrl(response.secure_url);
          if (response.duration) {
            setDuration(Math.ceil(response.duration / 60).toString());
          }
          showToast("success", "Video file uploaded to Cloudinary successfully!");
        } else {
          try {
            const errResponse = JSON.parse(xhr.responseText);
            setError(errResponse.error?.message || "Failed to upload to storage cloud");
          } catch {
            setError("Failed to upload to storage cloud");
          }
        }
      };

      xhr.onerror = () => {
        setUploadingFile(false);
        setError("Network error occurred during file upload.");
      };

      xhr.send(formData);
    } catch (err: any) {
      setUploadingFile(false);
      setError(err.message || "Failed to prepare file upload");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
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

      showToast("success", "Course video added successfully!");
      // Reset form fields
      setTitle("");
      setCategory("basics");
      setUrl("");
      setDuration("");
      setDescription("");
      setIsFreePreview(false);
      setShowUpload(false);
      fetchVideos();
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
      showToast("success", "Video deleted successfully!");
      fetchVideos();
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete video");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "bg-elite-green/15 border-elite-green/35 text-elite-green"
                : "bg-elite-red/15 border-elite-red/35 text-elite-red"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-white tracking-wider">VIDEO COURSE CMS</h1>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="btn-primary flex items-center gap-2"
        >
          {showUpload ? <X size={16} /> : <Plus size={16} />}
          {showUpload ? "Cancel" : "Add Video"}
        </button>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-card p-6"
        >
          <h2 className="font-display text-lg text-white tracking-wider mb-4 flex items-center gap-2">
            <Video size={18} className="text-elite-gold" /> UPLOAD COURSE VIDEO
          </h2>
          <form onSubmit={handleUploadSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Title</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Intro to Support & Resistance"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Category</label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="basics">Basics</option>
                <option value="technical analysis">Technical Analysis</option>
                <option value="fundamental analysis">Fundamental Analysis</option>
                <option value="risk management">Risk Management</option>
                <option value="psychology">Psychology</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Video URL</label>
              <input
                type="url"
                required
                className="input-field"
                placeholder="Cloudinary file URL or YouTube/Vimeo link..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Upload Video File</label>
              <input
                type="file"
                accept="video/*"
                className="input-field cursor-pointer file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-elite-gold/10 file:text-elite-gold hover:file:bg-elite-gold/20"
                onChange={handleFileChange}
                disabled={uploadingFile}
              />
              {uploadingFile && (
                <div className="mt-2 text-[10px] text-elite-gold flex items-center gap-2 bg-elite-gold/5 p-2 rounded border border-elite-gold/10 animate-pulse">
                  <Loader2 size={10} className="animate-spin" />
                  Uploading Progress: {uploadProgress}%
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Duration (minutes)</label>
              <input
                type="number"
                className="input-field"
                placeholder="e.g. 15"
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
              <label htmlFor="isFreePreview" className="text-xs text-gray-300 cursor-pointer select-none">
                Free Preview (allows unapproved users to watch this lesson)
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Video Description</label>
              <textarea
                rows={4}
                className="input-field resize-none text-sm leading-relaxed"
                placeholder="Video overview and topics covered..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {error && (
              <div className="md:col-span-2 p-3 rounded-lg bg-elite-red/10 border border-elite-red/20 text-elite-red text-xs text-center">
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
                    Upload Video
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Content List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-elite-border/50">
                <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Video</th>
                <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Category</th>
                <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Duration</th>
                <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Access</th>
                <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Views</th>
                <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videosLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    <Loader2 size={24} className="animate-spin text-elite-gold mx-auto mb-2" />
                    Loading videos...
                  </td>
                </tr>
              ) : videos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No videos uploaded yet.
                  </td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video.id} className="border-b border-elite-border/30 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-900/50 to-blue-600/30 flex items-center justify-center shrink-0">
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
                    <td className="p-4 text-gray-400 text-sm font-mono">
                      <span className="flex items-center gap-1.5">
                        <Eye size={14} className="text-gray-500" />
                        {video.views || 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {video.url && (
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
      </div>
    </div>
  );
}
