"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Check, Crown, Zap, Target, ArrowRight, Loader2 } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free Community",
    description: "Get started with basic access",
    price: 0,
    interval: "month",
    features: [
      "Community feed access",
      "Limited signal previews (3/day)",
      "Basic educational content",
      "Weekly market analysis",
      "Email support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    id: "premium",
    name: "Premium Member",
    description: "Full access to all signals & content",
    price: 49,
    interval: "month",
    features: [
      "All Free features",
      "Unlimited trading signals",
      "Full video library",
      "Live trading sessions",
      "Priority support",
      "Signal performance stats",
      "Mobile app access",
    ],
    cta: "Start Premium",
    popular: true,
  },
  {
    id: "copy_trader",
    name: "Copy Trader",
    description: "Everything + automated copying",
    price: 99,
    interval: "month",
    features: [
      "All Premium features",
      "MT4/MT5 copy trading",
      "Real-time trade copying",
      "Copy trading dashboard",
      "Performance analytics",
      "Dedicated account manager",
      "VIP Discord channel",
    ],
    cta: "Become Elite",
    popular: false,
  },
  {
    id: "training",
    name: "3-Month Training",
    description: "Complete transformation program",
    price: 299,
    interval: "one-time",
    features: [
      "12-week structured curriculum",
      "Weekly live coaching calls",
      "1-on-1 mentorship sessions",
      "Downloadable resources",
      "Assignment reviews",
      "Lifetime community access",
      "Certification upon completion",
    ],
    cta: "Enroll Now",
    popular: false,
  },
];

export default function ServicesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (planId === "free") return;

    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="section-padding">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Pricing</span>
            <h1 className="font-display text-4xl md:text-6xl text-white mt-3 tracking-wider">
              CHOOSE YOUR <span className="gold-gradient-text">PLAN</span>
            </h1>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Select the plan that fits your trading goals. Upgrade or downgrade at any time.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                className={`relative glass-card p-8 h-full flex flex-col ${
                  plan.popular ? "border-elite-gold/40 shadow-lg shadow-amber-500/10" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-elite-gold to-amber-600 text-elite-bg text-xs font-bold px-4 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="w-12 h-12 rounded-xl bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center mb-4">
                    {plan.id === "free" ? (
                      <Zap size={20} className="text-elite-gold" />
                    ) : plan.id === "premium" ? (
                      <Crown size={20} className="text-elite-gold" />
                    ) : plan.id === "copy_trader" ? (
                      <Target size={20} className="text-elite-gold" />
                    ) : (
                      <ArrowRight size={20} className="text-elite-gold" />
                    )}
                  </div>
                  <h3 className="font-display text-xl text-white tracking-wider">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="font-display text-4xl text-white">${plan.price}</span>
                  <span className="text-gray-500 text-sm">
                    {plan.interval === "one-time" ? " one-time" : `/${plan.interval}`}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-400">
                      <Check size={16} className="text-elite-green shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id || user?.plan === plan.id}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-gradient-to-r from-elite-gold to-amber-600 text-elite-bg hover:shadow-lg hover:shadow-amber-500/25"
                      : "border border-elite-border text-gray-300 hover:bg-white/5 hover:border-elite-gold/30"
                  } ${user?.plan === plan.id ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading === plan.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : user?.plan === plan.id ? (
                    "Current Plan"
                  ) : (
                    <>
                      {plan.cta}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Comparison Table */}
        <ScrollReveal>
          <div className="mt-20 max-w-5xl mx-auto">
            <h2 className="font-display text-3xl text-white text-center tracking-wider mb-10">
              FEATURE <span className="gold-gradient-text">COMPARISON</span>
            </h2>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-elite-border/50">
                      <th className="text-left p-4 text-gray-400 font-medium text-sm">Feature</th>
                      <th className="text-center p-4 text-gray-400 font-medium text-sm">Free</th>
                      <th className="text-center p-4 text-elite-gold font-medium text-sm">Premium</th>
                      <th className="text-center p-4 text-elite-gold font-medium text-sm">Copy Trader</th>
                      <th className="text-center p-4 text-elite-gold font-medium text-sm">Training</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Trading Signals", "3/day", "Unlimited", "Unlimited", "Unlimited"],
                      ["Video Library", "Limited", "Full Access", "Full Access", "Full Access"],
                      ["Live Sessions", "—", "✓", "✓", "✓"],
                      ["Copy Trading", "—", "—", "✓", "—"],
                      ["Community Chat", "✓", "✓", "✓", "✓"],
                      ["1-on-1 Coaching", "—", "—", "—", "✓"],
                      ["Support", "Email", "Priority", "VIP", "Dedicated"],
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-elite-border/30 hover:bg-white/[0.02]">
                        <td className="p-4 text-sm text-gray-300">{row[0]}</td>
                        {row.slice(1).map((cell, j) => (
                          <td key={j} className="p-4 text-center text-sm">
                            {cell === "✓" ? (
                              <span className="text-elite-green">✓</span>
                            ) : cell === "—" ? (
                              <span className="text-gray-600">—</span>
                            ) : (
                              <span className="text-gray-400">{cell}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
