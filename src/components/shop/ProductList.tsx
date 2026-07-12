import type { Product } from "@/lib/types";
import { ProductListItem } from "@/components/shop/ProductListItem";
import { EmptyState } from "@/components/shared/EmptyState";
import { PackageSearch } from "lucide-react";

export function ProductList({
  products,
  onClearFilters,
}: {
  products: Product[];
  onClearFilters?: () => void;
}) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No products found"
        description="Try adjusting your filters or search terms to find what you're looking for."
        actionLabel="Clear filters"
        actionHref="/shop"
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {products.map((product) => (
        <ProductListItem key={product.slug} product={product} />
      ))}
    </div>
  );
}
