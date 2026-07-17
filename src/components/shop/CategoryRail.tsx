"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Category } from "@/lib/types";

export function CategoryRail({ categories }: { categories: Category[] }) {
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
    scrollerRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  return (
    <section>
      <h2 className="mb-4 font-heading text-xl font-semibold sm:text-2xl">Categories</h2>

      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group relative w-32 shrink-0 overflow-hidden rounded-2xl border border-border sm:w-36"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <p className="font-heading text-sm font-medium leading-tight">{category.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {canScrollLeft && (
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 shadow-md backdrop-blur-sm transition-colors hover:bg-background"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            aria-label="Scroll categories right"
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
