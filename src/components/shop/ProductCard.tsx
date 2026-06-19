"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { CAD } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/RatingStars";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const wishlisted = has(product.slug);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
      <Link href={`/shop/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.isBestSeller && (
          <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">Best Seller</Badge>
        )}
        {product.isNew && (
          <Badge variant="secondary" className="absolute left-3 top-3">
            New
          </Badge>
        )}
      </Link>
      <button
        type="button"
        onClick={() => {
          toggle(product.slug);
          toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
        }}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-3 top-3 rounded-full bg-background/90 p-2 shadow-sm transition-colors hover:bg-background"
      >
        <Heart className={cn("h-4 w-4", wishlisted ? "fill-primary text-primary" : "text-foreground")} />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.artisan}</p>
        <Link href={`/shop/${product.slug}`} className="font-heading text-base font-semibold leading-snug hover:underline">
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
    </div>
  );
}
