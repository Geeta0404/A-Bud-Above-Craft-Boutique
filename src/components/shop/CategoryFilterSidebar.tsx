"use client";

import { useState } from "react";
import type { Category, Product } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CAD } from "@/lib/constants";
import { EFFECTS_OPTIONS } from "@/lib/cannabis";
import { slugify } from "@/lib/utils";

const CATEGORY_PAGE_SIZE = 6;
const BRAND_PAGE_SIZE = 6;
const EFFECTS_PAGE_SIZE = 6;
const ALL_SECTIONS = ["category", "sale", "brand", "strain", "price", "potency", "effects"];

export type CategoryFilters = {
  categories: string[];
  brands: string[];
  strainTypes: string[];
  onSaleOnly: boolean;
  priceRange: [number, number];
  thcRange: [number, number];
  cbdRange: [number, number];
  effects: string[];
};

export function CategoryFilterSidebar({
  products,
  filters,
  onToggleCategory,
  onToggleBrand,
  onToggleStrainType,
  onToggleOnSale,
  onToggleEffect,
  onPriceRangeChange,
  onThcRangeChange,
  onCbdRangeChange,
  bounds,
  onClearAll,
  hasActiveFilters,
  hideOnSaleFilter = false,
  filterableCategories,
}: {
  products: Product[];
  filters: CategoryFilters;
  onToggleCategory?: (slug: string) => void;
  onToggleBrand: (brand: string) => void;
  onToggleStrainType: (strain: string) => void;
  onToggleOnSale: () => void;
  onToggleEffect: (effect: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onThcRangeChange: (range: [number, number]) => void;
  onCbdRangeChange: (range: [number, number]) => void;
  bounds: {
    minPrice: number;
    maxPrice: number;
    maxThc: number;
    hasThc: boolean;
    maxCbd: number;
    hasCbd: boolean;
  };
  onClearAll: () => void;
  hasActiveFilters: boolean;
  hideOnSaleFilter?: boolean;
  filterableCategories?: Category[];
}) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllEffects, setShowAllEffects] = useState(false);

  const strainCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  const brandCounts = new Map<string, number>();
  for (const p of products) {
    strainCounts.set(p.strainType, (strainCounts.get(p.strainType) ?? 0) + 1);
    categoryCounts.set(p.category, (categoryCounts.get(p.category) ?? 0) + 1);
    brandCounts.set(p.brand, (brandCounts.get(p.brand) ?? 0) + 1);
  }
  const strainTypes = [...strainCounts.keys()].sort();
  const saleCount = products.filter((p) => p.compareAtPrice).length;

  const visibleCategories = filterableCategories
    ? showAllCategories
      ? filterableCategories
      : filterableCategories.slice(0, CATEGORY_PAGE_SIZE)
    : [];

  const allBrands = [...brandCounts.keys()]
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ name, slug: slugify(name), count: brandCounts.get(name)! }));
  const visibleBrands = showAllBrands ? allBrands : allBrands.slice(0, BRAND_PAGE_SIZE);
  const visibleEffects = showAllEffects ? EFFECTS_OPTIONS : EFFECTS_OPTIONS.slice(0, EFFECTS_PAGE_SIZE);

  return (
    <aside>
      <div className="flex items-center justify-between pb-2">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">Filters</h3>
        {hasActiveFilters && (
          <button type="button" onClick={onClearAll} className="text-xs font-medium text-primary hover:underline">
            Clear all
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={ALL_SECTIONS}>
        {filterableCategories && filterableCategories.length > 0 && onToggleCategory && (
          <AccordionItem value="category">
            <AccordionTrigger className="font-heading text-sm font-semibold uppercase tracking-wide">
              Category
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3">
                {visibleCategories.map((category) => (
                  <li key={category.slug} className="flex items-center gap-2">
                    <Checkbox
                      id={`category-${category.slug}`}
                      checked={filters.categories.includes(category.slug)}
                      onCheckedChange={() => onToggleCategory(category.slug)}
                    />
                    <label htmlFor={`category-${category.slug}`} className="flex-1 text-sm">
                      {category.name}
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {categoryCounts.get(category.slug) ?? 0}
                    </span>
                  </li>
                ))}
              </ul>
              {filterableCategories.length > CATEGORY_PAGE_SIZE && (
                <button
                  type="button"
                  onClick={() => setShowAllCategories((v) => !v)}
                  className="mt-3 text-xs font-medium text-primary hover:underline"
                >
                  {showAllCategories ? "View Less" : "View More"}
                </button>
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        {!hideOnSaleFilter && saleCount > 0 && (
          <AccordionItem value="sale">
            <AccordionTrigger className="font-heading text-sm font-semibold uppercase tracking-wide">
              Deals
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center gap-2">
                <Checkbox id="on-sale" checked={filters.onSaleOnly} onCheckedChange={onToggleOnSale} />
                <label htmlFor="on-sale" className="flex-1 text-sm">
                  On Sale
                </label>
                <span className="text-xs text-muted-foreground">{saleCount}</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {allBrands.length > 0 && (
          <AccordionItem value="brand">
            <AccordionTrigger className="font-heading text-sm font-semibold uppercase tracking-wide">
              Brand
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3">
                {visibleBrands.map((brand) => (
                  <li key={brand.slug} className="flex items-center gap-2">
                    <Checkbox
                      id={`brand-${brand.slug}`}
                      checked={filters.brands.includes(brand.name)}
                      onCheckedChange={() => onToggleBrand(brand.name)}
                    />
                    <label htmlFor={`brand-${brand.slug}`} className="flex-1 text-sm">
                      {brand.name}
                    </label>
                    <span className="text-xs text-muted-foreground">{brand.count}</span>
                  </li>
                ))}
              </ul>
              {allBrands.length > BRAND_PAGE_SIZE && (
                <button
                  type="button"
                  onClick={() => setShowAllBrands((v) => !v)}
                  className="mt-3 text-xs font-medium text-primary hover:underline"
                >
                  {showAllBrands ? "View Less" : "View More"}
                </button>
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        {strainTypes.length > 1 && (
          <AccordionItem value="strain">
            <AccordionTrigger className="font-heading text-sm font-semibold uppercase tracking-wide">
              Strain Type
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3">
                {strainTypes.map((strain) => (
                  <li key={strain} className="flex items-center gap-2">
                    <Checkbox
                      id={`strain-${strain}`}
                      checked={filters.strainTypes.includes(strain)}
                      onCheckedChange={() => onToggleStrainType(strain)}
                    />
                    <label htmlFor={`strain-${strain}`} className="flex-1 text-sm">
                      {strain}
                    </label>
                    <span className="text-xs text-muted-foreground">{strainCounts.get(strain)}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="price">
          <AccordionTrigger className="font-heading text-sm font-semibold uppercase tracking-wide">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-1">
              <Slider
                min={bounds.minPrice}
                max={bounds.maxPrice}
                step={1}
                value={filters.priceRange}
                onValueChange={(v) => onPriceRangeChange(v as [number, number])}
              />
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>{CAD(filters.priceRange[0])}</span>
                <span>{CAD(filters.priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {(bounds.hasThc || bounds.hasCbd) && (
          <AccordionItem value="potency">
            <AccordionTrigger className="font-heading text-sm font-semibold uppercase tracking-wide">
              Potency
            </AccordionTrigger>
            <AccordionContent>
              {bounds.hasThc && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">THC</p>
                  <div className="mt-2 px-1">
                    <Slider
                      min={0}
                      max={bounds.maxThc}
                      step={1}
                      value={filters.thcRange}
                      onValueChange={(v) => onThcRangeChange(v as [number, number])}
                    />
                    <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                      <span>{filters.thcRange[0]}%</span>
                      <span>{filters.thcRange[1]}%</span>
                    </div>
                  </div>
                </div>
              )}

              {bounds.hasCbd && (
                <div className={bounds.hasThc ? "mt-4" : undefined}>
                  <p className="text-xs font-medium text-muted-foreground">CBD</p>
                  <div className="mt-2 px-1">
                    <Slider
                      min={0}
                      max={bounds.maxCbd}
                      step={1}
                      value={filters.cbdRange}
                      onValueChange={(v) => onCbdRangeChange(v as [number, number])}
                    />
                    <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                      <span>{filters.cbdRange[0]}%</span>
                      <span>{filters.cbdRange[1]}%</span>
                    </div>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="effects">
          <AccordionTrigger className="font-heading text-sm font-semibold uppercase tracking-wide">
            Effects
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-3">
              {visibleEffects.map((effect) => (
                <li key={effect} className="flex items-center gap-2">
                  <Checkbox
                    id={`effect-${effect}`}
                    checked={filters.effects.includes(effect)}
                    onCheckedChange={() => onToggleEffect(effect)}
                  />
                  <label htmlFor={`effect-${effect}`} className="flex-1 text-sm">
                    {effect}
                  </label>
                </li>
              ))}
            </ul>
            {EFFECTS_OPTIONS.length > EFFECTS_PAGE_SIZE && (
              <button
                type="button"
                onClick={() => setShowAllEffects((v) => !v)}
                className="mt-3 text-xs font-medium text-primary hover:underline"
              >
                {showAllEffects ? "View Less" : "View More"}
              </button>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
