import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fxelite-secret-key-change-in-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "fxelite-refresh-secret";

export function generateTokens(payload: { userId: string; email: string; role: string }) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId: payload.userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  const payload = verifyAccessToken(token);
  if (!payload) return null;

  return payload;
}

export function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = cookies();
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60, // 15 minutes
    path: "/",
  });
  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}
