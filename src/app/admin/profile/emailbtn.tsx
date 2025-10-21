"use client";

import { Button } from "@/components/ui/button";

export default function EmailButton() {
  async function sendNewOrderEmail() {
  const res = await fetch("/api/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId: "BGV-10293",
      clientName: "John Smith",
      product: "Drive-by Inspection",
      propertyAddress: "123 Main St",
      propertyCity: "Sacramento",
      propertyState: "CA",
      propertyZip: "95814",
      dueDateISO: new Date().toISOString(),
      notes: "Please complete by Friday.",
      vendorEmails: ["markpustyn@gmail.com"],
    }),
  });

  const data = await res.json();
  if (!res.ok) console.error("Email error:", data.error);
  else console.log("Email sent successfully:", data.data);
}
  return (
    <Button
      onClick={() => {sendNewOrderEmail()}}
    >
      Send Email
    </Button>
  );
}
