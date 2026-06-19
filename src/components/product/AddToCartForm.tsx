"use client";

import { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AddToCartForm({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const wishlisted = has(product.slug);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-full border border-border">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-10 w-10 items-center justify-center"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center text-sm font-medium" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQuantity((q) => q + 1)}
          className="flex h-10 w-10 items-center justify-center"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Button
        size="lg"
        disabled={!product.inStock}
        onClick={() => {
          addItem(
            { slug: product.slug, name: product.name, price: product.price, image: product.images[0] },
            quantity
          );
          toast.success(`${product.name} added to cart`);
        }}
      >
        {product.inStock ? "Add to Cart" : "Sold Out"}
      </Button>

      <Button
        size="lg"
        variant="outline"
        onClick={() => {
          toggle(product.slug);
          toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
        }}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={cn("mr-2 h-4 w-4", wishlisted && "fill-primary text-primary")} />
        {wishlisted ? "Saved" : "Save"}
      </Button>
    </div>
  );
}
