"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Filter, Search, Star, Clock, Target, Eye, X, Link as LinkIcon, MessageSquare, Send, Loader2, Trash2, Heart } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface Signal {
  _id: string;
  pair: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2?: number;
  timeframe: string;
  status: string;
  result?: string;
  pips?: number;
  analysis: string;
  chartImage?: string;
  createdAt: string;
}

export default function DashboardSignals() {
  const { user } = useAuth();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [filtered, setFiltered] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Comments states
  const [expandedComments, setExpandedComments] = useState<{ [signalId: string]: boolean }>({});
  const [commentsMap, setCommentsMap] = useState<{ [signalId: string]: any[] }>({});
  const [loadingComments, setLoadingComments] = useState<{ [signalId: string]: boolean }>({});
  const [newCommentText, setNewCommentText] = useState<{ [signalId: string]: string }>({});
  const [submittingComment, setSubmittingComment] = useState<{ [signalId: string]: boolean }>({});

  // Likes states
  const [likesMap, setLikesMap] = useState<{ [signalId: string]: { count: number; hasLiked: boolean } }>({});

  const toggleLike = async (signalId: string) => {
    try {
      const res = await fetch(`/api/signals/${signalId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLikesMap((prev) => {
          const current = prev[signalId] || { count: 0, hasLiked: false };
          return {
            ...prev,
            [signalId]: {
              count: data.liked ? current.count + 1 : Math.max(0, current.count - 1),
              hasLiked: data.liked,
            },
          };
        });
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const toggleComments = async (signalId: string) => {
    const nextState = !expandedComments[signalId];
    setExpandedComments((prev) => ({ ...prev, [signalId]: nextState }));

    if (nextState && !commentsMap[signalId]) {
      setLoadingComments((prev) => ({ ...prev, [signalId]: true }));
      try {
        const res = await fetch(`/api/signals/${signalId}/comment`);
        if (res.ok) {
          const data = await res.json();
          setCommentsMap((prev) => ({ ...prev, [signalId]: data.comments || [] }));
        }
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        setLoadingComments((prev) => ({ ...prev, [signalId]: false }));
      }
    }
  };

  const handleCreateComment = async (e: React.FormEvent, signalId: string) => {
    e.preventDefault();
    const commentText = newCommentText[signalId]?.trim();
    if (!commentText) return;

    setSubmittingComment((prev) => ({ ...prev, [signalId]: true }));
    try {
      const res = await fetch(`/api/signals/${signalId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post comment");

      setNewCommentText((prev) => ({ ...prev, [signalId]: "" }));
      setCommentsMap((prev) => ({
        ...prev,
        [signalId]: [...(prev[signalId] || []), data.comment],
      }));
    } catch (err) {
      console.error("Failed to create comment:", err);
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [signalId]: false }));
    }
  };

  const handleDeleteComment = async (signalId: string, commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetch(`/api/signals/${signalId}/comment?commentId=${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCommentsMap((prev) => ({
          ...prev,
          [signalId]: (prev[signalId] || []).filter((c) => c.id !== commentId),
        }));
      } else {
        alert("Failed to delete comment");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (signals.length === 0) return;
    signals.forEach(async (sig) => {
      try {
        const res = await fetch(`/api/signals/${sig._id}/like`);
        if (res.ok) {
          const data = await res.json();
          setLikesMap((prev) => ({
            ...prev,
            [sig._id]: { count: data.count, hasLiked: data.hasLiked },
          }));
        }
      } catch (err) {
        console.error(err);
      }
    });
  }, [signals]);

  useEffect(() => {
    if (signals.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const targetId = params.get("id");
      if (targetId) {
        setHighlightedId(targetId);
        // Scroll to the element after a small delay to allow animation
        setTimeout(() => {
          const element = document.getElementById(`signal-${targetId}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 300);
      }
    }
  }, [signals]);

  useEffect(() => {
    fetchSignals();
  }, []);

  useEffect(() => {
    let result = signals;
    if (filter !== "all") {
      result = result.filter((s) => s.status.toLowerCase() === filter);
    }
    if (search) {
      result = result.filter((s) => s.pair.toLowerCase().includes(search.toLowerCase()));
    }

    // Sort to place "Active" signals at the top, and "Closed" signals at the bottom
    const sorted = [...result].sort((a, b) => {
      if (a.status === "Active" && b.status !== "Active") return -1;
      if (a.status !== "Active" && b.status === "Active") return 1;
      return 0;
    });

    setFiltered(sorted);
  }, [signals, filter, search]);

  const fetchSignals = async () => {
    try {
      const res = await fetch("/api/signals?limit=50");
      const data = await res.json();
      setSignals(data.signals || []);
      setFiltered(data.signals || []);
    } catch (error) {
      console.error("Failed to fetch signals:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: signals.length,
    active: signals.filter((s) => s.status === "Active").length,
    wins: signals.filter((s) => s.result === "Win").length,
    totalPips: signals.reduce((acc, s) => acc + (s.pips || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-white tracking-wider">TRADING SIGNALS</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search pair..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 py-2 text-sm w-48"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field py-2 text-sm w-36"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Signals", value: stats.total, icon: Target, color: "text-elite-gold" },
          { label: "Active", value: stats.active, icon: Clock, color: "text-blue-400" },
          { label: "Wins", value: stats.wins, icon: TrendingUp, color: "text-elite-green" },
          { label: "Total Pips", value: stats.totalPips, icon: TrendingUp, color: stats.totalPips >= 0 ? "text-elite-green" : "text-elite-red" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={18} className={stat.color} />
              <span className="font-display text-2xl text-white">{stat.value}</span>
            </div>
            <p className="text-gray-500 text-xs">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Signals List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-elite-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((signal, i) => (
            <motion.div
              key={signal._id}
              id={`signal-${signal._id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-5 border-l-4 transition-all duration-500 ${
                signal.status === "Closed" 
                  ? "opacity-35 grayscale bg-elite-bg/60 border-zinc-800 hover:opacity-85 hover:grayscale-0 transition-all duration-300" 
                  : ""
              } ${
                highlightedId === signal._id
                  ? "border-elite-gold shadow-[0_0_15px_rgba(212,175,55,0.35)] ring-1 ring-elite-gold/30"
                  : "border-elite-border/30"
              }`}
              style={{
                borderLeftColor: signal.status === "Closed" ? "#3f3f46" : (signal.type === "BUY" ? "#00E676" : "#FF1744"),
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    signal.status === "Closed" ? "bg-zinc-900/60" : (signal.type === "BUY" ? "bg-elite-green/10" : "bg-elite-red/10")
                  }`}>
                    {signal.type === "BUY" ? (
                      <TrendingUp size={24} className={signal.status === "Closed" ? "text-zinc-600" : "text-elite-green"} />
                    ) : (
                      <TrendingDown size={24} className={signal.status === "Closed" ? "text-zinc-600" : "text-elite-red"} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-lg text-white">{signal.pair}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                        signal.status === "Closed" 
                          ? "bg-zinc-800/40 text-zinc-500 border border-zinc-700/20" 
                          : (signal.type === "BUY" ? "bg-elite-green/20 text-elite-green" : "bg-elite-red/20 text-elite-red")
                      }`}>
                        {signal.status === "Closed" ? `CLOSED ${signal.type}` : signal.type}
                      </span>
                      <span className="text-xs text-gray-500 bg-elite-surface px-2 py-0.5 rounded">
                        {signal.timeframe}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-400">Entry: <span className="font-mono text-white">{signal.entryPrice}</span></span>
                      <span className="text-gray-400">SL: <span className="font-mono text-elite-red">{signal.stopLoss}</span></span>
                      <span className="text-gray-400">TP: <span className="font-mono text-elite-green">{signal.takeProfit1}</span></span>
                      {signal.takeProfit2 && (
                        <span className="text-gray-400">TP2: <span className="font-mono text-elite-green">{signal.takeProfit2}</span></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    signal.status === "Active"
                      ? "bg-elite-green/10 text-elite-green border border-elite-green/20"
                      : signal.result === "Win"
                      ? "bg-elite-green/10 text-elite-green"
                      : "bg-elite-red/10 text-elite-red"
                  }`}>
                    {signal.status === "Active" ? "Active" : signal.result}
                  </span>
                  {signal.pips !== undefined && (
                    <span className={`font-mono font-semibold ${signal.pips >= 0 ? "text-elite-green" : "text-elite-red"}`}>
                      {signal.pips >= 0 ? "+" : ""}{signal.pips} pips
                    </span>
                  )}
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/dashboard/signals?id=${signal._id}`;
                      navigator.clipboard.writeText(url)
                        .then(() => alert("Signal share link copied to clipboard!"))
                        .catch(() => {});
                    }}
                    className="text-gray-500 hover:text-white transition-colors"
                    title="Copy signal share link"
                  >
                    <LinkIcon size={16} />
                  </button>
                  <button
                    onClick={() => toggleComments(signal._id)}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      expandedComments[signal._id] ? "text-elite-gold font-semibold" : "text-gray-500 hover:text-white"
                    }`}
                    title="Toggle signal comments"
                  >
                    <MessageSquare size={14} />
                    <span>Comments</span>
                  </button>
                  <button
                    onClick={() => toggleLike(signal._id)}
                    className={`flex items-center gap-1 text-xs transition-colors ${
                      likesMap[signal._id]?.hasLiked ? "text-elite-red font-semibold" : "text-gray-500 hover:text-white"
                    }`}
                    title="Like signal"
                  >
                    <Heart size={14} className={likesMap[signal._id]?.hasLiked ? "fill-elite-red text-elite-red" : ""} />
                    <span>{likesMap[signal._id]?.count || 0}</span>
                  </button>
                  <span className="text-gray-500 text-[10px]">{formatDate(signal.createdAt)}</span>
                </div>
              </div>

              {signal.analysis && (
                <div className="mt-4 pt-4 border-t border-elite-border/30">
                  <p className="text-gray-400 text-sm">{signal.analysis}</p>
                </div>
              )}
              {signal.chartImage && (
                <div className="mt-3">
                  <span className="text-[10px] text-gray-500 block mb-2 font-medium">Trade Chart / Analysis Image:</span>
                  <button
                    onClick={() => setLightboxImage(signal.chartImage || null)}
                    className="relative group block overflow-hidden rounded-xl border border-elite-border/50 max-w-sm"
                  >
                    <img src={signal.chartImage} alt="Trade Chart" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="text-white text-xs font-semibold flex items-center gap-1">
                        <Eye size={14} /> View Full Chart
                      </span>
                    </div>
                  </button>
                </div>
              )}

              {/* Comments drawer */}
              <AnimatePresence>
                {expandedComments[signal._id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-4 pt-4 border-t border-elite-border/30 space-y-4 bg-black/10 p-4 rounded-xl"
                  >
                    {/* Add Comment input */}
                    <form onSubmit={(e) => handleCreateComment(e, signal._id)} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a comment about this signal..."
                        required
                        value={newCommentText[signal._id] || ""}
                        onChange={(e) =>
                          setNewCommentText((prev) => ({ ...prev, [signal._id]: e.target.value }))
                        }
                        className="input-field py-2 text-xs"
                      />
                      <button
                        type="submit"
                        disabled={submittingComment[signal._id]}
                        className="btn-primary py-2 px-3 flex items-center justify-center shrink-0"
                      >
                        {submittingComment[signal._id] ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Send size={13} />
                        )}
                      </button>
                    </form>

                    {/* Loader / List */}
                    {loadingComments[signal._id] ? (
                      <div className="flex justify-center py-4">
                        <Loader2 size={16} className="animate-spin text-elite-gold" />
                      </div>
                    ) : (commentsMap[signal._id] || []).length === 0 ? (
                      <p className="text-center text-[10px] text-gray-500 py-3 italic">No comments yet. Be the first to share feedback!</p>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                        {(commentsMap[signal._id] || []).map((c) => (
                          <div key={c.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1.5 relative group">
                            <div className="flex items-center justify-between text-[10px]">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-semibold">{c.user.name}</span>
                                {user?.role === "admin" && (
                                  <button
                                    onClick={() => handleDeleteComment(signal._id, c.id)}
                                    className="text-gray-500 hover:text-elite-red transition-colors duration-150"
                                    title="Delete comment"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                )}
                              </div>
                              <span className="text-gray-500">
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

      {/* Lightbox Modal */}
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
              <img src={lightboxImage} alt="Trade Chart Full" className="w-full h-auto max-h-[80vh] rounded-xl object-contain border border-elite-border" />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/95 text-white rounded-full transition-colors border border-white/10"
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
