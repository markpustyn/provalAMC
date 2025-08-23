"use client";

import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutContainer({
  product,
  order,
}: {
  product: string;
  order: any;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, order }),
      });
      const data = await res.json();
      setClientSecret(data.clientSecret ?? null);
    })();
  }, [product, order]);

  if (!clientSecret) return <div className="text-sm text-gray-600">Loading payment…</div>;

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: { theme: "stripe" },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm order={order} />
    </Elements>
  );
}

function CheckoutForm({ order }: { order: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setMessage(null);
    setSubmitting(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          // If a redirect is required (3DS), Stripe will use this:
          return_url: `${location.origin}/checkout/success`,
        },
      });

      if (error) {
        setMessage(error.message ?? "Payment failed. Try another method.");
        return;
      }

      if (!paymentIntent) {
        setMessage("No payment intent returned.");
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Create your order AFTER confirmed payment, use PI id for idempotency on the backend
        const res = await fetch("/api/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...order, paymentIntentId: paymentIntent.id }),
        });

        if (!res.ok) {
          const txt = await res.text();
          setMessage(`Order creation failed: ${txt || res.statusText}`);
          return;
        }

        // Done — move on
        router.push("/client/order");
        return;
      }

      if (paymentIntent.status === "processing") {
        setMessage("Your payment is processing. You’ll get a confirmation shortly.");
        // Optional: poll your backend by PI id, or route to a waiting page
        return;
      }

      if (paymentIntent.status === "requires_payment_method") {
        setMessage("Payment was not successful. Please try another payment method.");
        return;
      }

      setMessage(`Unhandled status: ${paymentIntent.status}`);
    } catch (err: any) {
      setMessage(err?.message ?? "Unexpected error.");
    } finally {
      // Ensure the button doesn’t stay stuck
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={!stripe || !elements || submitting} className="mt-3">
        {submitting ? "Processing…" : "Pay"}
      </button>
      {message && <div className="mt-2 text-sm text-red-600">{message}</div>}
    </form>
  );
}
