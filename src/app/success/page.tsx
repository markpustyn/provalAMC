// app/checkout/success/page.tsx (Client component)
"use client";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SuccessPage() {
  const [status, setStatus] = useState<"checking"|"ok"|"failed">("checking");

  useEffect(() => {
    (async () => {
      const stripe = await stripePromise;
      const params = new URLSearchParams(window.location.search);
      const clientSecret = params.get("payment_intent_client_secret");
      if (!stripe || !clientSecret) return setStatus("failed");

      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
      if (paymentIntent?.status === "succeeded") {
        // Retrieve your saved draft (e.g., from sessionStorage)
        const draft = JSON.parse(sessionStorage.getItem("orderDraft") || "{}");

        await fetch("/api/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...draft,
            paymentIntentId: paymentIntent.id,
          }),
        });

        setStatus("ok");
      } else {
        setStatus("failed");
      }
    })();
  }, []);

  if (status === "checking") return <p>Verifying payment…</p>;
  if (status === "failed") return <p>Payment not completed.</p>;
  return <p>Order placed! 🎉</p>;
}
