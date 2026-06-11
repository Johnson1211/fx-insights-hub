import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatPips(pips: number): { text: string; color: string } {
  const sign = pips >= 0 ? "+" : "";
  const color = pips >= 0 ? "text-elite-green" : "text-elite-red";
  return { text: `${sign}${pips.toFixed(1)} pips`, color };
}

export function generateReferralCode(): string {
  return "FX" + Math.random().toString(36).substring(2, 8).toUpperCase();
}
