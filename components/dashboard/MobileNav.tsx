"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Signal,
  Play,
  Video,
  User,
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

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111116] border-t border-gray-200 dark:border-[#FF4053]/15 z-40 transition-colors duration-300">
      <div className="flex justify-around items-center h-16">
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors ${
                isActive
                  ? "text-[#FF4053]"
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
  );
}
