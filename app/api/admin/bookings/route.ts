import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { sendMail } from "@/lib/mail";

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
    const { bookingId, status, preferredDate } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (preferredDate) updateData.preferredDate = new Date(preferredDate);

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Notify user in app notifications and email about booking status updates
    try {
      const typeLabel =
        updated.type === "bootcamp"
          ? "Physical Classroom Bootcamp"
          : updated.type === "classroom"
          ? "Classroom Seminar"
          : "1-on-1 Private Mentorship";

      let notifTitle = `Training Reservation Updated`;
      let notifMsg = `Your booking for "${typeLabel}" has been updated.`;

      if (status === "confirmed" && !preferredDate) {
        notifTitle = `Training Booking Approved ✔`;
        notifMsg = `Your reservation for "${typeLabel}" on ${new Date(
          updated.preferredDate
        ).toLocaleDateString()} has been approved.`;
      } else if (status === "cancelled") {
        notifTitle = `Training Booking Cancelled ❌`;
        notifMsg = `Your reservation request for "${typeLabel}" has been cancelled.`;
      } else if (preferredDate) {
        notifTitle = `Training Booking Rescheduled 📅`;
        notifMsg = `Your reservation request for "${typeLabel}" has been rescheduled to ${new Date(
          updated.preferredDate
        ).toLocaleDateString()} at ${new Date(updated.preferredDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}.`;
      }

      await prisma.userNotification.create({
        data: {
          userId: updated.userId,
          title: notifTitle,
          message: notifMsg,
          type: status === "confirmed" ? "success" : status === "cancelled" ? "warning" : "info",
          link: "/dashboard/training",
        },
      });

      // Send confirmation email to the user
      if (updated.user?.email) {
        const mailSubject = `FXElite Pro: ${notifTitle}`;
        const mailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #1a1a1a; border-radius: 12px; background-color: #0b0c10; color: #ffffff;">
            <h2 style="color: #d4af37; border-bottom: 1px solid #d4af37; padding-bottom: 10px;">Training Schedule Update</h2>
            <p>Hi ${updated.user.name},</p>
            <p>${notifMsg}</p>
            <p style="margin-top: 25px; border-top: 1px solid #1a1a1a; padding-top: 15px; font-size: 12px; color: #a9a9a9;">
              You can review this reservation details anytime in your <a href="${
                process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
              }/dashboard/training" style="color: #d4af37; text-decoration: underline;">Training Dashboard</a>.
            </p>
          </div>
        `;
        sendMail({ to: updated.user.email, subject: mailSubject, html: mailHtml }).catch((err) =>
          console.error("Reschedule SMTP async call error:", err)
        );
      }
    } catch (notifErr) {
      console.error("Booking user notification error:", notifErr);
    }

    return NextResponse.json({ booking: updated });
  } catch (error: any) {
    console.error("Admin bookings PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
