import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  return NextResponse.json({ message: "Logged out successfully" });
}
