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
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const plan = searchParams.get("plan");

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (plan) {
      where.plan = plan as any;
    }

    const skip = (page - 1) * limit;
    const [dbUsers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const users = dbUsers.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        _id: user.id,
      };
    });

    return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (error: any) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, plan, role, brokerApproved, derivStatus } = await req.json();

    const update: any = {};
    if (plan) update.plan = plan as any;
    if (role) update.role = role as any;
    if (brokerApproved !== undefined) update.brokerApproved = brokerApproved;
    if (derivStatus !== undefined) update.derivStatus = derivStatus;

    const dbUser = await prisma.user.update({
      where: { id: userId },
      data: update,
    });

    const { password, ...userWithoutPassword } = dbUser;
    const user = {
      ...userWithoutPassword,
      _id: dbUser.id,
    };

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Admin update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
