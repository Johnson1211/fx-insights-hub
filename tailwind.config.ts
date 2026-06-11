import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#0F172A", // Map white text utility to slate-900
        gray: {
          100: "#1E293B",
          200: "#334155",
          300: "#475569",
          400: "#64748B",
          500: "#94A3B8",
          600: "#CBD5E1",
          700: "#E2E8F0",
          800: "#F1F5F9",
          900: "#F8FAFC",
        },
        elite: {
          bg: "#F8FAFC",
          card: "#FFFFFF",
          gold: "#1E3A8A",
          green: "#10B981",
          red: "#EF4444",
          blue: "#1D4ED8",
          surface: "#F1F5F9",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        display: ["Bebas Neue", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "ticker": "ticker 30s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "candle-rise": "candle-rise 3s ease-out forwards",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(30, 58, 138, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(30, 58, 138, 0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "candle-rise": {
          "0%": { height: "0px", opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gold-gradient": "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
