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
  { href: "/dashboard/videos", label: "Videos", icon: Video },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-elite-card/95 backdrop-blur-xl border-t border-elite-border/50 z-40">
      <div className="flex justify-around items-center h-16">
        {mobileItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-4 ${
                isActive ? "text-elite-gold" : "text-gray-500"
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
