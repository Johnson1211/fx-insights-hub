"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Trash2, Loader2, Upload, X, CheckCircle2, AlertCircle } from "lucide-react";

type Toast = { type: "success" | "error"; message: string } | null;

export default function AdminBlog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [error, setError] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [uploadingFile, setUploadingFile] = useState(false);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchBlogs = async () => {
    try {
      setBlogsLoading(true);
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (res.ok && data.posts) {
        setBlogs(data.posts);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      showToast("error", "Failed to load blog posts");
    } finally {
      setBlogsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  // Upload Cover Image via Supabase
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploadingFile(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/supabase", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setCoverImage(data.url);
      showToast("success", "Cover image uploaded successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          coverImage,
          category,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add blog post");

      showToast("success", "Blog post created successfully!");
      // Reset fields
      setTitle("");
      setSlug("");
      setExcerpt("");
      setCoverImage("");
      setContent("");
      setCategory("General");
      setStatus("draft");
      setShowUpload(false);
      fetchBlogs();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this blog post?")) return;

    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete blog post");
      
      showToast("success", "Blog post deleted successfully!");
      fetchBlogs();
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete blog post");
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
        <h1 className="font-display text-3xl text-white tracking-wider">BLOG POST CMS</h1>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="btn-primary flex items-center gap-2"
        >
          {showUpload ? <X size={16} /> : <Plus size={16} />}
          {showUpload ? "Cancel" : "Create Post"}
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
            <FileText size={18} className="text-elite-gold" /> WRITE BLOG POST
          </h2>
          <form onSubmit={handleUploadSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Title</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Gold (XAU/USD) Technical Breakout"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Category</label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Forex">Forex</option>
                <option value="Indices">Indices</option>
                <option value="Crypto">Crypto</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">URL Slug</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. gold-technical-breakout"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Upload Cover Image</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingFile}
                  className="input-field cursor-pointer file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-elite-gold/10 file:text-elite-gold hover:file:bg-elite-gold/20"
                />
                {uploadingFile && <Loader2 size={16} className="animate-spin text-elite-gold" />}
              </div>
              {coverImage && (
                <div className="mt-3 relative w-32 h-20 rounded-lg overflow-hidden border border-white/15">
                  <img src={coverImage} alt="Cover image preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full hover:bg-black text-white"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Short Excerpt (Summary)</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Enter a brief summary snippet of this post..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Blog Content (Markdown supported)</label>
              <textarea
                rows={8}
                required
                className="input-field resize-none text-sm leading-relaxed"
                placeholder="Write your article here. Supports heading markup using '##' and '###' and list markup using '-'..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Publish Status</label>
              <select
                className="input-field"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
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
                    Publish Post
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Blogs List */}
      <div className="glass-card overflow-hidden">
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
              {blogsLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    <Loader2 size={24} className="animate-spin text-elite-gold mx-auto mb-2" />
                    Loading blog posts...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    No blog posts published yet.
                  </td>
                </tr>
              ) : (
                blogs.map((post) => (
                  <tr key={post.id} className="border-b border-elite-border/30 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-white text-sm font-medium">{post.title}</td>
                    <td className="p-4 text-gray-400 text-sm capitalize">{post.category}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded capitalize ${post.status === "published" ? "bg-elite-green/10 text-elite-green" : "bg-gray-500/10 text-gray-400"}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteBlog(post.id)}
                        title="Delete blog post"
                        className="text-gray-500 hover:text-elite-red transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
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
