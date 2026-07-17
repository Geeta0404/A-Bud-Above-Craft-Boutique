"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Product } from "@/lib/types";

export function WishlistPageClient({ products }: { products: Product[] }) {
  const { slugs } = useWishlist();
  const wishlistedProducts = products.filter((p) => slugs.includes(p.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold">Your Wishlist</h1>
      <div className="mt-8">
        {wishlistedProducts.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save pieces you love so you can find them again later."
            actionLabel="Browse the Shop"
            actionHref="/shop"
          />
        ) : (
          <ProductGrid products={wishlistedProducts} />
        )}
      </div>
    </div>
  );
}
