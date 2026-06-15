import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// POST /api/user/avatar — receive Cloudinary URL and save to user.avatar
export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { avatarUrl } = body;

    if (!avatarUrl) {
      return NextResponse.json({ error: "Avatar URL is required" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: payload.userId },
      data: { avatar: avatarUrl },
      select: {
        id: true, name: true, email: true, phone: true,
        avatar: true, role: true, plan: true,
        tradingExperience: true, referralCode: true,
        isVerified: true, derivId: true, derivStatus: true, brokerApproved: true,
      },
    });

    return NextResponse.json({ user: updated, message: "Avatar updated" });
  } catch (error: any) {
    console.error("Avatar update error:", error);
    return NextResponse.json({ error: "Failed to update avatar" }, { status: 500 });
  }
}
