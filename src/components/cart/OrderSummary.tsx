import { CAD } from "@/lib/constants";

export function OrderSummary({
  subtotal,
  shipping = 0,
  taxRate = 0.13,
}: {
  subtotal: number;
  shipping?: number;
  taxRate?: number;
}) {
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  return (
    <div className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur-sm sm:p-10">
      <h2 className="font-heading text-lg font-semibold">Order Summary</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>{CAD(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd>{shipping === 0 ? "Free" : CAD(shipping)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Estimated Tax (HST)</dt>
          <dd>{CAD(tax)}</dd>
        </div>
      </dl>
      <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
        <span>Total</span>
        <span>{CAD(total)}</span>
      </div>
    </div>
  );
}
