"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-elite-bg">
        <div className="w-10 h-10 border-2 border-elite-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-elite-bg pt-16 lg:pt-20">
      <DashboardSidebar />
      <MobileNav />

      <main className="lg:ml-64 pb-20 lg:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 sm:p-6 lg:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
