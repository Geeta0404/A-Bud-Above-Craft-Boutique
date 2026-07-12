"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductList } from "@/components/shop/ProductList";
import { ViewToggle, type ViewMode } from "@/components/shop/ViewToggle";
import { CategoryFilterSidebar, type CategoryFilters } from "@/components/shop/CategoryFilterSidebar";
import { CategorySortDropdown, type CategorySortOption } from "@/components/shop/CategorySortDropdown";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { getEffects } from "@/lib/cannabis";

const PAGE_SIZE = 9;

export function CategoryShopClient({
  category,
  products,
  defaultSort = "featured",
  hideOnSaleFilter = false,
  filterableCategories,
  initialQuery = "",
}: {
  category: Category;
  products: Product[];
  defaultSort?: CategorySortOption;
  hideOnSaleFilter?: boolean;
  filterableCategories?: Category[];
  initialQuery?: string;
}) {
  const bounds = useMemo(() => {
    const prices = products.map((p) => p.price);
    const thcValues = products.map((p) => p.thcMax);
    const cbdValues = products.map((p) => p.cbdMax);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
      maxThc: Math.ceil(Math.max(...thcValues, 0)),
      hasThc: thcValues.some((t) => t > 0),
      maxCbd: Math.ceil(Math.max(...cbdValues, 0)),
      hasCbd: cbdValues.some((c) => c > 0),
    };
  }, [products]);

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 250);
  const [filters, setFilters] = useState<CategoryFilters>({
    categories: [],
    brands: [],
    strainTypes: [],
    onSaleOnly: false,
    priceRange: [bounds.minPrice, bounds.maxPrice],
    thcRange: [0, bounds.maxThc],
    cbdRange: [0, bounds.maxCbd],
    effects: [],
  });
  const [sort, setSort] = useState<CategorySortOption>(defaultSort);
  const [view, setView] = useState<ViewMode>("list");

  const toggleCategory = (slug: string) =>
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(slug) ? f.categories.filter((c) => c !== slug) : [...f.categories, slug],
    }));

  const toggleBrand = (brand: string) =>
    setFilters((f) => ({
      ...f,
      brands: f.brands.includes(brand) ? f.brands.filter((b) => b !== brand) : [...f.brands, brand],
    }));

  const toggleStrainType = (strain: string) =>
    setFilters((f) => ({
      ...f,
      strainTypes: f.strainTypes.includes(strain)
        ? f.strainTypes.filter((s) => s !== strain)
        : [...f.strainTypes, strain],
    }));

  const toggleOnSale = () => setFilters((f) => ({ ...f, onSaleOnly: !f.onSaleOnly }));

  const toggleEffect = (effect: string) =>
    setFilters((f) => ({
      ...f,
      effects: f.effects.includes(effect) ? f.effects.filter((e) => e !== effect) : [...f.effects, effect],
    }));

  const clearAll = () =>
    setFilters({
      categories: [],
      brands: [],
      strainTypes: [],
      onSaleOnly: false,
      priceRange: [bounds.minPrice, bounds.maxPrice],
      thcRange: [0, bounds.maxThc],
      cbdRange: [0, bounds.maxCbd],
      effects: [],
    });

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.strainTypes.length > 0 ||
    filters.onSaleOnly ||
    filters.effects.length > 0 ||
    filters.priceRange[0] !== bounds.minPrice ||
    filters.priceRange[1] !== bounds.maxPrice ||
    filters.thcRange[0] !== 0 ||
    filters.thcRange[1] !== bounds.maxThc ||
    filters.cbdRange[0] !== 0 ||
    filters.cbdRange[1] !== bounds.maxCbd;

  // Products matching only the search query — used to keep sidebar facet counts
  // honest about what's actually available, instead of the full unfiltered catalog.
  const searchScopedProducts = useMemo(() => {
    if (!debouncedQuery.trim()) return products;
    const q = debouncedQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }, [products, debouncedQuery]);

  const filtered = useMemo(() => {
    let list = searchScopedProducts.filter(
      (p) =>
        p.price >= filters.priceRange[0] &&
        p.price <= filters.priceRange[1] &&
        p.thcMax >= filters.thcRange[0] &&
        p.thcMax <= filters.thcRange[1] &&
        p.cbdMax >= filters.cbdRange[0] &&
        p.cbdMax <= filters.cbdRange[1]
    );

    if (filters.categories.length > 0) {
      list = list.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.brands.length > 0) {
      list = list.filter((p) => filters.brands.includes(p.brand));
    }
    if (filters.strainTypes.length > 0) {
      list = list.filter((p) => filters.strainTypes.includes(p.strainType));
    }
    if (filters.onSaleOnly) {
      list = list.filter((p) => p.compareAtPrice);
    }
    if (filters.effects.length > 0) {
      list = list.filter((p) => getEffects(p).some((e) => filters.effects.includes(e)));
    }

    switch (sort) {
      case "newest":
        list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "thc-desc":
        list = [...list].sort((a, b) => b.thcMax - a.thcMax);
        break;
      case "thc-asc":
        list = [...list].sort((a, b) => a.thcMax - b.thcMax);
        break;
      case "name-asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list = [...list].sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
    }

    return list;
  }, [searchScopedProducts, filters, sort]);

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
    <CategoryFilterSidebar
      products={searchScopedProducts}
      filters={filters}
      filterableCategories={filterableCategories}
      onToggleCategory={toggleCategory}
      onToggleBrand={toggleBrand}
      onToggleStrainType={toggleStrainType}
      onToggleOnSale={toggleOnSale}
      onToggleEffect={toggleEffect}
      onPriceRangeChange={(v) => setFilters((f) => ({ ...f, priceRange: v }))}
      onThcRangeChange={(v) => setFilters((f) => ({ ...f, thcRange: v }))}
      onCbdRangeChange={(v) => setFilters((f) => ({ ...f, cbdRange: v }))}
      bounds={bounds}
      onClearAll={clearAll}
      hasActiveFilters={hasActiveFilters}
      hideOnSaleFilter={hideOnSaleFilter}
    />
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold">{category.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} products</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${category.name.toLowerCase()}…`}
            aria-label="Search products"
            className="pl-8"
          />
        </div>
        <CategorySortDropdown value={sort} onChange={setSort} />
        <ViewToggle value={view} onChange={setView} />
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
            <div className="px-4 pb-6">{filterPanel}</div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">{filterPanel}</div>
        <div>
          {view === "grid" ? (
            <ProductGrid products={visibleProducts} onClearFilters={clearAll} />
          ) : (
            <ProductList products={visibleProducts} onClearFilters={clearAll} />
          )}
          {visibleCount < filtered.length && (
            <div ref={sentinelRef} className="h-10 w-full" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}
