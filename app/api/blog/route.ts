import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const post = await prisma.blogPost.findUnique({
        where: { slug, status: "published" },
        include: {
          author: {
            select: { name: true, avatar: true },
          },
        },
      });

      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      return NextResponse.json({ post });
    }

    const posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      include: {
        author: {
          select: { name: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error("Public blogs GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
