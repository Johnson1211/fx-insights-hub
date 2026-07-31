"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  LayoutDashboard,
  Signal,
  Play,
  Video,
  User,
  LogOut,
  Sun,
  Moon,
  Crown,
} from "lucide-react";

const mobileItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/signals", label: "Signals", icon: Signal },
  { href: "/dashboard/live", label: "Live", icon: Play },
  { href: "/dashboard/courses", label: "Courses", icon: Video },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-[#111116] border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 z-40 transition-colors duration-300">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-xs shadow-md">
            FX
          </div>
          <span className="font-display text-sm tracking-wider text-slate-900 dark:text-white font-bold">
            FX INSIGHTS
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Admin / Superadmin Panel Link */}
          {user?.role && ["admin", "superadmin"].includes(user.role) && (
            <Link
              href="/admin"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/10 text-blue-600 border border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all"
              title="Admin Panel"
            >
              <Crown size={14} />
              <span className="hidden xs:inline">Admin</span>
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-500" />}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
            title="Logout"
          >
            <LogOut size={14} />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111116] border-t border-gray-200 dark:border-white/10 z-40 transition-colors duration-300">
        <div className="flex justify-around items-center h-16">
          {mobileItems.map((item) => {
            const isActive = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors ${
                  isActive
                    ? "text-blue-600 font-bold"
                    : "text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300"
                }`}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
