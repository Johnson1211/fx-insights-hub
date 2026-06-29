import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { sendMail } from "@/lib/mail";

export const dynamic = "force-dynamic";

async function getAuthUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  const payload = verifyAccessToken(token);
  if (!payload) return null;
  return payload;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const bookings = await prisma.booking.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error("User bookings GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { type, preferredDate, notes } = body;

    if (!type || !preferredDate) {
      return NextResponse.json({ error: "Type and preferred date are required" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        type,
        preferredDate: new Date(preferredDate),
        notes: notes || "",
        status: "pending",
        userId: auth.userId,
      },
    });

    // Fetch user details for notification
    try {
      const userDetail = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: { name: true, email: true, phone: true },
      });

      if (userDetail) {
        const typeLabel =
          type === "bootcamp"
            ? "Physical Classroom Bootcamp"
            : type === "classroom"
            ? "Classroom Training Seminar"
            : "1-on-1 Private Mentorship";

        const adminEmail = process.env.SMTP_USER || "admin@fxelite.pro";
        const subject = `New Personal Training Request: ${typeLabel}`;
        const html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #1a1a1a; border-radius: 12px; background-color: #0b0c10; color: #ffffff;">
            <h2 style="color: #d4af37; border-bottom: 1px solid #d4af37; padding-bottom: 10px;">New Training Booking Request</h2>
            <p>A user has submitted a new reservation request on FXElite Pro.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #a9a9a9; width: 180px;">User Name:</td>
                <td style="padding: 8px 0; color: #ffffff;">${userDetail.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #a9a9a9;">User Email:</td>
                <td style="padding: 8px 0; color: #ffffff;">${userDetail.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #a9a9a9;">User Phone:</td>
                <td style="padding: 8px 0; color: #ffffff;">${userDetail.phone || "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #a9a9a9;">Training Style:</td>
                <td style="padding: 8px 0; color: #d4af37; font-weight: bold;">${typeLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #a9a9a9;">Preferred Date & Time:</td>
                <td style="padding: 8px 0; color: #ffffff;">${new Date(preferredDate).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #a9a9a9; vertical-align: top;">Topics/Goals:</td>
                <td style="padding: 8px 0; color: #d3d3d3; font-style: italic;">"${notes || "None provided"}"</td>
              </tr>
            </table>
            <p style="margin-top: 25px; border-top: 1px solid #1a1a1a; padding-top: 15px; font-size: 11px; color: #666666;">
              Manage and approve/reschedule this booking in the Admin Dashboard.
            </p>
          </div>
        `;
        // Send email asynchronously
        sendMail({ to: adminEmail, subject, html }).catch((err) =>
          console.error("SMTP async call error:", err)
        );
      }
    } catch (notifErr) {
      console.error("Booking email dispatch error:", notifErr);
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error: any) {
    console.error("User bookings POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
