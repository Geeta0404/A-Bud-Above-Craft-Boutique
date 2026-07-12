"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductRailCard } from "@/components/shop/ProductRailCard";

export function ProductRail({
  title,
  products,
  viewAllHref,
}: {
  title: string;
  products: Product[];
  viewAllHref: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [products]);

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    const cardWidth = el?.firstElementChild?.getBoundingClientRect().width ?? 320;
    el?.scrollBy({ left: dir * (cardWidth + 16), behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold sm:text-2xl">{title}</h2>
        <Link href={viewAllHref} className="text-sm font-medium text-primary hover:underline">
          View All
        </Link>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <ProductRailCard key={product.slug} product={product} />
          ))}
        </div>

        {canScrollLeft && (
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 shadow-md backdrop-blur-sm transition-colors hover:bg-background"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 flex size-9 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 shadow-md backdrop-blur-sm transition-colors hover:bg-background"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}
