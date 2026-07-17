"use client";

import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { ProductCard } from "@/components/shop/ProductCard";
import type { Product } from "@/lib/types";

export function RecentlyViewed({ products, excludeSlug }: { products: Product[]; excludeSlug?: string }) {
  const slugs = useRecentlyViewed().filter((s) => s !== excludeSlug);
  const viewed = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  if (viewed.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-heading text-2xl font-bold">Recently Viewed</h2>
      <div className="mt-6 grid grid-cols-2 items-stretch gap-4 sm:gap-6 lg:grid-cols-4">
        {viewed.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
