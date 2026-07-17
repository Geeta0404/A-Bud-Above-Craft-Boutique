"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import type { Category } from "@/lib/types";

export function FeaturedCollections({ categories }: { categories: Category[] }) {
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
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Shop by Collection</p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Featured Collections</h2>
            <p className="mt-2 text-muted-foreground">Explore our full range by category.</p>
          </div>
          <Link
            href="/categories"
            className="group hidden items-center gap-1.5 text-sm font-medium text-primary sm:flex"
          >
            View all categories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>

      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto sm:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category, i) => (
            <Reveal
              key={category.slug}
              delay={i * 0.08}
              className="w-[calc(50%-0.5rem)] shrink-0 sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
            >
              <Link
                href={`/categories/${category.slug}`}
                className="img-frame hover-lift group relative block aspect-[3/4] overflow-hidden"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity group-hover:from-black/80" />
                <span className="absolute bottom-5 left-5 font-heading text-lg font-medium text-white">
                  {category.name}
                </span>
                <span className="absolute bottom-5 right-5 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-white/90 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowRight className="h-4 w-4 text-foreground" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {canScrollLeft && (
          <button
            type="button"
            aria-label="Scroll collections left"
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 shadow-md backdrop-blur-sm transition-colors hover:bg-background"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            aria-label="Scroll collections right"
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
