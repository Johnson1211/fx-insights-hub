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

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, url, category, duration, isFreePreview } = body;

    if (!title || !url || !category) {
      return NextResponse.json(
        { error: "Title, Video URL, and Category are required" },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: {
        title,
        description: description || "",
        url,
        category: category.toLowerCase(),
        duration: duration ? Number(duration) : 0,
        isFreePreview: !!isFreePreview,
        thumbnail: "", // can be generated or selected dynamically
        createdBy: admin.userId,
      },
    });

    // Bulk-create notification alerts for all users
    try {
      const users = await prisma.user.findMany({ select: { id: true } });
      if (users.length > 0) {
        await prisma.userNotification.createMany({
          data: users.map((u) => ({
            userId: u.id,
            title: "New Lesson Uploaded 🎥",
            message: `A new video "${video.title}" has been uploaded to the "${video.category}" section!`,
            type: "info",
            link: `/dashboard/courses?video=${video.id}`,
          })),
        });
      }
    } catch (notifErr) {
      // Log notification error but don't fail the video creation
      console.error("Failed to create video upload notifications:", notifErr);
    }

    return NextResponse.json({ video }, { status: 201 });
  } catch (error: any) {
    console.error("Admin create video error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const { title } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const video = await prisma.video.update({
      where: { id },
      data: { title: title.trim() },
    });

    return NextResponse.json({ video });
  } catch (error: any) {
    console.error("Admin update video error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error: any) {
    console.error("Admin delete video error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
