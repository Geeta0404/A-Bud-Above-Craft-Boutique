"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CAD } from "@/lib/constants";

type LastOrder = {
  orderNumber: string;
  name: string;
  email: string;
  fulfillmentType: "pickup-in-store" | "pickup-curbside" | "delivery";
  paymentMethod: "pay-now" | "pay-in-store";
  address: string | null;
  items: { slug: string; name: string; quantity: number; price: number }[];
  subtotal: number;
};

const FULFILLMENT_LABEL: Record<LastOrder["fulfillmentType"], string> = {
  "pickup-in-store": "In-Store Pickup",
  "pickup-curbside": "Curbside Pickup",
  delivery: "Delivery",
};

export default function ConfirmationPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("aba-last-order");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read from sessionStorage on mount
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-2xl font-semibold">No recent order found</h1>
        <Button asChild className="mt-6">
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
      <h1 className="mt-4 font-heading text-3xl font-semibold">Thank you, {order.name.split(" ")[0]}!</h1>
      <p className="mt-2 text-muted-foreground">
        Your order <span className="font-medium text-foreground">#{order.orderNumber}</span> has been received.
        A confirmation has been sent to {order.email}.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6 text-left text-sm">
        <p>
          <span className="font-medium text-foreground">{FULFILLMENT_LABEL[order.fulfillmentType]}</span>
          {order.address ? ` — ${order.address}` : ""}
        </p>
        <p className="mt-1 text-muted-foreground">
          {order.paymentMethod === "pay-now" ? "Paid by card" : "Pay by cash at " + (order.fulfillmentType === "delivery" ? "delivery" : "pickup")}
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card p-6 text-left">
        {order.items.map((item) => (
          <div key={item.slug} className="flex justify-between py-2 text-sm">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{CAD(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-border pt-3 font-semibold">
          <span>Subtotal</span>
          <span>{CAD(order.subtotal)}</span>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        This is a demo storefront — no payment was actually processed.
      </p>

      <Button asChild className="mt-6">
        <Link href="/shop">Continue Shopping</Link>
      </Button>
    </div>
  );
}
