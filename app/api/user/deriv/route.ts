import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { derivId } = body;

    if (!derivId || typeof derivId !== "string" || derivId.trim() === "") {
      return NextResponse.json({ error: "Broker Account ID is required" }, { status: 400 });
    }

    // Check if another user already registered this derivId
    const existingUser = await prisma.user.findUnique({
      where: { derivId: derivId.trim() },
    });

    if (existingUser && existingUser.id !== payload.userId) {
      return NextResponse.json(
        { error: "This Broker ID is already registered to another account" },
        { status: 400 }
      );
    }

    // Update the user status
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        derivId: derivId.trim(),
        derivStatus: "pending",
        brokerApproved: false,
      },
      select: {
        id: true,
        derivId: true,
        derivStatus: true,
        brokerApproved: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    console.error("Deriv ID submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
