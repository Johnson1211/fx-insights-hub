"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Signal, Play, Copy, Video, GraduationCap,
  MessageSquare, User, Settings, Crown, LogOut, ChevronRight,
  Bell, X, CheckCheck,
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

function typeColor(type: string) {
  switch (type) {
    case "success": return "text-elite-green border-elite-green/20 bg-elite-green/5";
    case "alert":   return "text-elite-red border-elite-red/20 bg-elite-red/5";
    case "warning": return "text-yellow-400 border-yellow-400/20 bg-yellow-400/5";
    default:        return "text-blue-400 border-blue-400/20 bg-blue-400/5";
  }
}

function typeDot(type: string) {
  switch (type) {
    case "success": return "bg-elite-green";
    case "alert":   return "bg-elite-red";
    case "warning": return "bg-yellow-400";
    default:        return "bg-blue-400";
  }
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState<UserNotif[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Fetch personal notifications
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
    const interval = setInterval(fetchNotifs, 20000); // poll every 20s
    return () => clearInterval(interval);
  }, []);

  // Close bell dropdown on outside click
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
      // Mark all as read
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
    <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 bg-elite-card/95 backdrop-blur-xl border-r border-elite-border/50 flex-col z-30">
      {/* User Card */}
      <div className="p-6 border-b border-elite-border/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-elite-gold/30 to-blue-600/30 border border-elite-gold/30 flex items-center justify-center shrink-0">
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              : <span className="text-elite-gold font-bold text-sm">{user?.name?.charAt(0) || "U"}</span>
            }
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-white font-medium text-sm truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={handleBellOpen}
              className="relative p-1.5 text-gray-400 hover:text-white transition-colors"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-elite-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {bellOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-9 w-80 max-h-96 overflow-y-auto bg-elite-card border border-elite-border rounded-2xl shadow-2xl z-50"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-elite-border/50">
                    <div className="flex items-center gap-2">
                      <Bell size={14} className="text-elite-gold" />
                      <span className="text-sm font-semibold text-white">My Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-elite-red text-white px-1.5 py-0.5 rounded-full font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <button onClick={() => setBellOpen(false)} className="text-gray-500 hover:text-white">
                      <X size={14} />
                    </button>
                  </div>

                  {/* Notification list */}
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center text-gray-500 text-sm">
                      <Bell size={24} className="mx-auto mb-2 opacity-30" />
                      No notifications yet
                    </div>
                  ) : (
                    <div className="divide-y divide-elite-border/30">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleNotifClick(n)}
                          className={`w-full text-left px-4 py-3.5 hover:bg-white/5 transition-colors ${!n.isRead ? "bg-white/[0.02]" : ""}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? typeDot(n.type) : "bg-gray-600"}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold mb-0.5 ${!n.isRead ? "text-white" : "text-gray-300"}`}>
                                {n.title}
                              </p>
                              <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{n.message}</p>
                              <p className="text-[10px] text-gray-600 mt-1">{timeAgo(n.createdAt)}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-elite-border/50">
                      <button
                        onClick={async () => {
                          await fetch("/api/user/notifications", { method: "PATCH" });
                          setUnreadCount(0);
                          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                        }}
                        className="text-[11px] text-gray-500 hover:text-elite-gold flex items-center gap-1.5 transition-colors"
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

        <div className="flex items-center gap-2">
          <Crown size={12} className="text-elite-gold" />
          <span className="text-xs text-elite-gold capitalize">{user?.plan} Plan</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-elite-gold/10 text-elite-gold border border-elite-gold/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={18} className={isActive ? "text-elite-gold" : "text-gray-500 group-hover:text-gray-300"} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="text-elite-gold" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-elite-border/50">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-elite-red hover:bg-elite-red/10 transition-all w-full"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
