import type { Metadata } from "next";
import { getNewArrivals } from "@/lib/data/products";
import { CategoryShopClient } from "@/components/shop/CategoryShopClient";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The newest products to land on our shelves.",
};

const NEW_ARRIVALS_COLLECTION = {
  slug: "new-arrivals",
  name: "New Arrivals",
  description: "The newest products to land on our shelves.",
  image: IMG.flowerBud3,
};

export default async function NewArrivalsPage() {
  const newArrivals = await getNewArrivals(Number.MAX_SAFE_INTEGER);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: "New Arrivals" }]} />
      <CategoryShopClient category={NEW_ARRIVALS_COLLECTION} products={newArrivals} defaultSort="newest" />
    </div>
  );
}
