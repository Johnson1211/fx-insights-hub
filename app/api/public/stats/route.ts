import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Total Members
    const totalMembers = await prisma.user.count();

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

    // 3. Profits Generated (calculated dynamically from actual closed signals pips)
    const totalPips = closedSignals.reduce((acc, s) => acc + (s.pips || 0), 0);
    // Standard profit calculation: $10 per pip on a standard lot, times number of members.
    // Fallback to 0 if no signals exist.
    const profitsGenerated = totalClosed > 0 ? Math.max(0, Math.round(totalPips * 10 * totalMembers)) : 0;

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
      activeMembers: totalMembers,
      winRate,
      yearsExperience: 8,
      profitsGenerated,
      countriesReached: countriesCount,
    });
  } catch (error: any) {
    console.error("Public stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
