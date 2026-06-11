"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Youtube, MessageCircle, Send, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-elite-card border-t border-elite-border/50">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-elite-gold/50 to-transparent" />

      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-elite-gold to-amber-600 flex items-center justify-center">
                <span className="font-display text-elite-bg text-lg font-bold">FX</span>
              </div>
              <span className="font-display text-xl tracking-wider text-white">
                FX INSIGHTS <span className="text-elite-gold">HUB</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Master Forex trading with precision. Join our elite community of profitable traders and transform your financial future.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://youtube.com/@fxinsightshub?si=DRHhDCOj3ZXiE7Qi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-elite-surface border border-elite-border flex items-center justify-center text-gray-400 hover:text-elite-gold hover:border-elite-gold/30 transition-all"
                title="YouTube"
              >
                <Youtube size={16} />
              </a>
              <a
                href="https://www.tiktok.com/@fxinsighthub_peleboss?_r=1&_t=ZS-975CcYIO2Ue"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-elite-surface border border-elite-border flex items-center justify-center text-gray-400 hover:text-elite-gold hover:border-elite-gold/30 transition-all"
                title="TikTok"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/18TRs2FDvx/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-elite-surface border border-elite-border flex items-center justify-center text-gray-400 hover:text-elite-gold hover:border-elite-gold/30 transition-all"
                title="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://t.me/+eaNhaqhRdYc1ZWU0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-elite-surface border border-elite-border flex items-center justify-center text-gray-400 hover:text-elite-gold hover:border-elite-gold/30 transition-all"
                title="Telegram Group"
              >
                <Send size={16} />
              </a>
              <a
                href="https://wa.link/cu9c9s"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-elite-surface border border-elite-border flex items-center justify-center text-gray-400 hover:text-elite-gold hover:border-elite-gold/30 transition-all"
                title="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg text-white mb-4 tracking-wider">QUICK LINKS</h4>
            <ul className="space-y-3">
              {["Home", "About", "Services", "Signals", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-elite-gold transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg text-white mb-4 tracking-wider">SERVICES</h4>
            <ul className="space-y-3">
              {["Trading Signals", "Copy Trading", "Live Sessions", "Training Program", "Community Access"].map((item) => (
                <li key={item}>
                  <span className="text-gray-400 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg text-white mb-4 tracking-wider">CONTACT</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-elite-gold mt-0.5 shrink-0" />
                <a href="mailto:fxinsighth@gmail.com" className="text-gray-400 hover:text-elite-gold transition-colors text-sm">
                  fxinsighth@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-elite-gold mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+2339827093" className="text-gray-400 hover:text-elite-gold transition-colors text-sm">
                    +233 98 270 93
                  </a>
                  <a href="tel:+233598912317" className="text-gray-400 hover:text-elite-gold transition-colors text-sm mt-1">
                    +233 59 891 2317
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Send size={16} className="text-elite-gold mt-0.5 shrink-0" />
                <a href="https://t.me/+eaNhaqhRdYc1ZWU0" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-elite-gold transition-colors text-sm">
                  Telegram Group
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle size={16} className="text-elite-gold mt-0.5 shrink-0" />
                <a href="https://wa.link/cu9c9s" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-elite-gold transition-colors text-sm">
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-elite-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Fx Insights Hub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Risk Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
