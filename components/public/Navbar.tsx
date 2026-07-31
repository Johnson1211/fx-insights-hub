"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, Bell, User, ChevronDown, Crown, LogOut, LayoutDashboard, Megaphone, Pin, Info, AlertTriangle, CheckCircle2, ExternalLink, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/signals", label: "Signals" },
  { href: "/courses", label: "Courses" },
  { href: "/contact", label: "Contact" },
];

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isPinned: boolean;
  createdAt: string;
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  // Notification States
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [pinnedNotif, setPinnedNotif] = useState<NotificationItem | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Notifications
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          
          if (data.pinned) {
            setPinnedNotif(data.pinned);
            const dismissedId = localStorage.getItem("dismissed_announcement_id");
            if (dismissedId !== data.pinned.id) {
              setShowBanner(true);
            }
          } else {
            setPinnedNotif(null);
            setShowBanner(false);
          }
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // Poll every 5 seconds for real-time announcements

    // Load read notification IDs
    const storedRead = localStorage.getItem("read_notification_ids");
    if (storedRead) {
      setReadIds(JSON.parse(storedRead));
    }

    return () => clearInterval(interval);
  }, []);

  const handleDismissBanner = () => {
    if (pinnedNotif) {
      localStorage.setItem("dismissed_announcement_id", pinnedNotif.id);
    }
    setShowBanner(false);
  };

  const handleToggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) {
      setMobileOpen(false);
      setProfileOpen(false);
    }
    if (!notificationsOpen && notifications.length > 0) {
      // Mark all current notifications as read
      const currentIds = notifications.map((n) => n.id);
      const newReadIds = Array.from(new Set([...readIds, ...currentIds]));
      setReadIds(newReadIds);
      localStorage.setItem("read_notification_ids", JSON.stringify(newReadIds));
    }
  };

  const handleToggleMobileMenu = () => {
    const nextState = !mobileOpen;
    setMobileOpen(nextState);
    if (nextState) {
      setNotificationsOpen(false);
      setProfileOpen(false);
    }
  };

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle size={14} className="text-amber-400 mt-0.5" />;
      case "success":
        return <CheckCircle2 size={14} className="text-elite-green mt-0.5" />;
      case "alert":
        return <Megaphone size={14} className="text-elite-red mt-0.5" />;
      default:
        return <Info size={14} className="text-blue-400 mt-0.5" />;
    }
  };

  const getBannerColor = (type: string) => {
    switch (type) {
      case "warning":
        return "from-amber-600/90 to-amber-800/90 border-amber-500/25";
      case "success":
        return "from-emerald-600/90 to-emerald-800/90 border-emerald-500/25";
      case "alert":
        return "from-elite-red/90 to-red-900/90 border-elite-red/25";
      default:
        return "from-elite-gold/90 to-amber-900/90 border-elite-gold/25";
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Pinned Top Announcement Banner */}
      <AnimatePresence>
        {showBanner && pinnedNotif && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className={`fixed top-0 left-0 right-0 z-50 py-2 px-6 border-b text-center text-xs font-semibold flex items-center justify-between bg-gradient-to-r ${getBannerColor(pinnedNotif.type)} text-white`}
          >
            <div className="flex-1 flex items-center justify-center gap-2">
              <Megaphone size={12} className="animate-bounce shrink-0" />
              <span className="truncate max-w-[70vw] sm:max-w-none">
                <strong>{pinnedNotif.title}:</strong> {pinnedNotif.message}
              </span>
              {pinnedNotif.link && (
                <Link href={pinnedNotif.link} className="underline ml-2 hover:text-white/80 inline-flex items-center gap-0.5 shrink-0">
                  Learn More <ExternalLink size={10} />
                </Link>
              )}
            </div>
            <button onClick={handleDismissBanner} className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/85 hover:text-white ml-2 text-[10px] font-bold uppercase shrink-0">
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed left-0 right-0 z-40 transition-all duration-300 bg-white/95 dark:bg-[#08080A]/95 backdrop-blur-md border-b border-gray-200/80 dark:border-white/10 shadow-sm ${
          showBanner && pinnedNotif ? "top-9 sm:top-10" : "top-0"
        }`}
      >
        <div className="section-padding mx-auto">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/images/logo.jpg" alt="FX" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-bold text-xl tracking-wider text-slate-900 dark:text-white group-hover:text-[#FF4053] transition-colors">
                Fx Insights <span className="text-[#FF4053]">Hub</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(link.href)
                      ? "text-[#FF4053] bg-[#FF4053]/10 font-bold border border-[#FF4053]/30"
                      : "text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Theme Switcher Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="p-2 rounded-lg transition-all duration-300 border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 flex items-center justify-center shadow-xs"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? (
                  <Sun size={18} className="text-amber-400" />
                ) : (
                  <Moon size={18} className="text-slate-700" />
                )}
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={handleToggleNotifications}
                      className={`relative p-2 rounded-lg transition-colors ${
                        notificationsOpen
                          ? "text-[#FF4053] bg-[#FF4053]/10"
                          : "text-slate-600 dark:text-gray-300 hover:text-[#FF4053] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 px-1 py-0.5 text-[8px] font-bold bg-[#FF4053] text-white rounded-full min-w-[12px] h-[12px] flex items-center justify-center animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {notificationsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-[-80px] sm:right-0 mt-2 w-[85vw] max-w-[320px] sm:w-80 bg-white dark:bg-[#111116] overflow-hidden shadow-2xl border border-gray-200 dark:border-[#FF4053]/20 rounded-2xl max-h-96 flex flex-col z-50"
                        >
                          <div className="p-3 border-b border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white tracking-wider">ANNOUNCEMENTS</span>
                            <span className="text-[10px] text-slate-500 dark:text-gray-500">{notifications.length} recent</span>
                          </div>
                          <div className="overflow-y-auto max-h-72 p-1.5 space-y-1.5 custom-scrollbar">
                            {notifications.length === 0 ? (
                              <p className="text-center text-xs text-slate-500 dark:text-gray-500 py-6">No recent announcements</p>
                            ) : (
                              notifications.map((notif) => (
                                <div
                                  key={notif.id}
                                  className={`p-2.5 rounded-lg text-left flex gap-2.5 hover:bg-slate-100 dark:hover:bg-white/[0.03] transition-colors border border-transparent ${
                                    !readIds.includes(notif.id) ? "bg-slate-50 dark:bg-white/[0.01] border-[#FF4053]/10" : ""
                                  }`}
                                >
                                  <div className="shrink-0">{getNotifIcon(notif.type)}</div>
                                  <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center gap-1.5 justify-between">
                                      <h4 className="font-semibold text-xs text-slate-900 dark:text-white truncate flex-1">{notif.title}</h4>
                                      {notif.isPinned && (
                                        <Pin size={8} className="text-[#FF4053] fill-[#FF4053] shrink-0" />
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-gray-400 mt-0.5 leading-relaxed break-words">{notif.message}</p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-[9px] text-slate-400 dark:text-gray-500">{new Date(notif.createdAt).toLocaleDateString()}</span>
                                      {notif.link && (
                                        <Link
                                          href={notif.link}
                                          onClick={() => setNotificationsOpen(false)}
                                          className="text-[10px] text-elite-gold font-medium flex items-center gap-0.5 hover:underline"
                                        >
                                          View <ExternalLink size={8} />
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#16161D] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF4053]/20 to-blue-600/20 border border-[#FF4053]/30 flex items-center justify-center">
                        <User size={16} className="text-[#FF4053]" />
                      </div>
                      <span className="hidden md:block text-sm font-semibold text-slate-800 dark:text-white">{user.name}</span>
                      <ChevronDown size={14} className="text-slate-500 dark:text-gray-400" />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111116] border border-gray-200 dark:border-[#FF4053]/20 rounded-2xl shadow-2xl overflow-hidden z-50"
                        >
                          <div className="p-3.5 border-b border-gray-100 dark:border-white/5">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-gray-400 truncate">{user.email}</p>
                            <div className="mt-2 flex items-center gap-1">
                              <Crown size={12} className="text-[#FF4053]" />
                              <span className="text-xs text-[#FF4053] font-semibold capitalize">{user.plan} Plan</span>
                            </div>
                          </div>
                          <div className="p-1.5 space-y-0.5">
                            <Link
                              href="/dashboard"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                              <LayoutDashboard size={15} className="text-[#FF4053]" />
                              Dashboard
                            </Link>
                            <Link
                              href="/dashboard/profile"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                              <User size={15} className="text-[#FF4053]" />
                              Profile
                            </Link>
                            {["admin", "superadmin"].includes(user.role) && (
                              <Link
                                href="/admin"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
                              >
                                <Crown size={15} className="text-[#FF4053]" />
                                {user.role === "superadmin" ? "Superadmin Panel" : "Admin Panel"}
                              </Link>
                            )}
                            <button
                              onClick={() => {
                                setProfileOpen(false);
                                logout();
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-[#FF4053] hover:bg-[#FF4053]/10 transition-colors"
                            >
                              <LogOut size={15} />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-[#FF4053] dark:hover:text-white transition-colors">
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-primary text-sm">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={handleToggleMobileMenu}
                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-gray-300 hover:text-[#FF4053] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            {/* Sidebar menu panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-[60%] sm:w-[50%] z-50 border-l border-gray-200 dark:border-white/10 shadow-2xl p-6 flex flex-col gap-6 lg:hidden bg-white dark:bg-[#08080A]"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/10">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-wider">Navigation</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sidebar Links */}
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-base font-medium py-1.5 transition-all duration-300 ${
                      isActive(link.href)
                        ? "text-[#FF4053] font-bold pl-2 border-l-2 border-[#FF4053]"
                        : "text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white pl-0"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Sidebar CTA (For guest users) */}
              {!user && (
                <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-elite-border">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-center text-sm font-medium text-gray-400 hover:text-gray-100 py-2.5 rounded-lg border border-elite-border hover:bg-elite-surface transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary text-center text-sm py-2.5"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
