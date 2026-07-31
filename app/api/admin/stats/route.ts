import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function verifyAdmin(req: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  const payload = verifyAccessToken(token);
  if (!payload || !["admin", "superadmin"].includes(payload.role)) return null;
  return payload;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Total Members & Change
    const totalMembers = await prisma.user.count();
    const membersCreatedThisMonth = await prisma.user.count({
      where: { createdAt: { gte: startOfMonth } },
    });
    const membersChange = totalMembers > 0 
      ? parseFloat(((membersCreatedThisMonth / totalMembers) * 100).toFixed(1)) 
      : 0;

    // 2. Active Subscribers & Change
    const activeSubscribers = await prisma.user.count({
      where: { plan: { not: "free" } },
    });
    const subscribersCreatedThisMonth = await prisma.user.count({
      where: { 
        plan: { not: "free" },
        createdAt: { gte: startOfMonth }
      },
    });
    const subscribersChange = activeSubscribers > 0 
      ? parseFloat(((subscribersCreatedThisMonth / activeSubscribers) * 100).toFixed(1)) 
      : 0;

    // 3. Signals This Month & Change
    const totalSignals = await prisma.signal.count();
    const signalsThisMonth = await prisma.signal.count({
      where: { createdAt: { gte: startOfMonth } },
    });
    const signalsChange = totalSignals > 0 
      ? parseFloat(((signalsThisMonth / totalSignals) * 100).toFixed(1)) 
      : 0;

    // 4. Revenue Estimation based on current user plans
    const users = await prisma.user.findMany({
      select: { plan: true },
    });
    let revenue = 0;
    users.forEach((u) => {
      if (u.plan === "premium") revenue += 49;
      else if (u.plan === "copy_trader") revenue += 99;
      else if (u.plan === "training") revenue += 299;
    });

    const revenueChange = subscribersChange; // relative growth

    // Recent Activity Builder
    const latestSignals = await prisma.signal.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    const latestUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const activities: any[] = [];
    latestSignals.forEach((sig) => {
      activities.push({
        action: "New signal posted",
        detail: `${sig.pair} ${sig.type} - ${sig.status}`,
        time: sig.createdAt,
        type: "signal",
      });
    });
    latestUsers.forEach((usr) => {
      activities.push({
        action: "User registered",
        detail: usr.email,
        time: usr.createdAt,
        type: "user",
      });
    });

    // Sort combined activities by time (newest first) and take the top 5
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    const recentActivity = activities.slice(0, 5);

    // Fetch manual profits setting
    const manualProfitsSetting = await prisma.setting.findUnique({
      where: { key: "manual_profits" },
    });
    const manualProfits = manualProfitsSetting ? Number(manualProfitsSetting.value) : 1200000;

    return NextResponse.json({
      stats: {
        totalMembers,
        membersChange,
        activeSubscribers,
        subscribersChange,
        signalsThisMonth,
        signalsChange,
        revenue,
        revenueChange,
        manualProfits,
      },
      recentActivity,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { manualProfits } = await req.json();
    if (manualProfits === undefined || isNaN(Number(manualProfits))) {
      return NextResponse.json({ error: "Invalid manual profits value" }, { status: 400 });
    }

    const setting = await prisma.setting.upsert({
      where: { key: "manual_profits" },
      update: { value: String(manualProfits) },
      create: { key: "manual_profits", value: String(manualProfits) },
    });

    return NextResponse.json({ success: true, setting });
  } catch (error: any) {
    console.error("Admin stats update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

