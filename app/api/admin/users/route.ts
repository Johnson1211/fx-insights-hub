import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

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
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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
    if (plan) where.plan = plan as any;

    const skip = (page - 1) * limit;
    const [dbUsers, total] = await Promise.all([
      prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.user.count({ where }),
    ]);

    const users = dbUsers.map((user) => {
      const { password, ...rest } = user;
      return { ...rest, _id: user.id };
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
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { userId, plan, role, brokerApproved, derivStatus, name, email, phone, derivId, isVerified, password: newPassword } = await req.json();

    // Fetch current user state before updating (to detect state changes)
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { brokerApproved: true, derivStatus: true, name: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Protect self-demotion
    if (userId === admin.userId && role && role !== "admin") {
      return NextResponse.json({ error: "You cannot demote your own admin account role" }, { status: 400 });
    }

    const update: any = {};
    if (plan) update.plan = plan as any;
    if (role) update.role = role as any;
    if (brokerApproved !== undefined) update.brokerApproved = brokerApproved;
    if (derivStatus !== undefined) update.derivStatus = derivStatus;
    if (name) update.name = name.trim();
    
    if (email) {
      const trimmedEmail = email.trim().toLowerCase();
      // Check for duplication
      const duplicate = await prisma.user.findFirst({
        where: {
          email: trimmedEmail,
          NOT: { id: userId }
        }
      });
      if (duplicate) {
        return NextResponse.json({ error: "Email is already registered to another user" }, { status: 400 });
      }
      update.email = trimmedEmail;
    }
    
    if (phone !== undefined) {
      update.phone = phone ? phone.trim() : null;
    }

    if (derivId !== undefined) {
      const trimmedDeriv = derivId ? derivId.trim() : null;
      if (trimmedDeriv) {
        // Check for duplication
        const duplicateDeriv = await prisma.user.findFirst({
          where: {
            derivId: trimmedDeriv,
            NOT: { id: userId }
          }
        });
        if (duplicateDeriv) {
          return NextResponse.json({ error: "Deriv ID is already associated with another user" }, { status: 400 });
        }
        update.derivId = trimmedDeriv;
      } else {
        update.derivId = null;
      }
    }

    if (isVerified !== undefined) {
      update.isVerified = !!isVerified;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
      }
      update.password = await bcrypt.hash(newPassword, 12);
    }

    const dbUser = await prisma.user.update({
      where: { id: userId },
      data: update,
    });

    // ——— Auto-create personal notification on approval ———
    const notifications: Array<{ title: string; message: string; type: string; link: string }> = [];

    // Case 1: brokerApproved flipped false → true
    if (brokerApproved === true && currentUser?.brokerApproved === false) {
      notifications.push({
        title: "🎉 Course Access Approved!",
        message:
          "Your Deriv registration has been verified by our admin. You now have full access to all course videos. Click to start learning!",
        type: "success",
        link: "/dashboard/courses",
      });
    }
    // Case 2: derivStatus changed to "approved" (and not already handled by brokerApproved flip)
    else if (derivStatus === "approved" && currentUser?.derivStatus !== "approved") {
      notifications.push({
        title: "✅ Deriv Account Approved",
        message:
          "Your Deriv account has been approved. You can now access all course content and video lessons on the platform.",
        type: "success",
        link: "/dashboard/courses",
      });
    }

    // Case 3: derivStatus changed to "rejected"
    if (derivStatus === "rejected" && currentUser?.derivStatus !== "rejected") {
      notifications.push({
        title: "❌ Deriv Submission Rejected",
        message:
          "Your Deriv ID submission was not approved. Please re-submit a valid Deriv user ID in your dashboard to gain course access.",
        type: "alert",
        link: "/dashboard",
      });
    }

    // Create all notification records
    if (notifications.length > 0) {
      await prisma.userNotification.createMany({
        data: notifications.map((n) => ({ ...n, userId })),
      });
    }

    const { password, ...userWithoutPassword } = dbUser;
    return NextResponse.json({ user: { ...userWithoutPassword, _id: dbUser.id } });
  } catch (error: any) {
    console.error("Admin update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (id === admin.userId) {
      return NextResponse.json({ error: "You cannot delete your own admin account" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Admin delete user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
