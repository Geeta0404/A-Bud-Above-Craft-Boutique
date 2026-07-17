"use client";

import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, Trash2, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useProductLookup } from "@/hooks/useProductLookup";
import { CAD, SITE_NAME } from "@/lib/constants";

export function CartDrawer() {
  const { items, isCartOpen, closeCart, setCartOpen, subtotal, removeItem, updateQuantity } = useCart();
  const lookup = useProductLookup(items.map((i) => i.slug));

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" showCloseButton={false} className="flex flex-col gap-0 p-0 sm:max-w-md">
        <SheetTitle className="sr-only">Shopping Cart</SheetTitle>

        <div className="flex items-start justify-between border-b border-border p-5">
          <div>
            <h2 className="font-heading text-lg font-semibold">Shopping Cart</h2>
            <p className="mt-1 text-sm text-muted-foreground">Subtotal: {CAD(subtotal)}</p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <X className="h-4 w-4" /> Close
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-5 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="font-logo text-sm font-bold italic">Ab</span>
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Shopping at</p>
            <p className="text-sm font-semibold">{SITE_NAME}</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="font-heading text-lg font-semibold">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Add something you love to get started.</p>
            <Button onClick={closeCart} asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              {items.map((item) => {
                const product = lookup[item.slug];
                return (
                  <div key={item.slug} className="flex gap-3 border-b border-border py-4 last:border-0">
                    <Link
                      href={`/shop/${item.slug}`}
                      onClick={closeCart}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted"
                    >
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={closeCart}
                        className="text-sm font-semibold leading-snug hover:text-primary"
                      >
                        {item.name}
                      </Link>
                      {product && <p className="text-xs text-muted-foreground">{product.brand}</p>}
                      {product && <p className="text-xs text-muted-foreground">{product.size}</p>}
                      <div className="mt-2 flex items-center gap-3">
                        <select
                          aria-label={`Quantity for ${item.name}`}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.slug, Number(e.target.value))}
                          className="rounded-full border border-border bg-background px-2.5 py-1 text-xs outline-none ring-ring/50 focus-visible:ring-2"
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeItem(item.slug)}
                          aria-label={`Remove ${item.name}`}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold">{CAD(item.price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border p-5">
              <button
                type="button"
                onClick={closeCart}
                className="mb-4 flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                <ChevronLeft className="h-4 w-4" /> Continue Shopping
              </button>
              <div className="flex items-baseline justify-between">
                <span className="font-heading text-base font-semibold">Subtotal</span>
                <span className="font-heading text-lg font-semibold">{CAD(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">*Sales tax will be added at checkout.</p>
              <Button asChild size="lg" className="mt-4 w-full" onClick={closeCart}>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
