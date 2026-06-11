"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Signal,
  Video,
  FileText,
  Settings,
  Crown,
  ChevronRight,
} from "lucide-react";

const adminItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/signals", label: "Signals", icon: Signal },
  { href: "/admin/content", label: "Content", icon: Video },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 bg-elite-card/95 backdrop-blur-xl border-r border-elite-border/50 flex-col z-30">
      <div className="p-6 border-b border-elite-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-elite-red to-red-700 flex items-center justify-center">
            <Crown size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Admin Panel</p>
            <p className="text-gray-500 text-xs">Fx Insights Hub CMS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {adminItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-elite-red/10 text-elite-red border border-elite-red/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
