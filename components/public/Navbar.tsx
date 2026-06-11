"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, Bell, User, ChevronDown, Crown, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/signals", label: "Signals" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-elite-bg/90 backdrop-blur-xl border-b border-elite-border/50 shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="section-padding mx-auto">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-elite-gold to-amber-600 flex items-center justify-center">
                <span className="font-display text-elite-bg text-lg font-bold">FX</span>
              </div>
              <span className="font-display text-xl tracking-wider text-white group-hover:text-elite-gold transition-colors">
                FX INSIGHTS <span className="text-elite-gold">HUB</span>
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
                      ? "text-elite-gold bg-elite-gold/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-elite-red rounded-full animate-pulse" />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-elite-gold/30 to-amber-600/30 border border-elite-gold/30 flex items-center justify-center">
                        <User size={16} className="text-elite-gold" />
                      </div>
                      <span className="hidden md:block text-sm font-medium text-gray-200">{user.name}</span>
                      <ChevronDown size={14} className="text-gray-500" />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-56 glass-card overflow-hidden"
                        >
                          <div className="p-3 border-b border-elite-border/50">
                            <p className="text-sm font-semibold text-white">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                            <div className="mt-2 flex items-center gap-1">
                              <Crown size={12} className="text-elite-gold" />
                              <span className="text-xs text-elite-gold capitalize">{user.plan} Plan</span>
                            </div>
                          </div>
                          <div className="p-1">
                            <Link
                              href="/dashboard"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <LayoutDashboard size={14} />
                              Dashboard
                            </Link>
                            <Link
                              href="/dashboard/profile"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <User size={14} />
                              Profile
                            </Link>
                            {user.role === "admin" && (
                              <Link
                                href="/admin"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                              >
                                <Crown size={14} />
                                Admin Panel
                              </Link>
                            )}
                            <button
                              onClick={() => {
                                setProfileOpen(false);
                                logout();
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-elite-red hover:bg-elite-red/10 transition-colors"
                            >
                              <LogOut size={14} />
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
                  <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-primary text-sm">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-gray-300 hover:text-white"
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
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-elite-bg/98 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-2xl font-display tracking-wider ${
                      isActive(link.href) ? "text-elite-gold" : "text-gray-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {!user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-3 mt-4"
                >
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="text-lg text-gray-300">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-primary">
                    Get Started
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
