import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { order } from "@/db/schema";
import { OrderSchema } from "@/lib/schema/order_schema";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = OrderSchema.parse(body);

    const [inserted] = await db
      .insert(order)
      .values(
        { ...parsed, 
          clientId: session.user.id,
          paymentIntentId: body.paymentIntentId,
          
        })
      .returning();

    return NextResponse.json({ success: true, data: inserted });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
