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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
    }

    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Notification deleted successfully" });
  } catch (error: any) {
    console.error("Admin notification DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
