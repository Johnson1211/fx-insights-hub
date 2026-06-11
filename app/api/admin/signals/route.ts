import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

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

    const dbSignals = await prisma.signal.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        creator: {
          select: {
            name: true,
          },
        },
      },
    });

    const signals = dbSignals.map((sig) => ({
      ...sig,
      _id: sig.id,
      createdBy: {
        _id: sig.createdBy,
        name: sig.creator?.name || "Admin",
      },
    }));

    return NextResponse.json({ signals });
  } catch (error: any) {
    console.error("Admin signals error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const dbSignal = await prisma.signal.create({
      data: {
        pair: body.pair,
        type: body.type,
        entryPrice: Number(body.entryPrice),
        stopLoss: Number(body.stopLoss),
        takeProfit1: Number(body.takeProfit1),
        takeProfit2: body.takeProfit2 ? Number(body.takeProfit2) : null,
        timeframe: body.timeframe,
        analysis: body.analysis,
        chartImage: body.chartImage || null,
        status: body.status || "Active",
        result: body.result || null,
        pips: body.pips ? Number(body.pips) : null,
        createdBy: admin.userId,
      },
    });

    const signal = {
      ...dbSignal,
      _id: dbSignal.id,
    };

    return NextResponse.json({ signal }, { status: 201 });
  } catch (error: any) {
    console.error("Admin create signal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Signal ID required" }, { status: 400 });
    }

    await prisma.signal.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Signal deleted" });
  } catch (error: any) {
    console.error("Admin delete signal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
