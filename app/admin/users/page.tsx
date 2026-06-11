"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Crown, Mail, Calendar, ChevronDown } from "lucide-react";

interface UserData {
  _id: string;
  name: string;
  email: string;
  plan: string;
  role: string;
  createdAt: string;
  isVerified: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-white tracking-wider">USER MANAGEMENT</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
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
                <tr className="border-b border-elite-border/50">
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">User</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Plan</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Role</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Joined</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-elite-border/30 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-elite-gold/20 to-blue-600/20 border border-elite-gold/20 flex items-center justify-center">
                          <span className="text-elite-gold text-xs font-bold">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{user.name}</p>
                          <p className="text-gray-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        user.plan === "premium" || user.plan === "copy_trader"
                          ? "bg-elite-gold/10 text-elite-gold"
                          : user.plan === "training"
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-gray-500/10 text-gray-400"
                      }`}>
                        <Crown size={10} />
                        {user.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        user.role === "admin"
                          ? "bg-elite-red/10 text-elite-red"
                          : "bg-blue-500/10 text-blue-400"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`w-2 h-2 rounded-full inline-block ${user.isVerified ? "bg-elite-green" : "bg-gray-500"}`} />
                    </td>
                    <td className="p-4">
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <ChevronDown size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
