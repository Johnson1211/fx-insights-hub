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
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Fetch user role and broker approved status
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { role: true, brokerApproved: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch videos sorted by order then createdAt
    const dbVideos = await prisma.video.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    const isApproved = user.role === "admin" || user.brokerApproved;

    // Secure URLs if not approved
    const videos = dbVideos.map((vid) => {
      return {
        id: vid.id,
        title: vid.title,
        description: vid.description,
        thumbnail: vid.thumbnail || "bg-gradient-to-br from-blue-900/50 to-blue-600/30",
        category: vid.category,
        tags: vid.tags,
        isFreePreview: vid.isFreePreview,
        duration: vid.duration,
        order: vid.order,
        createdAt: vid.createdAt,
        // Block access to video URL if not approved and not free preview
        url: (isApproved || vid.isFreePreview) ? vid.url : "",
        isLocked: !isApproved && !vid.isFreePreview,
      };
    });

    return NextResponse.json({ videos });
  } catch (error: any) {
    console.error("Fetch videos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
