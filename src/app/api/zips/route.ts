// /api/zips/route.ts
import { db } from "@/db/drizzle";
import {  vendorZipCodes, zipCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const county = searchParams.get("county");

  if (!county) {
    return NextResponse.json({ error: "Missing county" }, { status: 400 });
  }

  const zips = await db
    .select({ zip: zipCodes.zip })
    .from(zipCodes)
    .where(eq(zipCodes.countyName, county));

  return NextResponse.json(zips);
}
