import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { order, users } from "@/db/schema";
import { Resend } from "resend";
import { OrderSchema } from "@/lib/schema/order_schema";
import Email from "@/app/emails/new-orderEmail";
import ClientOrder from "@/app/emails/clientOrder";
import { eq } from "drizzle-orm";
import { formatDateMDY, getProductFeeDollars } from "@/lib/utils";

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
      .values({
        ...parsed,
        clientId: session.user.id,
        paymentIntentId: body.paymentIntentId ?? null,
      })
      .returning();

    // fetch the current user
    const [userRow] = await db
      .select({
        id: users.id,
        email: users.email,
        street: users.street,
        zip: users.zip,
        state: users.state,
        city: users.city,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    const subject = `We received your inspection order for ${inserted.propertyAddress}, ${inserted.propertyCity} ${inserted.propertyState}`;


    const { error: emailError } = await resend.emails.send({
      from: "Evalu Cloud <info@evaluacloud.tech>",
      to: userRow?.email ?? "info@evaluacloud.tech",
      subject: `New EvaluCloud Order ${inserted.mainProduct ?? ""} Inspection in ${inserted.propertyCity ?? ""} is available`,
      react: Email({
        clientName: inserted.lender ?? "Client",
        product: inserted.mainProduct ?? "",
        propertyAddress: inserted.propertyAddress ?? "",
        propertyCity: inserted.propertyCity ?? "",
        propertyState: inserted.propertyState ?? "",
        propertyZip: inserted.propertyZip ?? "",
      }),
    });

    const { error: receiptError } = await resend.emails.send({
      from: "Evalu Cloud <info@evaluacloud.tech>",
      to: userRow?.email ?? "info@evaluacloud.tech",
      subject,
      react: ClientOrder({
        clientName: inserted.lender ?? "Client",
        product: inserted.mainProduct ?? "",
        propertyAddress: inserted.propertyAddress ?? "",
        propertyCity: inserted.propertyCity ?? "",
        propertyState: inserted.propertyState ?? "",
        propertyZip: inserted.propertyZip ?? "",
        orderId: inserted.orderId!,
        userEmail: userRow?.email ?? "",
        userStreet: userRow?.street ?? "",
        userCity: userRow?.city ?? "",
        userZip: userRow?.zip ?? "",
        userState: userRow?.state ?? "",
        date: formatDateMDY(new Date()),
        requestedDueDate: inserted.requestedDueDate ?? null,
        fee: getProductFeeDollars(inserted.mainProduct!),
      }),
    });

    if (emailError || receiptError) {
      return NextResponse.json(
        {
          success: true,
          data: inserted,
          emailError,
          receiptError,
        },
        { status: 207 }
      );
    }

    return NextResponse.json({ success: true, data: inserted });
  } catch (err) {
    console.error("Error creating order:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
