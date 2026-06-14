"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { Award, TrendingUp, Users, Globe, BookOpen, Target } from "lucide-react";

const milestones = [
  { year: "2018", title: "Trading Journey Begins", description: "Started professional trading career on the London forex floors" },
  { year: "2020", title: "First $100K Month", description: "Achieved first six-figure trading month using proprietary strategies" },
  { year: "2022", title: "Community Founded", description: "Launched Fx Insights Hub with 50 founding members" },
  { year: "2024", title: "1,000 Members Milestone", description: "Community grew to 1,000 active traders worldwide" },
  { year: "2025", title: "Copy Trading Launch", description: "Introduced automated copy trading for MT4/MT5 platforms" },
  { year: "2026", title: "Global Recognition", description: "Recognized as top-tier forex education platform with 1,000+ members" },
];

const values = [
  { icon: Target, title: "Precision", description: "Every trade is backed by rigorous technical and fundamental analysis" },
  { icon: BookOpen, title: "Education First", description: "We teach you to fish, not just give you fish" },
  { icon: Users, title: "Community", description: "Trading is better together. Share, learn, and grow as a collective" },
  { icon: TrendingUp, title: "Consistency", description: "Small consistent wins compound into extraordinary results over time" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="section-padding">
        {/* Hero */}
        <ScrollReveal>
          <div className="text-center mb-20">
            <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Our Story</span>
            <h1 className="font-display text-4xl md:text-6xl text-white mt-3 tracking-wider">
              ABOUT <span className="gold-gradient-text">FX INSIGHTS HUB</span>
            </h1>
            <p className="text-gray-400 mt-6 max-w-3xl mx-auto text-lg leading-relaxed">
              Fx Insights Hub was born from a simple belief: that anyone can become a profitable trader with the right guidance, 
              community, and discipline. What started as a small group of dedicated traders has evolved into a global movement 
              of financial empowerment.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { value: 8, suffix: "+", label: "Years Experience", icon: Award },
            { value: 1000, suffix: "+", label: "Community Members", icon: Users },
            { value: 50, suffix: "+", label: "Countries Reached", icon: Globe },
            { value: 87, suffix: "%", label: "Signal Accuracy", icon: TrendingUp },
          ].map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <div className="glass-card p-6 text-center">
                <stat.icon className="w-8 h-8 text-elite-gold mx-auto mb-3" />
                <div className="font-display text-3xl text-white">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto mb-24">
          <ScrollReveal>
            <h2 className="font-display text-3xl text-white text-center tracking-wider mb-12">
              OUR <span className="gold-gradient-text">JOURNEY</span>
            </h2>
          </ScrollReveal>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-elite-gold/50 via-elite-gold/20 to-transparent" />

            {milestones.map((milestone, i) => (
              <ScrollReveal key={milestone.year} delay={i * 0.15}>
                <div className={`relative flex items-center gap-8 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="hidden md:block flex-1 text-right">
                    {i % 2 === 0 && (
                      <div>
                        <span className="font-display text-2xl text-elite-gold">{milestone.year}</span>
                        <h3 className="font-display text-xl text-white mt-1 tracking-wider">{milestone.title}</h3>
                        <p className="text-gray-400 text-sm mt-2">{milestone.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-elite-gold border-4 border-elite-bg flex items-center justify-center shrink-0 z-10">
                    <div className="w-2 h-2 rounded-full bg-elite-bg" />
                  </div>

                  <div className="flex-1">
                    <div className="md:hidden mb-2">
                      <span className="font-display text-xl text-elite-gold">{milestone.year}</span>
                    </div>
                    {i % 2 !== 0 ? (
                      <div>
                        <span className="hidden md:inline font-display text-2xl text-elite-gold">{milestone.year}</span>
                        <h3 className="font-display text-xl text-white mt-1 tracking-wider">{milestone.title}</h3>
                        <p className="text-gray-400 text-sm mt-2">{milestone.description}</p>
                      </div>
                    ) : (
                      <div className="md:hidden">
                        <h3 className="font-display text-xl text-white tracking-wider">{milestone.title}</h3>
                        <p className="text-gray-400 text-sm mt-2">{milestone.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-3xl text-white text-center tracking-wider mb-12">
              OUR <span className="gold-gradient-text">VALUES</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.1}>
                <div className="glass-card-hover p-8 flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center shrink-0">
                    <value.icon className="w-6 h-6 text-elite-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-white tracking-wider mb-2">{value.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
