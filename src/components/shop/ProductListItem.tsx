"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { CAD, discountPercent } from "@/lib/constants";
import { formatCbd, formatThc, hasPotencyInfo } from "@/lib/cannabis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/RatingStars";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ProductListItem({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const wishlisted = has(product.slug);

  return (
    <div className="hover-lift group flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-3 sm:flex-nowrap sm:p-4">
      <Link href={`/shop/${product.slug}`} className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-24">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute left-1.5 top-1.5 flex flex-col gap-1">
          {product.isBestSeller && (
            <Badge className="bg-primary text-[10px] text-primary-foreground shadow-sm">Best Seller</Badge>
          )}
          {product.compareAtPrice && (
            <Badge variant="destructive" className="text-[10px] shadow-sm">
              Save {discountPercent(product.price, product.compareAtPrice)}%
            </Badge>
          )}
        </div>
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.brand}</p>
        <Link
          href={`/shop/${product.slug}`}
          className="font-heading text-base font-medium leading-snug hover:text-primary"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Badge variant="outline">{product.strainType}</Badge>
          {hasPotencyInfo(product) && (
            <span className="text-xs text-muted-foreground">
              {formatThc(product)} · {formatCbd(product)}
            </span>
          )}
        </div>
        <RatingStars rating={product.rating} className="mt-1" />
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold">{CAD(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">{CAD(product.compareAtPrice)}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              toggle(product.slug);
              toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
            }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="rounded-full border border-border p-2 transition-all hover:scale-110 hover:bg-muted"
          >
            <Heart className={cn("h-4 w-4 transition-colors", wishlisted ? "fill-primary text-primary" : "text-foreground")} />
          </button>
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
    </div>
  );
}
