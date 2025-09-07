import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { order } from "@/db/schema";
import { Resend } from "resend";
import { OrderSchema } from "@/lib/schema/order_schema";
import Email from "@/app/emails/my-email";
import MainProduct from "@/components/forms/mainProduct";

const resend = new Resend(process.env.RESEND_TOKEN);


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
      
    const subject = `New EvaluCloud Order ${inserted.mainProduct} Inspection in ${inserted.propertyCity!} is available`;

      const { error: emailError } = await resend.emails.send({
            from: "Evalu Cloud <info@evaluacloud.tech>",
            to: "markpustyn@gmail.com",
            subject: subject,
            react: Email({
        clientName: inserted.lender ?? "Client",
        product: inserted.mainProduct!,
        propertyAddress: inserted.propertyAddress!,
        propertyCity: inserted.propertyCity!,
        propertyState: inserted.propertyState!,
        propertyZip: inserted.propertyZip!,
      }),
          });

      if (emailError) {
      // order created but email failed
      return NextResponse.json(
        { success: true, data: inserted, emailError },
        { status: 207 } // multi status to signal partial success
      );
    }
    return NextResponse.json({ success: true, data: inserted });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
