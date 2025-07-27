import { db } from "@/db/drizzle";
import { vendorZipCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

        const zips = await db
        .select()
        .from(vendorZipCodes)
        .where(eq(vendorZipCodes.userId, userId));

        return NextResponse.json(zips);
  } catch (err) {
    console.error("Error in POST /api/savezips:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
