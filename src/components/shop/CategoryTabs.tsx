"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function CategoryTabs({ activeSlug, categories }: { activeSlug: string; categories: Category[] }) {
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
    scrollerRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  const tabs = [{ slug: "", name: "All" }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))];

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const active = tab.slug === activeSlug;
          return (
            <Link
              key={tab.slug || "all"}
              href={tab.slug ? `/categories/${tab.slug}` : "/shop/all"}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted"
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll categories left"
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 shadow-md backdrop-blur-sm transition-colors hover:bg-background"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll categories right"
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 flex size-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 shadow-md backdrop-blur-sm transition-colors hover:bg-background"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
