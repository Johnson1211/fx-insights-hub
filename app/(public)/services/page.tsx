"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { useAuth } from "@/hooks/useAuth";
import { Check, Zap, Target, BookOpen, UserCheck, ArrowRight } from "lucide-react";

const servicesList = [
  {
    id: "online_training",
    name: "Online Training Session",
    description: "Comprehensive live interactive webinars",
    icon: BookOpen,
    features: [
      "Live interactive webinars",
      "Basics to advanced forex curriculum",
      "Q&A sessions with professional traders",
      "Access to downloadable learning materials",
      "Weekly live market reviews",
    ],
    cta: "Book Live Session",
    popular: false,
    image: null,
  },
  {
    id: "in_person_training",
    name: "In-Person Training Session",
    description: "Hands-on face-to-face classroom mentorship",
    icon: UserCheck,
    features: [
      "Physical classroom workshops",
      "One-on-one live market trading reviews",
      "Networking with experienced traders",
      "Interactive trading desk setups",
      "Direct guidance from Peleboss",
    ],
    cta: "Schedule Meeting",
    popular: false,
    image: null,
  },
  {
    id: "signal_services",
    name: "Signal Services",
    description: "High probability daily trade alerts",
    icon: Zap,
    features: [
      "Daily technical analysis signals",
      "Precise Entry, Stop Loss, and Take Profit levels",
      "Real-time alerts via community channels",
      "Win rate performance reports",
      "Professional risk management setup",
    ],
    cta: "Access Signals",
    popular: true,
    image: null,
  },
  {
    id: "lifetime_coaching",
    name: "Lifetime Coaching & Guidance",
    description: "Continuous professional trading guidance",
    icon: Target,
    features: [
      "Long-term mentorship program",
      "Psychology and emotional control coaching",
      "Custom trading plan development",
      "Capital scaling models guidance",
      "Direct 24/7 access to Peleboss support",
    ],
    cta: "Apply for Coaching",
    popular: false,
    image: "/images/coaching.png",
  },
];

export default function ServicesPage() {
  const { user } = useAuth();

  const handleServiceAction = (serviceId: string) => {
    if (serviceId === "signal_services") {
      if (user) {
        window.location.href = "/dashboard/signals";
      } else {
        window.location.href = "/register";
      }
    } else {
      window.location.href = "/contact";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="section-padding">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Our Offerings</span>
            <h1 className="font-display text-4xl md:text-6xl text-white mt-3 tracking-wider">
              PROFESSIONAL <span className="gold-gradient-text">SERVICES</span>
            </h1>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Access our premium forex education, signals, and lifetime coaching. All services are currently free of charge.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
          {servicesList.map((service, i) => {
            const Icon = service.icon;
            return (
              <ScrollReveal key={service.id} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={`relative glass-card p-6 h-full flex flex-col justify-between ${
                    service.popular ? "border-elite-gold/40 shadow-lg shadow-blue-500/5" : ""
                  }`}
                >
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-elite-gold to-blue-700 text-elite-bg text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Recommended
                      </span>
                    </div>
                  )}

                  <div>
                    {service.image ? (
                      <div className="mb-4 aspect-video relative rounded-lg overflow-hidden border border-elite-border/30">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center mb-4">
                        <Icon size={20} className="text-elite-gold" />
                      </div>
                    )}
                    <h3 className="font-display text-xl text-white tracking-wider">{service.name}</h3>
                    <p className="text-gray-500 text-xs mt-1 mb-4">{service.description}</p>
                    
                    <div className="mb-6">
                      <span className="font-display text-3xl text-elite-gold font-bold">FREE</span>
                      <span className="text-gray-500 text-xs ml-2 uppercase tracking-wide">For Now</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-xs text-gray-400">
                          <Check size={14} className="text-elite-green shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleServiceAction(service.id)}
                    className={`w-full py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 mt-auto ${
                      service.popular
                        ? "bg-gradient-to-r from-elite-gold to-blue-700 text-elite-bg hover:shadow-lg hover:shadow-blue-500/25"
                        : "border border-elite-border text-gray-300 hover:bg-elite-gold/10 hover:border-elite-gold/30 hover:text-white"
                    }`}
                  >
                    {service.cta}
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
