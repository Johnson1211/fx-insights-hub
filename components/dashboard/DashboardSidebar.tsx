"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Signal,
  Play,
  Copy,
  Video,
  GraduationCap,
  MessageSquare,
  User,
  Settings,
  Crown,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/signals", label: "Signals", icon: Signal },
  { href: "/dashboard/live", label: "Live Trading", icon: Play },
  { href: "/dashboard/copy", label: "Copy Trading", icon: Copy },
  { href: "/dashboard/videos", label: "Video Library", icon: Video },
  { href: "/dashboard/training", label: "Training", icon: GraduationCap },
  { href: "/dashboard/community", label: "Community", icon: MessageSquare },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 bg-elite-card/95 backdrop-blur-xl border-r border-elite-border/50 flex-col z-30">
      {/* User Card */}
      <div className="p-6 border-b border-elite-border/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-elite-gold/30 to-amber-600/30 border border-elite-gold/30 flex items-center justify-center">
            <span className="text-elite-gold font-bold text-sm">{user?.name?.charAt(0) || "U"}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-white font-medium text-sm truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
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
