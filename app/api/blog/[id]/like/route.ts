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
    const blogId = params.id;

    const count = await prisma.blogLike.count({
      where: { blogId },
    });

    let hasLiked = false;
    if (auth) {
      const like = await prisma.blogLike.findUnique({
        where: {
          blogId_userId: {
            blogId,
            userId: auth.userId,
          },
        },
      });
      hasLiked = !!like;
    }

    return NextResponse.json({ count, hasLiked });
  } catch (error: any) {
    console.error("Blog like GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const blogId = params.id;
    const userId = auth.userId;

    const existing = await prisma.blogLike.findUnique({
      where: {
        blogId_userId: {
          blogId,
          userId,
        },
      },
    });

    if (existing) {
      await prisma.blogLike.delete({
        where: {
          blogId_userId: {
            blogId,
            userId,
          },
        },
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.blogLike.create({
        data: {
          blogId,
          userId,
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error: any) {
    console.error("Blog like POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
