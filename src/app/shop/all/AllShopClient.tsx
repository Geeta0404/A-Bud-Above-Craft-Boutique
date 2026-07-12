"use client";

import { useSearchParams } from "next/navigation";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { CategoryTabs } from "@/components/shop/CategoryTabs";
import { CategoryShopClient } from "@/components/shop/CategoryShopClient";

const ALL_PRODUCTS_COLLECTION = {
  slug: "",
  name: "Shop All Products",
  description: "Browse flower, pre-rolls, vaporizers, edibles, concentrates, topicals, and beverages.",
  image: products[0].images[0],
};

export function AllShopClient() {
  const searchParams = useSearchParams();

  return (
    <div>
      <div className="mb-8">
        <CategoryTabs activeSlug="" />
      </div>
      <CategoryShopClient
        category={ALL_PRODUCTS_COLLECTION}
        products={products}
        filterableCategories={categories}
        initialQuery={searchParams.get("q") ?? ""}
      />
    </div>
  );
}
