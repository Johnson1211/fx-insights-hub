export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "guest" | "member" | "trader" | "admin";
  plan: "free" | "premium" | "copy_trader" | "training";
  tradingExperience?: "beginner" | "intermediate" | "advanced";
  referralCode: string;
  referredBy?: string;
  isVerified: boolean;
  derivId?: string;
  derivStatus?: "unsubmitted" | "pending" | "approved" | "rejected";
  brokerApproved?: boolean;
  createdAt: string;
}

export interface Signal {
  _id: string;
  pair: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2?: number;
  timeframe: "M15" | "H1" | "H4" | "D1";
  analysis: string;
  chartImage?: string;
  status: "Active" | "Closed";
  result?: "Win" | "Loss" | "Breakeven";
  pips?: number;
  createdAt: string;
  closedAt?: string;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  category: string;
  tags: string[];
  isFreePreview: boolean;
  duration: number;
  order: number;
  createdAt: string;
}

export interface Subscription {
  _id: string;
  user: string;
  plan: string;
  stripeSubscriptionId: string;
  status: "active" | "canceled" | "past_due";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  stripePriceId: string;
  popular?: boolean;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  publishedAt: string;
  author: string;
}

export interface LiveSession {
  _id: string;
  title: string;
  description: string;
  scheduledAt: string;
  platform: "youtube" | "zoom" | "custom";
  embedUrl: string;
  isLive: boolean;
  recordingUrl?: string;
}
