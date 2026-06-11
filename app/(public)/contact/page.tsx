"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Mail, Phone, MessageCircle, Send, Clock, CheckCircle, Youtube, Facebook } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const socials = [
    { name: "YouTube", href: "https://youtube.com/@fxinsightshub?si=DRHhDCOj3ZXiE7Qi", icon: Youtube, color: "hover:text-red-500" },
    { name: "TikTok", href: "https://www.tiktok.com/@fxinsighthub_peleboss?_r=1&_t=ZS-975CcYIO2Ue", icon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ), color: "hover:text-cyan-400" },
    { name: "Facebook", href: "https://www.facebook.com/share/18TRs2FDvx/?mibextid=wwXIfr", icon: Facebook, color: "hover:text-blue-500" },
    { name: "Telegram Group", href: "https://t.me/+eaNhaqhRdYc1ZWU0", icon: Send, color: "hover:text-blue-400" },
    { name: "WhatsApp Chat", href: "https://wa.link/cu9c9s", icon: MessageCircle, color: "hover:text-green-500" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="section-padding">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-elite-gold text-sm font-semibold tracking-widest uppercase">Get In Touch</span>
            <h1 className="font-display text-4xl md:text-6xl text-white mt-3 tracking-wider">
              CONTACT <span className="gold-gradient-text">US</span>
            </h1>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Have questions about our services? We are here to help you start your trading journey.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <ScrollReveal direction="left">
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl text-white tracking-wider mb-6">LET&apos;S TALK</h2>
                <p className="text-gray-400 leading-relaxed">
                  Whether you are a beginner looking to learn or an experienced trader seeking advanced signals, 
                  our team is ready to assist you. Reach out through any of the channels below.
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href="mailto:fxinsighth@gmail.com"
                  className="flex items-center gap-4 p-4 glass-card hover:border-elite-gold/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center group-hover:bg-elite-gold/20 transition-colors">
                    <Mail className="w-5 h-5 text-elite-gold" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Email</p>
                    <p className="text-white font-medium">fxinsighth@gmail.com</p>
                  </div>
                </a>

                <div className="flex flex-col gap-4 p-4 glass-card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-elite-gold" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs uppercase tracking-wider">Phone Support</p>
                      <div className="flex flex-col gap-1 mt-1">
                        <a href="tel:+233249827093" className="text-white font-medium hover:text-elite-gold transition-colors">
                          +233 24 982 7093
                        </a>
                        <a href="tel:+233598912317" className="text-white font-medium hover:text-elite-gold transition-colors">
                          +233 59 891 2317
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href="https://wa.link/cu9c9s"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 glass-card hover:border-elite-gold/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center group-hover:bg-elite-gold/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-elite-gold" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">WhatsApp Link</p>
                    <p className="text-white font-medium">Click to chat on WhatsApp</p>
                  </div>
                </a>

                <a
                  href="https://t.me/+eaNhaqhRdYc1ZWU0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 glass-card hover:border-elite-gold/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-elite-gold/10 border border-elite-gold/20 flex items-center justify-center group-hover:bg-elite-gold/20 transition-colors">
                    <Send className="w-5 h-5 text-elite-gold" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Telegram Group</p>
                    <p className="text-white font-medium">Click to join Telegram Group</p>
                  </div>
                </a>
              </div>

              {/* Social Channels List */}
              <div className="glass-card p-6">
                <h3 className="font-display text-lg text-white tracking-wider mb-4">OUR SOCIAL CHANNELS</h3>
                <div className="flex flex-wrap gap-4">
                  {socials.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-elite-surface border border-elite-border text-gray-400 ${social.color} hover:border-elite-gold/30 transition-all text-sm font-medium`}
                      >
                        <IconComponent />
                        {social.name}
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock size={18} className="text-elite-gold" />
                  <h3 className="font-display text-lg text-white tracking-wider">RESPONSE TIME</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  We typically respond to all inquiries within 2-4 hours during business hours. 
                  Premium members receive priority support with sub-1-hour response times.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact Form */}
          <ScrollReveal direction="right">
            <div className="glass-card p-8">
              <h2 className="font-display text-2xl text-white tracking-wider mb-6">SEND A MESSAGE</h2>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle size={48} className="text-elite-green mb-4" />
                  <h3 className="font-display text-xl text-white tracking-wider mb-2">MESSAGE SENT!</h3>
                  <p className="text-gray-400 text-sm">We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input-field resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
                    <Send size={16} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
