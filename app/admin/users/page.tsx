"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Crown, Mail, Calendar, Pencil, Trash2, X, Save,
  Phone, User, ShieldAlert, CheckCircle2, AlertCircle, Loader2,
  Eye,
} from "lucide-react";

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  plan: string;
  role: string;
  createdAt: string;
  isVerified: boolean;
  derivId?: string;
  derivStatus?: "unsubmitted" | "pending" | "approved" | "rejected";
  brokerApproved?: boolean;
}

type EditFormState = {
  name: string;
  email: string;
  phone: string;
  plan: string;
  role: string;
  derivId: string;
  derivStatus: string;
  brokerApproved: boolean;
  isVerified: boolean;
  password?: string;
};

type Toast = { type: "success" | "error"; message: string } | null;

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [toast, setToast] = useState<Toast>(null);
  const [viewAll, setViewAll] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  // Edit modal state
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    name: "",
    email: "",
    phone: "",
    plan: "free",
    role: "guest",
    derivId: "",
    derivStatus: "unsubmitted",
    brokerApproved: false,
    isVerified: false,
    password: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [viewAll]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = viewAll ? "/api/admin/users?limit=all" : "/api/admin/users?limit=20";
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data.users || []);
      setTotalUsers(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      showToast("error", "Failed to fetch users list");
    } finally {
      setLoading(false);
    }
  };

  const handleDerivAction = async (userId: string, approve: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          brokerApproved: approve,
          derivStatus: approve ? "approved" : "rejected",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }
      showToast("success", `Deriv ID ${approve ? "approved" : "rejected"} successfully`);
      fetchUsers();
    } catch (error: any) {
      showToast("error", error.message || "Failed to update user status");
    }
  };

  const openEdit = (user: UserData) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      plan: user.plan || "free",
      role: user.role || "guest",
      derivId: user.derivId || "",
      derivStatus: user.derivStatus || "unsubmitted",
      brokerApproved: !!user.brokerApproved,
      isVerified: !!user.isVerified,
      password: "",
    });
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    try {
      const payload: any = {
        userId: editingUser._id,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone || null,
        plan: editForm.plan,
        role: editForm.role,
        derivId: editForm.derivId || null,
        derivStatus: editForm.derivStatus,
        brokerApproved: editForm.brokerApproved,
        isVerified: editForm.isVerified,
      };

      if (editForm.password) {
        payload.password = editForm.password;
      }

      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");

      showToast("success", "User settings updated successfully!");
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      showToast("error", err.message || "Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (user: UserData) => {
    if (!confirm(`Are you absolutely sure you want to permanently delete user "${user.name}" (${user.email})?`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${user._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      showToast("success", `User "${user.name}" deleted successfully`);
      fetchUsers();
    } catch (error: any) {
      showToast("error", error.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                          user.email.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = planFilter === "all" || user.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-slate-900 dark:text-slate-900 dark:text-white tracking-wider">USER MANAGEMENT</h1>
          <p className="text-slate-500 dark:text-gray-400 text-xs mt-1">
            {loading ? "Updating user list..." : `Showing ${filteredUsers.length} of ${totalUsers} user${totalUsers === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 py-2 text-sm w-64"
            />
          </div>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="input-field py-2 text-sm w-36"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
            <option value="copy_trader">Copy Trader</option>
            <option value="training">Training</option>
          </select>
          <button
            onClick={() => setViewAll(!viewAll)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
              viewAll
                ? "bg-elite-gold/20 border-elite-gold text-elite-gold hover:bg-elite-gold/30"
                : "bg-slate-50 dark:bg-white/[0.02] border-white/10 text-slate-900 dark:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Eye size={16} />
            {viewAll ? "Show Limited" : "View All"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-elite-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10">
                  <th className="text-left p-4 text-slate-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">User</th>
                  <th className="text-left p-4 text-slate-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">Plan</th>
                  <th className="text-left p-4 text-slate-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">Role</th>
                  <th className="text-left p-4 text-slate-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">Deriv Account</th>
                  <th className="text-left p-4 text-slate-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">Joined</th>
                  <th className="text-left p-4 text-slate-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">Verified</th>
                  <th className="text-left p-4 text-slate-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-200 dark:border-white/10 hover:bg-slate-50 dark:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-elite-gold/20 to-blue-600/20 border border-elite-gold/20 flex items-center justify-center shrink-0">
                          <span className="text-elite-gold text-xs font-bold">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-slate-900 dark:text-slate-900 dark:text-white text-sm font-medium">{user.name}</p>
                          <p className="text-slate-500 dark:text-gray-400 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium capitalize ${
                        user.plan === "premium" || user.plan === "copy_trader"
                          ? "bg-elite-gold/10 text-elite-gold border border-elite-gold/20"
                          : user.plan === "training"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : "bg-gray-500/10 text-slate-500 dark:text-gray-400 border border-gray-500/20"
                      }`}>
                        <Crown size={10} />
                        {user.plan.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded capitalize font-medium ${
                        user.role === "admin"
                          ? "bg-elite-red/10 text-elite-red border border-elite-red/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {user.derivId ? (
                        <div className="space-y-1">
                          <span className="text-slate-900 dark:text-slate-900 dark:text-white text-sm font-mono font-medium block">{user.derivId}</span>
                          <div className="flex gap-2">
                            {user.derivStatus === "pending" && (
                              <>
                                <button
                                  onClick={() => handleDerivAction(user._id, true)}
                                  className="text-elite-green hover:underline text-xs font-semibold"
                                >
                                  Approve
                                </button>
                                <span className="text-gray-600 text-xs">|</span>
                                <button
                                  onClick={() => handleDerivAction(user._id, false)}
                                  className="text-elite-red hover:underline text-xs font-semibold"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {user.derivStatus === "approved" && (
                              <span className="text-elite-green text-[10px] font-bold px-1.5 py-0.5 rounded bg-elite-green/10 border border-elite-green/20">Approved</span>
                            )}
                            {user.derivStatus === "rejected" && (
                              <span className="text-elite-red text-[10px] font-bold px-1.5 py-0.5 rounded bg-elite-red/10 border border-elite-red/20">Rejected</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-600 text-xs italic">Unsubmitted</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500 dark:text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`w-2.5 h-2.5 rounded-full inline-block ${user.isVerified ? "bg-elite-green" : "bg-gray-500"}`} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(user)}
                          className="p-1.5 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white transition-colors"
                          title="Edit user details & permissions"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 text-slate-500 dark:text-gray-400 hover:text-elite-red transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setEditingUser(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Crown size={18} className="text-elite-red" />
                  <h2 className="font-display text-xl text-slate-900 dark:text-slate-900 dark:text-white tracking-wider">
                    EDIT USER SETTINGS
                  </h2>
                </div>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase mb-2">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400" />
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="input-field pl-10"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400" />
                      <input
                        type="email"
                        required
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="input-field pl-10"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400" />
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="input-field pl-10"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  {/* Plan Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase mb-2">Membership Plan</label>
                    <select
                      value={editForm.plan}
                      onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                      className="input-field"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                      <option value="copy_trader">Copy Trader</option>
                      <option value="training">Training</option>
                    </select>
                  </div>

                  {/* Role Selection (Make more admins) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase mb-2">User System Role</label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="input-field"
                    >
                      <option value="guest">Guest</option>
                      <option value="member">Member</option>
                      <option value="trader">Trader</option>
                      <option value="admin">Admin (System Owner)</option>
                    </select>
                  </div>

                  {/* Deriv Status */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase mb-2">Deriv Verification Status</label>
                    <select
                      value={editForm.derivStatus}
                      onChange={(e) => setEditForm({ ...editForm, derivStatus: e.target.value })}
                      className="input-field"
                    >
                      <option value="unsubmitted">Unsubmitted</option>
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Deriv ID Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase mb-2">Deriv User ID</label>
                    <input
                      type="text"
                      value={editForm.derivId}
                      onChange={(e) => setEditForm({ ...editForm, derivId: e.target.value })}
                      className="input-field"
                      placeholder="e.g. CR123456"
                    />
                  </div>

                  {/* Reset Password Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase mb-2">Reset Password</label>
                    <input
                      type="password"
                      value={editForm.password || ""}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      className="input-field"
                      placeholder="New password (leave blank to keep current)"
                    />
                  </div>
                </div>

                {/* Checkboxes Row */}
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  {/* Email Verified Checkbox */}
                  <div className="flex items-center gap-3 p-4 bg-slate-100 dark:bg-[#16161D] rounded-xl border border-elite-border">
                    <input
                      type="checkbox"
                      id="isVerified"
                      checked={editForm.isVerified}
                      onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
                      className="w-4 h-4 text-elite-red bg-slate-100 dark:bg-[#16161D] border-elite-border rounded focus:ring-elite-red/30 focus:ring-1"
                    />
                    <label htmlFor="isVerified" className="text-xs text-slate-900 dark:text-white cursor-pointer select-none">
                      <strong>Email Account Verified:</strong> Manually verify user&apos;s email address bypassing email confirmation steps.
                    </label>
                  </div>

                  {/* Broker Approved Checkbox */}
                  <div className="flex items-center gap-3 p-4 bg-slate-100 dark:bg-[#16161D] rounded-xl border border-elite-border">
                    <input
                      type="checkbox"
                      id="brokerApproved"
                      checked={editForm.brokerApproved}
                      onChange={(e) => setEditForm({ ...editForm, brokerApproved: e.target.checked })}
                      className="w-4 h-4 text-elite-red bg-slate-100 dark:bg-[#16161D] border-elite-border rounded focus:ring-elite-red/30 focus:ring-1"
                    />
                    <label htmlFor="brokerApproved" className="text-xs text-slate-900 dark:text-white cursor-pointer select-none">
                      <strong>Broker Verification Approved:</strong> Gives user direct access to lockable course lessons and video materials.
                    </label>
                  </div>
                </div>

                {/* Info Note on self-edit protection */}
                {editingUser.role === "admin" && (
                  <div className="flex gap-2 p-3.5 bg-elite-red/10 border border-elite-red/25 rounded-xl text-xs text-elite-red leading-relaxed">
                    <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                    <span>
                      <strong>Warning:</strong> You are modifying an Administrator account. Take extra care when changing roles or removing access keys, as they will modify system administration capabilities immediately.
                    </span>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-elite-border/40">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="btn-outline flex items-center gap-2 px-5 py-2.5 text-xs font-semibold"
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex items-center gap-2 px-5 py-2.5 text-xs font-semibold"
                    style={{ backgroundImage: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)" }}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
