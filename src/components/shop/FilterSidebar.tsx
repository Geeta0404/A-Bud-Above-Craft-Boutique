"use client";

import { categories } from "@/lib/data/categories";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { CAD } from "@/lib/constants";

export function FilterSidebar({
  selectedCategories,
  onToggleCategory,
  priceRange,
  onPriceRangeChange,
  maxPrice,
}: {
  selectedCategories: string[];
  onToggleCategory: (slug: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
}) {
  return (
    <aside className="space-y-8">
      <div>
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">Category</h3>
        <ul className="mt-4 space-y-3">
          {categories.map((category) => (
            <li key={category.slug} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${category.slug}`}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => onToggleCategory(category.slug)}
              />
              <label htmlFor={`cat-${category.slug}`} className="text-sm">
                {category.name}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">Price Range</h3>
        <div className="mt-4 px-1">
          <Slider
            min={0}
            max={maxPrice}
            step={5}
            value={priceRange}
            onValueChange={(v) => onPriceRangeChange(v as [number, number])}
          />
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>{CAD(priceRange[0])}</span>
            <span>{CAD(priceRange[1])}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
