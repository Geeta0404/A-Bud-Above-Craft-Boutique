"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CategorySortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "thc-desc"
  | "thc-asc"
  | "name-asc";

const options: { value: CategorySortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "thc-desc", label: "THC: High to Low" },
  { value: "thc-asc", label: "THC: Low to High" },
  { value: "name-asc", label: "Name: A-Z" },
];

export function CategorySortDropdown({
  value,
  onChange,
}: {
  value: CategorySortOption;
  onChange: (v: CategorySortOption) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as CategorySortOption)}>
      <SelectTrigger className="w-44" aria-label="Sort products">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
