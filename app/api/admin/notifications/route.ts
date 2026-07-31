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

    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ notifications });
  } catch (error: any) {
    console.error("Admin notifications GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, message, type, link, isPinned } = await req.json();

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    // If this notification is pinned, unpin other notifications to ensure only one active banner
    if (isPinned) {
      await prisma.notification.updateMany({
        where: { isPinned: true },
        data: { isPinned: false },
      });
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type: type || "info",
        link: link || null,
        isPinned: !!isPinned,
      },
    });

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error: any) {
    console.error("Admin notifications POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
