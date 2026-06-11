import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10" as any,
});

const PLANS = {
  premium: {
    name: "Premium Member",
    price: 4900,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || "",
  },
  copy_trader: {
    name: "Copy Trader",
    price: 9900,
    priceId: process.env.STRIPE_COPY_PRICE_ID || "",
  },
  training: {
    name: "3-Month Training",
    price: 29900,
    priceId: process.env.STRIPE_TRAINING_PRICE_ID || "",
  },
};

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { planId } = await req.json();
    const plan = PLANS[planId as keyof typeof PLANS];

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: payload.email,
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/services?canceled=true`,
      metadata: {
        userId: payload.userId,
        planId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
