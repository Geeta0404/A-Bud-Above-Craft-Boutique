"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CAD } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/lib/types";

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 border-b border-border py-5 last:border-0">
      <Link href={`/shop/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/shop/${item.slug}`} className="font-medium hover:underline">
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.slug)}
            aria-label={`Remove ${item.name}`}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-full border border-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => updateQuantity(item.slug, item.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-7 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => updateQuantity(item.slug, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="font-medium">{CAD(item.price * item.quantity)}</span>
        </div>
      </div>
    </div>
  );
}
