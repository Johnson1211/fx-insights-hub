"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  LayoutDashboard,
  Users,
  Signal,
  Video,
  FileText,
  Settings,
  Crown,
  ChevronRight,
  Bell,
  Calendar,
  Sun,
  Moon,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

const adminItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/signals", label: "Signals", icon: Signal },
  { href: "/admin/content", label: "Content", icon: Video },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/bookings", label: "Training", icon: Calendar },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-[#111116] border-r border-gray-200 dark:border-[#FF4053]/15 flex-col z-30 transition-colors duration-300">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4053] to-[#E62E43] flex items-center justify-center shadow-lg shadow-[#FF4053]/20">
            <Crown size={18} className="text-white" />
          </div>
          <div>
            <p className="text-slate-900 dark:text-white font-semibold text-sm">
              {user?.role === "superadmin" ? "Superadmin Panel" : "Admin Panel"}
            </p>
            <p className="text-slate-500 dark:text-gray-400 text-xs">
              {user?.role === "superadmin" ? "System Owner" : "Assistant Admin"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {adminItems.map((item) => {
          const isActive = item.href === "/admin" 
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[#FF4053]/10 text-[#FF4053] border border-[#FF4053]/20 font-semibold"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent"
              }`}
            >
              <item.icon size={17} className={`shrink-0 ${isActive ? "text-[#FF4053]" : "text-slate-400 dark:text-gray-500 group-hover:text-slate-600 dark:group-hover:text-gray-300"}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {isActive && <ChevronRight size={13} className="text-[#FF4053] shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Theme toggle */}
      <div className="p-3 border-t border-gray-200 dark:border-white/5">
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
      </div>
    </aside>
  );
}
