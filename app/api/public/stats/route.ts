import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Database Counts (Signals and Course Lessons)
    const totalSignals = await prisma.signal.count();
    const totalLessons = await prisma.video.count();

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
        pips: true,
      },
    });

    const totalClosed = closedSignals.length;
    const wins = closedSignals.filter((s) => s.result === "Win").length;
    // Real win rate calculated from DB, fallback to 87 if no closed signals yet
    const winRate = totalClosed > 0 ? Math.round((wins / totalClosed) * 100) : 87;

    // 3. Profits Generated (checks for manual input first, then falls back to calculation or default)
    const manualProfitsSetting = await prisma.setting.findUnique({
      where: { key: "manual_profits" },
    });

    let profitsGenerated = 1200000; // fallback default
    if (manualProfitsSetting) {
      profitsGenerated = Number(manualProfitsSetting.value);
    } else if (totalClosed > 0) {
      const totalMembers = await prisma.user.count();
      const totalPips = closedSignals.reduce((acc, s) => acc + (s.pips || 0), 0);
      profitsGenerated = Math.max(0, Math.round(totalPips * 10 * totalMembers));
    }

    // 4. Countries Reached: parse prefix of phone numbers
    const users = await prisma.user.findMany({
      select: { phone: true },
      where: { phone: { not: null } },
    });

    const countries = new Set<string>();
    users.forEach((u) => {
      if (u.phone) {
        const cleanPhone = u.phone.trim();
        if (cleanPhone.startsWith("+")) {
          const match = cleanPhone.match(/^\+(\d{1,3})/);
          if (match) {
            countries.add(match[1]);
          }
        }
      }
    });
    const countriesCount = countries.size > 0 ? countries.size : 1;

    return NextResponse.json({
      winRate,
      yearsExperience: 8,
      profitsGenerated,
      countriesReached: countriesCount,
      totalSignals,
      totalLessons,
    });
  } catch (error: any) {
    console.error("Public stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

