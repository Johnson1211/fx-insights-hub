import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Authorize the user session
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Supabase upload details
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jvxmtsmslyokplooyfwz.supabase.co";
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_KEY) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY in .env");
      return NextResponse.json(
        { error: "Supabase service role key is not configured in environment variables" },
        { status: 500 }
      );
    }

    const bucketName = "media";
    // Sanitize filename to prevent upload path issues (replace special chars with underscore)
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}-${sanitizedName}`;

    // Upload to Supabase Storage API directly
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucketName}/${encodeURIComponent(fileName)}`;
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "apikey": SUPABASE_KEY,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
      body: buffer,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Supabase Storage upload error:", errText);
      return NextResponse.json(
        { error: `Supabase Storage upload failed: ${response.statusText}` },
        { status: 500 }
      );
    }

    // Construct public URL
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${encodeURIComponent(fileName)}`;

    return NextResponse.json({ url: publicUrl, message: "Upload successful" });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
