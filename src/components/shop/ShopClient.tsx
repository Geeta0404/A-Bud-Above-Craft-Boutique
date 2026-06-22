"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { products } from "@/lib/data/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CategoryStrip } from "@/components/shop/CategoryStrip";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { SortDropdown, type SortOption } from "@/components/shop/SortDropdown";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";

const MAX_PRICE = Math.max(...products.map((p) => p.price));
const PAGE_SIZE = 6;

export function ShopClient({ initialCategory }: { initialCategory?: string }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(query, 250);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "popularity"
  );

  const toggleCategory = (slug: string) =>
    setSelectedCategories((prev) => (prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]));

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.category));
    }

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
      default:
        list = [...list].sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
    }

    return list;
  }, [selectedCategories, priceRange, debouncedQuery, sort]);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filtered]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filtered.length]);

  const visibleProducts = filtered.slice(0, visibleCount);

  const filterPanel = (
    <FilterSidebar
      selectedCategories={selectedCategories}
      onToggleCategory={toggleCategory}
      priceRange={priceRange}
      onPriceRangeChange={setPriceRange}
      maxPrice={MAX_PRICE}
    />
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold">Shop All</h1>
        <p className="mt-2 text-muted-foreground">{filtered.length} handcrafted pieces</p>
      </div>

      <div className="mb-8">
        <CategoryStrip selected={selectedCategories} onToggle={toggleCategory} />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
            className="pl-8"
          />
        </div>
        <SortDropdown value={sort} onChange={setSort} />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="px-4">{filterPanel}</div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">{filterPanel}</div>
        <div>
          <ProductGrid products={visibleProducts} />
          {visibleCount < filtered.length && (
            <div ref={sentinelRef} className="h-10 w-full" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}
