"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/RatingStars";
import { Badge } from "@/components/ui/badge";
import { CAD } from "@/lib/constants";
import { formatCbd, formatThc, hasPotencyInfo } from "@/lib/cannabis";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function QuickViewDialog({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const wishlisted = has(product.slug);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-hidden p-0 sm:max-w-4xl sm:rounded-2xl">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid max-h-[85vh] grid-cols-1 sm:grid-cols-2">
          <div className="relative h-64 bg-muted sm:h-full">
            <Image src={product.images[0]} alt={product.name} fill sizes="50vw" className="object-cover" />
            {product.isBestSeller && (
              <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Best Seller
              </span>
            )}
          </div>
          <div className="flex flex-col overflow-y-auto p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.brand}</p>
            <h2 className="mt-1 font-heading text-2xl font-medium">{product.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline">{product.strainType}</Badge>
              {hasPotencyInfo(product) && (
                <span className="text-xs text-muted-foreground">
                  {formatThc(product)} · {formatCbd(product)}
                </span>
              )}
            </div>
            <RatingStars rating={product.rating} className="mt-2" />
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-semibold">{CAD(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-muted-foreground line-through">{CAD(product.compareAtPrice)}</span>
              )}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{product.description}</p>

            <div className="mt-6 flex gap-2">
              <Button
                className="flex-1"
                disabled={!product.inStock}
                onClick={() => {
                  addItem({ slug: product.slug, name: product.name, price: product.price, image: product.images[0] });
                  toast.success(`${product.name} added to cart`);
                }}
              >
                {product.inStock ? "Add to Cart" : "Sold Out"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                onClick={() => {
                  toggle(product.slug);
                  toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
                }}
              >
                <Heart className={cn("h-4 w-4", wishlisted && "fill-primary text-primary")} />
              </Button>
            </div>
            <Link
              href={`/shop/${product.slug}`}
              className="mt-4 text-center text-sm font-medium text-primary hover:underline"
              onClick={() => onOpenChange(false)}
            >
              View Full Details →
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
