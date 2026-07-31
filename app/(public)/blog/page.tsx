"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, BookOpen, Clock, Calendar, ArrowRight, User, Loader2 } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  author: {
    name: string;
    avatar?: string;
  };
}

export default function BlogFeedPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filtered, setFiltered] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "Forex", "Indices", "Crypto", "General"];

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
          setFiltered(data.posts || []);
        }
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    let result = posts;
    if (activeCategory !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    if (search) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [posts, activeCategory, search]);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-[#08080A] transition-colors duration-300">
      <div className="section-padding">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="text-[#1D4ED8] text-sm font-semibold tracking-widest uppercase">
              Market Analysis &amp; News
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-slate-900 dark:text-white mt-3 tracking-wider font-bold">
              TRADING <span className="text-[#1D4ED8]">INSIGHTS</span>
            </h1>
            <p className="text-slate-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              Stay ahead of the markets with premium technical updates, currency breakdowns, and psychological execution guides from Peleboss.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter Controls */}
        <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 order-2 md:order-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                  activeCategory === cat
                    ? "bg-[#1D4ED8]/15 text-[#1D4ED8] border-[#1D4ED8]/30 shadow-md shadow-[#1D4ED8]/5"
                    : "bg-slate-100 dark:bg-white/[0.02] text-slate-600 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:text-[#1D4ED8] hover:bg-[#1D4ED8]/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80 order-1 md:order-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search insights..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 py-2.5 text-sm w-full"
            />
          </div>
        </div>

        {/* Blog Post List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#1D4ED8]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#111116] border border-gray-200 dark:border-white/10 rounded-2xl max-w-2xl mx-auto shadow-sm">
            <BookOpen size={40} className="text-slate-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-slate-900 dark:text-white text-lg font-semibold">No insights found</h3>
            <p className="text-slate-500 dark:text-gray-500 text-xs mt-1">Try broadening your search query or choosing another category tab.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {filtered.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group flex flex-col justify-between bg-white dark:bg-[#111116] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-[#1D4ED8]/30 shadow-sm transition-all duration-300 relative"
              >
                {/* Glow behind card */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#1D4ED8]/5 blur-3xl pointer-events-none group-hover:bg-[#1D4ED8]/10 transition-colors" />

                <div>
                  {/* Cover Image */}
                  <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-[#16161D] border-b border-gray-200 dark:border-white/10">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 dark:from-[#16161D] to-slate-200 dark:to-[#111116]">
                        <BookOpen size={36} className="text-[#1D4ED8]/30" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 dark:bg-[#08080A]/85 border border-[#1D4ED8]/20 text-[#1D4ED8] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-[10px] text-slate-500 dark:text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(post.publishedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="font-display text-xl text-slate-900 dark:text-white tracking-wide group-hover:text-[#1D4ED8] transition-colors line-clamp-2 leading-snug font-bold">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 dark:text-gray-400 text-xs mt-3 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-gray-100 dark:border-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 flex items-center justify-center">
                      <User size={12} className="text-[#1D4ED8]" />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">
                      {post.author.name}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs text-[#1D4ED8] hover:text-[#e03545] font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    Read Post <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
