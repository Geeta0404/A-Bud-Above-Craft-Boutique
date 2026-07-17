"use client";

import { useSearchParams } from "next/navigation";
import { CategoryTabs } from "@/components/shop/CategoryTabs";
import { CategoryShopClient } from "@/components/shop/CategoryShopClient";
import type { Category, Product } from "@/lib/types";

export function AllShopClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const searchParams = useSearchParams();

  const allProductsCollection = {
    slug: "",
    name: "Shop All Products",
    description: "Browse flower, pre-rolls, vaporizers, edibles, concentrates, topicals, and beverages.",
    image: products[0]?.images[0] ?? "",
  };

  return (
    <div>
      <div className="mb-8">
        <CategoryTabs activeSlug="" categories={categories} />
      </div>
      <CategoryShopClient
        category={allProductsCollection}
        products={products}
        filterableCategories={categories}
        initialQuery={searchParams.get("q") ?? ""}
      />
    </div>
  );
}
