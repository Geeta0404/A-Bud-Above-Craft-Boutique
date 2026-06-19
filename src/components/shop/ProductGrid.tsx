import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { PackageSearch } from "lucide-react";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No products found"
        description="Try adjusting your filters or search terms to find what you're looking for."
        actionLabel="Clear filters"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 items-stretch gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
