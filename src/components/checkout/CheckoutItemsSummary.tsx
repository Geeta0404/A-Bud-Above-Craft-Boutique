"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProductBySlug } from "@/lib/data/products";
import { CAD } from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import type { CartItem } from "@/lib/types";

const QUANTITY_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

function CheckoutItemRow({
  item,
  notes,
  onNotesChange,
}: {
  item: CartItem;
  notes: string;
  onNotesChange: (value: string) => void;
}) {
  const { updateQuantity, removeItem } = useCart();
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <div className="border-b border-border py-4 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium">{item.name}</p>
        <div className="flex shrink-0 items-center gap-3">
          <select
            aria-label={`Quantity for ${item.name}`}
            value={item.quantity}
            onChange={(e) => updateQuantity(item.slug, Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-transparent px-1.5 text-sm"
          >
            {QUANTITY_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="w-16 text-right text-sm font-medium">{CAD(item.price * item.quantity)}</span>
          <button
            type="button"
            aria-label={`Remove ${item.name}`}
            onClick={() => removeItem(item.slug)}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!notesOpen ? (
        <button
          type="button"
          onClick={() => setNotesOpen(true)}
          className="mt-1.5 text-xs font-medium text-primary hover:underline"
        >
          + Special Instructions
        </button>
      ) : (
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={`Any special requests for ${item.name}?`}
          className="mt-2 text-sm"
          rows={2}
        />
      )}
    </div>
  );
}

export function CheckoutItemsSummary({
  itemNotes,
  onNotesChange,
}: {
  itemNotes: Record<string, string>;
  onNotesChange: (slug: string, value: string) => void;
}) {
  const { items } = useCart();

  const groups = items.reduce<{ brand: string; items: CartItem[] }[]>((acc, item) => {
    const brand = getProductBySlug(item.slug)?.brand ?? "Other";
    const group = acc.find((g) => g.brand === brand);
    if (group) group.items.push(item);
    else acc.push({ brand, items: [item] });
    return acc;
  }, []);

  return (
    <div>
      {groups.map((group) => (
        <div key={group.brand}>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.brand}</p>
          {group.items.map((item) => (
            <CheckoutItemRow
              key={item.slug}
              item={item}
              notes={itemNotes[item.slug] ?? ""}
              onNotesChange={(value) => onNotesChange(item.slug, value)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
