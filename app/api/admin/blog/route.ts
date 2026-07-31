import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function verifyAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  const payload = verifyAccessToken(token);
  if (!payload || !["admin", "superadmin"].includes(payload.role)) return null;
  return payload;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error("Admin blogs GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, category, tags, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 });
    }

    // Check if slug is unique
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Blog post with this URL slug already exists" }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content,
        coverImage: coverImage || "",
        category: category || "General",
        tags: tags || [],
        status: status || "draft",
        authorId: admin.userId,
        publishedAt: status === "published" ? new Date() : new Date(),
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error: any) {
    console.error("Admin create blog error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Post ID is required" }, { status: 400 });

    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, category, tags, status } = body;

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (content !== undefined) data.content = content;
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (category !== undefined) data.category = category;
    if (tags !== undefined) data.tags = tags;
    if (status !== undefined) {
      data.status = status;
      if (status === "published") {
        data.publishedAt = new Date();
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data,
    });

    return NextResponse.json({ post: updated });
  } catch (error: any) {
    console.error("Admin edit blog error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Post ID is required" }, { status: 400 });

    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error: any) {
    console.error("Admin delete blog error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
