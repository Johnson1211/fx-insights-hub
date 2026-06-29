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
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error("Admin bookings GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json({ error: "Booking ID and status are required" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    // Proactively notify user in app notifications about booking approval/cancellation
    try {
      const typeLabel = updated.type === "bootcamp" ? "Physical Bootcamp" : updated.type === "classroom" ? "Classroom Meeting" : "1-on-1 Mentorship";
      await prisma.userNotification.create({
        data: {
          userId: updated.userId,
          title: `Mentorship Booking ${status === "confirmed" ? "Approved ✔" : "Updated"}`,
          message: `Your booking for "${typeLabel}" on ${new Date(updated.preferredDate).toLocaleDateString()} has been ${status}.`,
          type: status === "confirmed" ? "success" : "warning",
          link: "/dashboard/training",
        },
      });
    } catch (notifErr) {
      console.error("Booking user notification error:", notifErr);
    }

    return NextResponse.json({ booking: updated });
  } catch (error: any) {
    console.error("Admin bookings PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
