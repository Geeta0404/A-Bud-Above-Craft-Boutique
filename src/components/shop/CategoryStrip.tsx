"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { cn } from "@/lib/utils";

export function CategoryStrip({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  return (
    <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-7">
        {categories.map((category) => {
          const count = products.filter((p) => p.category === category.slug).length;
          const active = selected.includes(category.slug);
          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => onToggle(category.slug)}
              className={cn(
                "group relative w-32 shrink-0 overflow-hidden rounded-2xl border-2 text-left transition-all sm:w-auto",
                active ? "border-primary shadow-md" : "border-transparent"
              )}
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
                  <p className="mt-0.5 flex items-center gap-0.5 text-[11px] text-white/80">
                    {count} items <ChevronRight className="h-3 w-3" />
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
