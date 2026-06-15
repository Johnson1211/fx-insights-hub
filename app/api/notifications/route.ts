import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const [pinned, list] = await Promise.all([
      prisma.notification.findFirst({
        where: { isPinned: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
        take: 15,
      }),
    ]);

    return NextResponse.json({ pinned, notifications: list });
  } catch (error: any) {
    console.error("Public notifications GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
