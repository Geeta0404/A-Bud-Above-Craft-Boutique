import type { Metadata } from "next";
import { getBestSellers } from "@/lib/data/products";
import { CategoryShopClient } from "@/components/shop/CategoryShopClient";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Best Sellers",
  description: "Customer favourites, tried and true.",
};

const BEST_SELLERS_COLLECTION = {
  slug: "best-sellers",
  name: "Best Sellers",
  description: "Customer favourites, tried and true.",
  image: IMG.flowerBud1,
};

export default function BestSellersPage() {
  const bestSellers = getBestSellers(Number.MAX_SAFE_INTEGER);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: "Best Sellers" }]} />
      <CategoryShopClient category={BEST_SELLERS_COLLECTION} products={bestSellers} defaultSort="featured" />
    </div>
  );
}
