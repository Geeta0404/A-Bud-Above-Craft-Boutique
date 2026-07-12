"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CAD, STORE_INFO } from "@/lib/constants";
import type { FulfillmentType } from "@/lib/checkoutSchema";

const FULFILLMENT_LABEL: Record<FulfillmentType, string> = {
  "pickup-in-store": "In-Store Pickup",
  "pickup-curbside": "Curbside Pickup",
  delivery: "Delivery",
};

const PROMO_CODES: Record<string, number> = {
  SAVE10: 0.1,
  WELCOME15: 0.15,
};

export function CheckoutSidebar({
  subtotal,
  itemCount,
  fulfillmentType,
  submitting,
  onPromoApplied,
}: {
  subtotal: number;
  itemCount: number;
  fulfillmentType: FulfillmentType;
  submitting: boolean;
  onPromoApplied: (discount: number) => void;
}) {
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "applied" | "invalid">("idle");
  const [discountRate, setDiscountRate] = useState(0);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const rate = PROMO_CODES[code];
    if (rate) {
      setDiscountRate(rate);
      setPromoStatus("applied");
      onPromoApplied(subtotal * rate);
    } else {
      setDiscountRate(0);
      setPromoStatus("invalid");
      onPromoApplied(0);
    }
  };

  const discount = subtotal * discountRate;
  const taxRate = 0.13;
  const tax = Math.max(subtotal - discount, 0) * taxRate;
  const total = Math.max(subtotal - discount, 0) + tax;

  return (
    <div className="space-y-5 rounded-3xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading text-lg font-bold text-primary">
          {STORE_INFO.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold">{STORE_INFO.name}</p>
          <p className="truncate text-xs text-muted-foreground">{STORE_INFO.address}</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{FULFILLMENT_LABEL[fulfillmentType]}</span>
        {" · "}
        {fulfillmentType === "delivery" ? STORE_INFO.deliveryHours : STORE_INFO.pickupHours}
      </p>

      {!promoOpen ? (
        <button
          type="button"
          onClick={() => setPromoOpen(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <Tag className="h-3.5 w-3.5" />
          Add a promo code
        </button>
      ) : (
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <Input
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value);
                setPromoStatus("idle");
              }}
              placeholder="Promo code"
              className="h-9"
            />
            <Button type="button" variant="outline" size="sm" onClick={applyPromo}>
              Apply
            </Button>
          </div>
          {promoStatus === "applied" && (
            <p className="text-xs font-medium text-primary">
              Code applied — {Math.round(discountRate * 100)}% off
            </p>
          )}
          {promoStatus === "invalid" && <p className="text-xs text-destructive">Invalid promo code</p>}
        </div>
      )}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">
            Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})
          </dt>
          <dd>{CAD(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-primary">
            <dt>Promo discount</dt>
            <dd>-{CAD(discount)}</dd>
          </div>
        )}
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-1 text-muted-foreground">
            Taxes <Info className="h-3 w-3" />
          </dt>
          <dd>{CAD(tax)}</dd>
        </div>
      </dl>

      <div className="flex justify-between border-t border-border pt-4 font-semibold">
        <span>Order Total</span>
        <span>{CAD(total)}</span>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={submitting || itemCount === 0}>
        {submitting ? "Placing Order…" : "Place Order"}
      </Button>

      <p className="text-xs text-muted-foreground">
        By continuing you agree to our{" "}
        <Link href="/terms" className="underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
