"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Tag } from "lucide-react";
import type { BrandSummary } from "@/lib/data/products";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/EmptyState";

export function BrandsGrid({ brands }: { brands: BrandSummary[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((brand) => brand.name.toLowerCase().includes(q));
  }, [brands, query]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Brands</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Browse our full lineup of trusted BC brands, or pick one to see everything they make.
          </p>
        </div>
        <div className="relative w-full max-w-xs sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brands…"
            aria-label="Search brands"
            className="pl-8"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Tag}
            title="No brands found"
            description="Try a different search term."
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="font-heading text-xl font-semibold">{brand.name}</h2>
                <p className="mt-1 text-sm text-white/85">
                  {brand.count} product{brand.count === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
