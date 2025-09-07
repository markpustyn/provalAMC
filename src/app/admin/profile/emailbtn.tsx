"use client";

import { Button } from "@/components/ui/button";

export default function EmailButton() {
  return (
    <Button
      onClick={async () => {
        await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: "ACME Lending",
          product: "PCR Exterior",
          propertyAddress: "123 Main St",
          propertyCity: "Sacramento",
          propertyState: "CA",
          propertyZip: "95814",
          vendorEmails: ["markpustyn@gmail.com", "bobthebaugd@gmail.com"],
          cc: ["ops@example.com"],
        }),
      });
      }}
    >
      Send Email
    </Button>
  );
}
