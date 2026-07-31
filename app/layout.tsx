import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
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
    <html lang="en" className="dark">
      <body className="min-h-screen font-body antialiased transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
