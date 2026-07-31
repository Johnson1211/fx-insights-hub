"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  LayoutDashboard, Signal, Play, Copy, Video, GraduationCap,
  MessageSquare, User, LogOut, ChevronRight,
  Bell, X, CheckCheck, Sun, Moon, Crown,
} from "lucide-react";

interface UserNotif {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/signals", label: "Signals", icon: Signal },
  { href: "/dashboard/live", label: "Live Trading", icon: Play },
  { href: "/dashboard/copy", label: "Copy Trading", icon: Copy },
  { href: "/dashboard/courses", label: "Courses", icon: Video },
  { href: "/dashboard/training", label: "Training", icon: GraduationCap },
  { href: "/dashboard/community", label: "Community", icon: MessageSquare },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

function typeDot(type: string) {
  switch (type) {
    case "success": return "bg-[#00E676]";
    case "alert":   return "bg-[#1D4ED8]";
    case "warning": return "bg-yellow-400";
    default:        return "bg-blue-400";
  }
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState<UserNotif[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = async () => {
    try {
      const res = await fetch("/api/user/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {}
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleBellOpen = async () => {
    setBellOpen((o) => !o);
    if (!bellOpen && unreadCount > 0) {
      await fetch("/api/user/notifications", { method: "PATCH" });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const handleNotifClick = (notif: UserNotif) => {
    setBellOpen(false);
    if (notif.link) router.push(notif.link);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-[#111116] border-r border-gray-200 dark:border-white/10 flex-col z-30 transition-colors duration-300">
      {/* User Card */}
      <div className="p-5 border-b border-gray-200 dark:border-white/5">
        {/* Avatar + Name row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-2 border-blue-600/30 flex items-center justify-center shrink-0">
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              : <span className="text-blue-600 font-bold text-sm">{user?.name?.charAt(0) || "U"}</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-900 dark:text-white font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-slate-500 dark:text-gray-400 text-xs truncate">{user?.email}</p>
          </div>

          {/* Notification Bell */}
          <div className="relative shrink-0" ref={bellRef}>
            <button
              onClick={handleBellOpen}
              className="relative p-2 rounded-lg text-slate-500 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-600/10 transition-all"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {bellOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-10 w-80 max-h-96 overflow-y-auto bg-white dark:bg-[#111116] border border-gray-200 dark:border-blue-600/15 rounded-2xl shadow-2xl z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <Bell size={14} className="text-blue-600" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">My Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <button onClick={() => setBellOpen(false)} className="text-slate-400 dark:text-gray-500 hover:text-blue-600 transition-colors">
                      <X size={14} />
                    </button>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <Bell size={24} className="mx-auto mb-2 text-slate-300 dark:text-gray-600" />
                      <p className="text-slate-500 dark:text-gray-500 text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleNotifClick(n)}
                          className={`w-full text-left px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${!n.isRead ? "bg-blue-600/[0.03]" : ""}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? typeDot(n.type) : "bg-gray-300 dark:bg-gray-600"}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold mb-0.5 ${!n.isRead ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-gray-400"}`}>
                                {n.title}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-gray-500 leading-relaxed line-clamp-2">{n.message}</p>
                              <p className="text-[10px] text-slate-400 dark:text-gray-600 mt-1">{timeAgo(n.createdAt)}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {notifications.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-gray-100 dark:border-white/5">
                      <button
                        onClick={async () => {
                          await fetch("/api/user/notifications", { method: "PATCH" });
                          setUnreadCount(0);
                          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                        }}
                        className="text-[11px] text-slate-400 dark:text-gray-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCheck size={12} /> Mark all as read
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Plan badge + Admin Panel link */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Crown size={12} className="text-blue-600" />
            <span className="text-xs text-blue-600 font-semibold capitalize">{user?.plan?.replace("_", " ")} Plan</span>
          </div>

          {user?.role && ["admin", "superadmin"].includes(user.role) && (
            <span className="text-[10px] bg-blue-600/15 text-blue-600 border border-blue-600/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {user.role}
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {/* Admin/Superadmin Panel Shortcut Link */}
        {user?.role && ["admin", "superadmin"].includes(user.role) && (
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-blue-900 transition-all mb-2"
          >
            <Crown size={17} className="shrink-0 text-white" />
            <span className="flex-1 truncate">
              {user.role === "superadmin" ? "Superadmin Panel" : "Admin Panel"}
            </span>
            <ChevronRight size={13} className="shrink-0 text-white" />
          </Link>
        )}

        {menuItems.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600/10 text-blue-600 border border-blue-600/20 font-semibold"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent"
              }`}
            >
              <item.icon size={17} className={`shrink-0 ${isActive ? "text-blue-600" : "text-slate-400 dark:text-gray-500 group-hover:text-slate-600 dark:group-hover:text-gray-300"}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {isActive && <ChevronRight size={13} className="text-blue-600 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Theme toggle + Logout */}
      <div className="p-3 border-t border-gray-200 dark:border-white/5 space-y-1">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all w-full"
        >
          {theme === "dark"
            ? <Sun size={17} className="text-amber-400" />
            : <Moon size={17} className="text-slate-400" />
          }
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
