import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import ClientOrderCompleteEmail from "@/app/emails/completeOrder";

const resend = new Resend(process.env.RESEND_TOKEN);

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_TOKEN) {
      return NextResponse.json({ error: "Missing RESEND_TOKEN" }, { status: 500 });
    }

    const json = await req.json();
    const { order } = json || {};

    if (!order || !order.propertyAddress) {
      return NextResponse.json({ error: "Invalid or missing order object" }, { status: 400 });
    }
    

    const subject = `Complete Property inspection order at ${order.propertyAddress} ${order.propertyCity || ""} ${order.propertyState || ""} ${order.propertyZip || ""}`;

    const { data, error } = await resend.emails.send({
      from: "Blue Grid <noreply@app.bluegridvaluations.com>",
      to: ["bobthebaugd@gmail.com"],
      subject,
      react: ClientOrderCompleteEmail({
        orderId: order.orderId || "",
        product: order.product || "",
        propertyAddress: order.propertyAddress || "",
        propertyCity: order.propertyCity || "",
        propertyState: order.propertyState || "",
        propertyZip: order.propertyZip || "",
        clientName: order.clientName || "",
        mainProduct: order.mainProduct || "Inspection Report",
        completedAt: order.completedAt || new Date().toLocaleDateString(),
        downloadUrl: order.downloadUrl || "",
        dashboardUrl: order.dashboardUrl || "https://app.bluegridvaluations.com/client/dashboard",
        supportEmail: order.supportEmail || "support@bluegridvaluations.com",
        supportPhone: order.supportPhone || "(555) 123-4567",
      }),
    });

    if (error) return NextResponse.json({ error }, { status: 502 });
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Email send failed:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
