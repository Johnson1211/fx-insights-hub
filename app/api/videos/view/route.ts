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
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    const video = await prisma.video.update({
      where: { id: videoId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true, views: video.views });
  } catch (error: any) {
    console.error("Increment video views error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
