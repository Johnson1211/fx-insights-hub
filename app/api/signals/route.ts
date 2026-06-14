import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { SignalStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const pair = searchParams.get("pair");

    const where: any = {};
    if (status) {
      if (status === "Active" || status === "Closed") {
        where.status = status as SignalStatus;
      }
    }
    if (pair) {
      where.pair = pair;
    }

    const dbSignals = await prisma.signal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
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
    console.error("Signals fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload || payload.role !== "admin") {
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
        createdBy: payload.userId,
      },
    });

    const signal = {
      ...dbSignal,
      _id: dbSignal.id,
    };

    return NextResponse.json({ signal }, { status: 201 });
  } catch (error: any) {
    console.error("Signal creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
