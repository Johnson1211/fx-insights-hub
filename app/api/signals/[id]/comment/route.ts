import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getAuthUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  const payload = verifyAccessToken(token);
  if (!payload) return null;
  return payload;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const signalId = params.id;

    const comments = await prisma.signalComment.findMany({
      where: { signalId },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ comments });
  } catch (error: any) {
    console.error("Signal comments GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const signalId = params.id;
    const body = await req.json();
    const { content } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
    }

    const comment = await prisma.signalComment.create({
      data: {
        content: content.trim(),
        signalId,
        userId: auth.userId,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error: any) {
    console.error("Signal comment POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser();
    if (!auth || !["admin", "superadmin"].includes(auth.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    await prisma.signalComment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    console.error("Signal comment DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
