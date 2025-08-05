import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { s3AmcUploads } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { fileKey, tag } = await req.json();

    await db
      .update(s3AmcUploads)
      .set({ imgTag: tag })
      .where(eq(s3AmcUploads.objectKey, fileKey));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating tag:", err);
    return NextResponse.json({ success: false, error: "DB update failed" }, { status: 500 });
  }
}
