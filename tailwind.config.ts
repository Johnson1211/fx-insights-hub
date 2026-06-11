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
        elite: {
          bg: "#0A0E1A",
          card: "#06080F",
          gold: "#F0B429",
          green: "#00E676",
          red: "#FF1744",
          blue: "#1E3A8A",
          surface: "#111827",
          border: "#1F2937",
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
          "0%, 100%": { boxShadow: "0 0 20px rgba(240, 180, 41, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(240, 180, 41, 0.5)" },
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
        "gold-gradient": "linear-gradient(135deg, #F0B429 0%, #D97706 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
