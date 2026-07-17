import type { Metadata } from "next";
import { Suspense } from "react";
import { AllShopClient } from "@/app/shop/all/AllShopClient";
import { getAllProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse flower, pre-rolls, vaporizers, edibles, concentrates, topicals, and beverages.",
};

export default async function ShopAllPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Suspense>
        <AllShopClient products={products} categories={categories} />
      </Suspense>
    </div>
  );
}
