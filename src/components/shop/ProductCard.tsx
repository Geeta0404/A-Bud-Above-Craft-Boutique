"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Eye } from "lucide-react";
import type { Product } from "@/lib/types";
import { CAD } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/RatingStars";
import { QuickViewDialog } from "@/components/shop/QuickViewDialog";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const wishlisted = has(product.slug);

  return (
    <div className="hover-lift group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <Link href={`/shop/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isBestSeller && (
            <Badge className="bg-primary text-primary-foreground shadow-sm">Best Seller</Badge>
          )}
          {product.isNew && (
            <Badge variant="secondary" className="shadow-sm">
              New
            </Badge>
          )}
          {product.compareAtPrice && (
            <Badge variant="destructive" className="shadow-sm">
              Sale
            </Badge>
          )}
        </div>

        <div className="absolute inset-x-3 bottom-3 flex translate-y-2 justify-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setQuickViewOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-full bg-background/95 px-4 py-2 text-xs font-medium shadow-md transition-colors hover:bg-background"
          >
            <Eye className="h-3.5 w-3.5" /> Quick View
          </button>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => {
          toggle(product.slug);
          toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
        }}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-3 top-3 rounded-full bg-background/90 p-2 shadow-sm transition-all hover:scale-110 hover:bg-background"
      >
        <Heart className={cn("h-4 w-4 transition-colors", wishlisted ? "fill-primary text-primary" : "text-foreground")} />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.artisan}</p>
        <Link href={`/shop/${product.slug}`} className="font-heading text-base font-medium leading-snug hover:text-primary">
          {product.name}
        </Link>
        <RatingStars rating={product.rating} />
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold">{CAD(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">{CAD(product.compareAtPrice)}</span>
            )}
          </div>
          <Button
            size="sm"
            onClick={() => {
              addItem({ slug: product.slug, name: product.name, price: product.price, image: product.images[0] });
              toast.success(`${product.name} added to cart`);
            }}
            disabled={!product.inStock}
          >
            {product.inStock ? "Add to Cart" : "Sold Out"}
          </Button>
        </div>
      </div>

      <QuickViewDialog product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </div>
  );
}
