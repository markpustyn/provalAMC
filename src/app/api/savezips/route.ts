import { db } from "@/db/drizzle";
import { vendorZipCodes } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, zipCodes, county } = body;

    if (!userId || !Array.isArray(zipCodes) || zipCodes.length === 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await db.insert(vendorZipCodes).values(
      zipCodes.map((zip: string) => ({
        userId,
        zipCode: zip,
        county
      }))
    ).onConflictDoNothing()
    .returning();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in POST /api/savezips:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
