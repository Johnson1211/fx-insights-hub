"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, ArrowUpRight, BookOpen, Loader2 } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { motion } from "framer-motion";

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  author: {
    name: string;
    avatar?: string;
  };
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function fetchPost() {
      try {
        const res = await fetch(`/api/blog?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
        } else {
          router.push("/blog");
        }
      } catch (err) {
        console.error("Failed to load blog post:", err);
        router.push("/blog");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug, router]);

  // Format Content body supporting simple markdown structures
  const renderFormattedContent = (text: string) => {
    if (!text) return null;
    
    // Split into paragraphs by double newlines
    const paragraphs = text.split(/\n\s*\n/);
    
    return paragraphs.map((para, idx) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      // Check if it is a heading: e.g. starts with "#", "##", "###"
      if (trimmed.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-display text-lg sm:text-xl text-white font-bold mt-6 mb-3 tracking-wide">
            {trimmed.replace("### ", "")}
          </h4>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3 key={idx} className="font-display text-xl sm:text-2xl text-elite-gold font-bold mt-8 mb-4 tracking-wider">
            {trimmed.replace("## ", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("# ")) {
        return (
          <h2 key={idx} className="font-display text-2xl sm:text-3xl text-white font-bold mt-10 mb-4 tracking-wider">
            {trimmed.replace("# ", "")}
          </h2>
        );
      }

      // Check if it is a blockquote: starts with ">"
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote key={idx} className="border-l-4 border-elite-gold bg-elite-surface/40 p-4 rounded-r-xl my-6 text-gray-300 italic text-sm leading-relaxed">
            {trimmed.replace(/^>\s*/, "")}
          </blockquote>
        );
      }

      // Check if it is a bullet list: starts with "-" or "*"
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split(/\n[-*]\s+/);
        return (
          <ul key={idx} className="list-disc pl-5 my-4 space-y-2 text-sm text-gray-400 leading-relaxed">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^[-*]\s+/, "")}</li>
            ))}
          </ul>
        );
      }

      // Default paragraph (support inline bold **text**)
      return (
        <p key={idx} className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
          {trimmed.split(/\*\*([^*]+)\*\*/g).map((part, i) => 
            i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
          )}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-elite-bg">
        <Loader2 size={32} className="animate-spin text-elite-gold" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <article className="min-h-screen pt-24 pb-20">
      <div className="section-padding max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-elite-gold transition-colors mb-8 uppercase tracking-wider font-semibold"
        >
          <ArrowLeft size={14} /> Back to insights
        </Link>

        {/* Post Header */}
        <ScrollReveal>
          <div className="space-y-4 mb-8">
            <span className="bg-elite-gold/15 border border-elite-gold/20 text-elite-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {post.category}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl text-white tracking-wide leading-tight">
              {post.title}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed italic border-l-2 border-elite-border/30 pl-4 py-1">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-gray-500 border-t border-elite-border/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center">
                  <User size={14} className="text-elite-gold" />
                </div>
                <span className="text-white font-medium">{post.author.name}</span>
              </div>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {new Date(post.publishedAt).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {Math.max(2, Math.ceil(post.content.split(/\s+/).length / 200))} min read
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Featured Image */}
        {post.coverImage && (
          <ScrollReveal delay={0.1}>
            <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden border border-elite-border/40 mb-10 shadow-2xl relative">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-elite-bg/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </ScrollReveal>
        )}

        {/* Post Content */}
        <ScrollReveal delay={0.2}>
          <div className="glass-card p-6 sm:p-10 md:p-12 relative overflow-hidden">
            {/* Glow accent */}
            <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-elite-gold/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-48 -right-48 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 prose prose-invert max-w-none">
              {renderFormattedContent(post.content)}
            </div>
          </div>
        </ScrollReveal>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-8 rounded-2xl border border-elite-gold/10 bg-gradient-to-r from-elite-gold/5 to-transparent text-center relative overflow-hidden"
        >
          <div className="absolute top-[-24px] right-[-24px] w-24 h-24 rounded-full bg-elite-gold/10 blur-2xl pointer-events-none" />
          <h4 className="font-display text-lg text-white font-bold tracking-wide">
            Want signals based on this analysis?
          </h4>
          <p className="text-gray-400 text-xs mt-2 max-w-md mx-auto leading-relaxed">
            Gain instant access to real-time premium alerts, community discussions, and daily setups.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              href="/dashboard/signals"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-elite-gold to-amber-700 text-elite-bg font-bold text-xs hover:shadow-lg hover:shadow-amber-500/25 transition-all flex items-center gap-1"
            >
              Access Member Dashboard <ArrowUpRight size={13} />
            </Link>
          </div>
        </motion.div>
      </div>
    </article>
  );
}
