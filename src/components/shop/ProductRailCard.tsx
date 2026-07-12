"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { CAD } from "@/lib/constants";
import { formatCbd, formatThc, hasPotencyInfo } from "@/lib/cannabis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export function ProductRailCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="flex w-48 shrink-0 flex-col gap-2 rounded-2xl border border-border bg-card p-2 sm:w-60 lg:w-[calc((100%-4*1rem)/5)]">
      <Link href={`/shop/${product.slug}`} className="img-frame relative block aspect-square overflow-hidden bg-muted">
        <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 1024px) 20vw, 240px" className="object-cover" />
        {product.compareAtPrice && (
          <Badge variant="destructive" className="absolute left-2 top-2 shadow-sm">
            {CAD(product.compareAtPrice - product.price)} off
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 px-1">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{product.brand}</p>
        <Link href={`/shop/${product.slug}`} className="font-heading text-sm font-medium leading-snug hover:text-primary">
          {product.name}
        </Link>
        <div className="flex flex-wrap items-center gap-1">
          <Badge variant="outline">{product.strainType}</Badge>
        </div>
        {hasPotencyInfo(product) && (
          <p className="text-xs text-muted-foreground">
            {formatThc(product)} · {formatCbd(product)}
          </p>
        )}
        <div className="mt-auto flex items-baseline gap-1.5 pt-1 text-sm">
          <span className="text-muted-foreground">{product.size}</span>
          <span>|</span>
          <span className="font-semibold">{CAD(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-muted-foreground line-through">{CAD(product.compareAtPrice)}</span>
          )}
        </div>
        <Button
          size="sm"
          className="mt-1 w-full"
          disabled={!product.inStock}
          onClick={() => {
            addItem({ slug: product.slug, name: product.name, price: product.price, image: product.images[0] });
            toast.success(`${product.name} added to cart`);
          }}
        >
          {product.inStock ? "Add to Cart" : "Sold Out"}
        </Button>
      </div>
    </div>
  );
}
