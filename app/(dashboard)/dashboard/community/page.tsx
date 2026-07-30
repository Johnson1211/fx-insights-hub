"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Users, Award, BookOpen, Flame, Plus, X, Upload, Loader2, Send, Eye, Calendar, Tag, ShieldCheck, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  chartImage?: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
  _count?: {
    comments: number;
  };
}

export default function CommunityDashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filtered, setFiltered] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  // New Post Form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [newChartImage, setNewChartImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submittingPost, setSubmittingPost] = useState(false);
  const [postError, setPostError] = useState("");

  // Comments state map (postId -> comments list)
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [commentsMap, setCommentsMap] = useState<{ [postId: string]: Comment[] }>({});
  const [loadingComments, setLoadingComments] = useState<{ [postId: string]: boolean }>({});
  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});
  const [submittingComment, setSubmittingComment] = useState<{ [postId: string]: boolean }>({});

  // Lightbox Modal state
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const categories = ["all", "Forex", "Indices", "Crypto", "General"];

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/forum");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        setFiltered(data.posts || []);
      }
    } catch (err) {
      console.error("Failed to load forum posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    let result = posts;
    if (activeCategory !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    setFiltered(result);
  }, [posts, activeCategory]);

  // Image Upload helper using Supabase Upload route
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPostError("");
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/supabase", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setNewChartImage(data.url);
    } catch (err: any) {
      setPostError(err.message || "Failed to upload chart image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit new thread
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      setPostError("Title and content are required.");
      return;
    }

    setPostError("");
    setSubmittingPost(true);

    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          category: newCategory,
          chartImage: newChartImage || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create thread");

      // Reset & Reload
      setNewTitle("");
      setNewContent("");
      setNewChartImage("");
      setShowCreateModal(false);
      fetchPosts();
    } catch (err: any) {
      setPostError(err.message || "Something went wrong.");
    } finally {
      setSubmittingPost(false);
    }
  };

  // Comments toggle & fetch
  const toggleComments = async (postId: string) => {
    const nextState = !expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: nextState }));

    if (nextState && !commentsMap[postId]) {
      setLoadingComments((prev) => ({ ...prev, [postId]: true }));
      try {
        const res = await fetch(`/api/forum/${postId}/comment`);
        if (res.ok) {
          const data = await res.json();
          setCommentsMap((prev) => ({ ...prev, [postId]: data.comments || [] }));
        }
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        setLoadingComments((prev) => ({ ...prev, [postId]: false }));
      }
    }
  };

  // Submit comment
  const handleCreateComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const commentText = newCommentText[postId]?.trim();
    if (!commentText) return;

    setSubmittingComment((prev) => ({ ...prev, [postId]: true }));
    try {
      const res = await fetch(`/api/forum/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post comment");

      // Clear comment input and append new comment
      setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data.comment],
      }));
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? { ...p, _count: { comments: (p._count?.comments || 0) + 1 } }
            : p
        )
      );
    } catch (err) {
      console.error("Failed to create comment:", err);
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetch(`/api/forum/${postId}/comment?commentId=${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCommentsMap((prev) => ({
          ...prev,
          [postId]: (prev[postId] || []).filter((c) => c.id !== commentId),
        }));
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === postId
              ? { ...p, _count: { comments: Math.max(0, (p._count?.comments || 0) - 1) } }
              : p
          )
        );
      } else {
        alert("Failed to delete comment");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Render post body simple formatting (headers, blockquotes, bold)
  const formatBodyText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      if (trimmed.startsWith("### ")) {
        return <h5 key={idx} className="font-bold text-slate-900 dark:text-slate-900 dark:text-white text-sm mt-3 mb-1">{trimmed.replace("### ", "")}</h5>;
      }
      if (trimmed.startsWith("## ")) {
        return <h4 key={idx} className="font-bold text-elite-gold text-base mt-4 mb-1.5">{trimmed.replace("## ", "")}</h4>;
      }
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote key={idx} className="border-l-2 border-elite-gold bg-slate-50 dark:bg-white/[0.02] p-2 rounded text-xs text-slate-500 dark:text-gray-400 italic my-2">
            {trimmed.replace("> ", "")}
          </blockquote>
        );
      }

      return (
        <p key={idx} className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-2 font-light">
          {trimmed.split(/\*\*([^*]+)\*\*/g).map((part, i) =>
            i % 2 === 1 ? <strong key={i} className="text-slate-900 dark:text-slate-900 dark:text-white font-semibold">{part}</strong> : part
          )}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
        <h1 className="font-display text-3xl text-slate-900 dark:text-slate-900 dark:text-white tracking-wider">COMMUNITY HUB</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2 py-2 px-4 text-xs font-semibold"
        >
          <Plus size={14} /> New Discussion
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
              activeCategory === cat
                ? "bg-elite-gold/15 text-elite-gold border-elite-gold/30"
                : "bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-gray-400 border-white/5 hover:text-slate-900 dark:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Discussion List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-elite-gold" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <Users size={32} className="text-gray-600 mx-auto mb-3" />
          <p className="text-slate-900 dark:text-slate-900 dark:text-white font-semibold text-sm">No discussion threads yet</p>
          <p className="text-slate-500 dark:text-gray-400 text-xs mt-1">Be the first to post a chart markup or general question!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-outline py-2 px-4 text-xs mt-4 mx-auto"
          >
            Create First Thread
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="glass-card p-5 relative overflow-hidden"
            >
              {/* Corner Tag */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[9px] font-bold text-elite-gold bg-elite-gold/10 px-2 py-0.5 rounded border border-elite-gold/20 uppercase tracking-widest">
                <Tag size={10} /> {post.category}
              </div>

              {/* Author & Header */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-elite-gold/30 to-blue-600/30 border border-elite-gold/30 flex items-center justify-center">
                  <span className="text-elite-gold text-xs font-bold">{post.user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h4 className="text-slate-700 dark:text-slate-900 dark:text-white text-xs font-bold">{post.user.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">
                    {new Date(post.createdAt).toLocaleDateString()} at{" "}
                    {new Date(post.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              {/* Post Details */}
              <div className="mt-4 space-y-3">
                <h3 className="font-display text-lg text-slate-900 dark:text-slate-900 dark:text-white font-bold tracking-wide leading-snug">
                  {post.title}
                </h3>
                <div className="text-gray-300 pr-2">
                  {formatBodyText(post.content)}
                </div>
              </div>

              {/* Attached Chart Screen */}
              {post.chartImage && (
                <div className="mt-4">
                  <span className="text-[10px] text-slate-500 dark:text-gray-400 block mb-2 font-bold uppercase tracking-wider">Attached Screenshot:</span>
                  <button
                    onClick={() => setLightboxImage(post.chartImage || null)}
                    className="relative group block overflow-hidden rounded-xl border border-white/5 max-w-md shadow-lg"
                  >
                    <img src={post.chartImage} alt="Chart setup" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-slate-700 dark:text-slate-900 dark:text-white text-xs font-semibold flex items-center gap-1">
                        <Eye size={12} /> View Fullscreen
                      </span>
                    </div>
                  </button>
                </div>
              )}

              {/* Actions row */}
              <div className="mt-5 pt-4 border-t border-gray-200 dark:border-white/10 flex items-center gap-6">
                <button
                  onClick={() => toggleComments(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    expandedComments[post.id] ? "text-elite-gold" : "text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white"
                  }`}
                >
                  <MessageSquare size={15} />
                  <span>Discussion ({post._count?.comments || 0})</span>
                </button>
              </div>

              {/* Comments drawer */}
              <AnimatePresence>
                {expandedComments[post.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-4 pt-4 border-t border-gray-200 dark:border-white/10 space-y-4 bg-slate-50 dark:bg-black/10 p-4 rounded-xl"
                  >
                    {/* Add Comment input */}
                    <form onSubmit={(e) => handleCreateComment(e, post.id)} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a response..."
                        required
                        value={newCommentText[post.id] || ""}
                        onChange={(e) =>
                          setNewCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        className="input-field py-2 text-xs"
                      />
                      <button
                        type="submit"
                        disabled={submittingComment[post.id]}
                        className="btn-primary py-2 px-3 flex items-center justify-center shrink-0"
                      >
                        {submittingComment[post.id] ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Send size={13} />
                        )}
                      </button>
                    </form>

                    {/* Loader */}
                    {loadingComments[post.id] ? (
                      <div className="flex justify-center py-4">
                        <Loader2 size={16} className="animate-spin text-elite-gold" />
                      </div>
                    ) : (commentsMap[post.id] || []).length === 0 ? (
                      <p className="text-center text-[10px] text-slate-500 dark:text-gray-400 py-3 italic">No replies yet. Join the discussion!</p>
                    ) : (
                      <div className="space-y-3">
                        {(commentsMap[post.id] || []).map((c) => (
                          <div key={c.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1.5 relative group">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-700 dark:text-slate-900 dark:text-white text-xs font-semibold">{c.user.name}</span>
                                {user?.role === "admin" && (
                                  <button
                                    onClick={() => handleDeleteComment(post.id, c.id)}
                                    className="text-slate-500 dark:text-gray-400 hover:text-elite-red transition-colors duration-150"
                                    title="Delete comment"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                )}
                              </div>
                              <span className="text-[9px] text-slate-500 dark:text-gray-400">
                                {new Date(c.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-300 text-xs leading-relaxed">{c.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowCreateModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg text-slate-900 dark:text-slate-900 dark:text-white font-bold tracking-wider">CREATE DISCUSSION</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase mb-2">Subject / Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Weekly EUR/USD analysis"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase mb-2">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="input-field"
                    >
                      <option value="Forex">Forex</option>
                      <option value="Indices">Indices</option>
                      <option value="Crypto">Crypto</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                {/* Content body */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase mb-2">Discussion Body</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter writeup content. Supports headings using '##' or '###' and list items using '-' or '*'..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="input-field resize-none text-sm"
                  />
                </div>

                {/* Upload Section */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase mb-2">Attach Chart Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="input-field cursor-pointer file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-elite-gold/10 file:text-elite-gold hover:file:bg-elite-gold/20"
                    />
                    {uploadingImage && <Loader2 size={16} className="animate-spin text-elite-gold shrink-0" />}
                  </div>
                  {newChartImage && (
                    <div className="mt-3 relative w-32 h-20 rounded-lg overflow-hidden border border-white/10 shadow">
                      <img src={newChartImage} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewChartImage("")}
                        className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full hover:bg-black text-slate-900 dark:text-white"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Error Banner */}
                {postError && (
                  <div className="p-3 rounded-lg bg-elite-red/10 border border-elite-red/20 text-elite-red text-xs text-center">
                    {postError}
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingPost}
                    className="btn-primary py-2.5 px-6 text-xs font-bold"
                  >
                    {submittingPost ? <Loader2 size={14} className="animate-spin" /> : "Publish Discussion"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox fullscreen Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 cursor-zoom-out"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightboxImage} alt="Chart fullscreen" className="w-full h-auto max-h-[80vh] rounded-xl object-contain border border-elite-border" />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/95 text-slate-900 dark:text-white rounded-full transition-colors border border-white/10"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
