import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { order } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const [row] = await db.select().from(order).where(eq(order.orderId, id)).limit(1);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(row, { status: 200 });
}