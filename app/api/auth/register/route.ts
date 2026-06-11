import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateTokens, setAuthCookies } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, referralCode } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    const newReferralCode = "FX" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        referralCode: newReferralCode,
        referredBy: referralCode || undefined,
        role: "member",
        plan: "free",
      },
    });

    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    setAuthCookies(accessToken, refreshToken);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan,
          referralCode: user.referralCode,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
