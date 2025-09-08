// app/api/emails/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import Email from "@/app/emails/new-orderEmail";

const resend = new Resend(process.env.RESEND_TOKEN); // keep this server side only

const BodySchema = z.object({
  orderId: z.string(),
  clientName: z.string(),
  product: z.string(),
  propertyAddress: z.string(),
  propertyCity: z.string(),
  propertyState: z.string().length(2),
  propertyZip: z.string(),
  dueDateISO: z.string().datetime().optional(),
  notes: z.string().optional(),
  vendorEmails: z.array(z.string().email()).min(1),
  // cc: z.array(z.string().email()).optional(),
  // bcc: z.array(z.string().email()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { vendorEmails, ...order } = parsed.data;

    const subject = `New order ${order.orderId}: ${order.product} at ${order.propertyAddress}`;

    const { data, error } = await resend.emails.send({
      from: "Evalu Cloud <info@evaluacloud.tech>",
      to: vendorEmails,
      subject,
      react: Email({
        clientName: order.clientName,
        product: order.product,
        propertyAddress: order.propertyAddress,
        propertyCity: order.propertyCity,
        propertyState: order.propertyState,
        propertyZip: order.propertyZip,
      }),
    });

    if (error) return NextResponse.json({ error }, { status: 502 });
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
