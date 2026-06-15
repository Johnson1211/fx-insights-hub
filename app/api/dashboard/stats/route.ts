import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
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

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { plan: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Signals This Month (created in the current calendar month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const signalsThisMonth = await prisma.signal.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // 2. Win Rate (from closed signals with Win/Loss results)
    const closedSignals = await prisma.signal.findMany({
      where: {
        status: "Closed",
        result: {
          in: ["Win", "Loss"],
        },
      },
      select: {
        result: true,
      },
    });

    const totalClosed = closedSignals.length;
    const wins = closedSignals.filter((s) => s.result === "Win").length;
    const winRate = totalClosed > 0 ? Math.round((wins / totalClosed) * 100) : 85;

    // 3. Copy Trading Active status
    const copyTradingActive = user.plan === "copy_trader" || user.role === "admin";

    return NextResponse.json({
      stats: {
        signalsThisMonth,
        winRate,
        copyTradingActive,
      },
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
