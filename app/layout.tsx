import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/Toaster";

export const metadata: Metadata = {
  title: "Fx Insights Hub | Master Forex Trading With Precision.",
  description: "Premium forex trading community platform by Peleboss. Live signals, copy trading, education, and professional mentorship.",
  openGraph: {
    title: "Fx Insights Hub",
    description: "Master Forex Trading With Precision. Build Wealth.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-elite-bg text-gray-100">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
