import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    // Always respond success to avoid user enumeration
    if (!user) {
      return NextResponse.json({
        message: "If that email is registered, a reset link has been sent.",
      });
    }

    // Generate a cryptographically secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    await sendMail({
      to: user.email,
      subject: "FXElite Pro — Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f13; color: #e5e7eb; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #d4af37; font-size: 24px; letter-spacing: 2px; margin: 0;">FXELITE PRO</h1>
            <p style="color: #6b7280; font-size: 13px; margin-top: 4px;">Password Reset Request</p>
          </div>

          <p style="color: #d1d5db; line-height: 1.6;">Hi <strong>${user.name}</strong>,</p>
          <p style="color: #d1d5db; line-height: 1.6;">
            We received a request to reset the password for your FXElite Pro account.
            Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
          </p>

          <div style="text-align: center; margin: 36px 0;">
            <a href="${resetUrl}"
               style="display: inline-block; background: linear-gradient(135deg, #d4af37, #f5d276); color: #0f0f13;
                      font-weight: 700; font-size: 15px; padding: 14px 36px; border-radius: 8px;
                      text-decoration: none; letter-spacing: 0.5px;">
              Reset Password
            </a>
          </div>

          <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">
            If you didn't request this, you can safely ignore this email — your password will remain unchanged.
          </p>

          <hr style="border: none; border-top: 1px solid #1f2937; margin: 28px 0;" />
          <p style="color: #4b5563; font-size: 12px; text-align: center;">
            Or copy and paste this link into your browser:<br />
            <span style="color: #d4af37; word-break: break-all;">${resetUrl}</span>
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "If that email is registered, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
