"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { motion } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-elite-bg">
        <div className="w-10 h-10 border-2 border-elite-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-elite-bg pt-16 lg:pt-20">
      <AdminSidebar />

      <main className="lg:ml-64">
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
