import type { Metadata } from "next";
import { getSpecials } from "@/lib/data/products";
import { CategoryShopClient } from "@/components/shop/CategoryShopClient";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Specials",
  description: "Today's deals, promotional offers, and discounted products.",
};

const SPECIALS_COLLECTION = {
  slug: "specials",
  name: "Specials",
  description: "Today's deals, promotional offers, and discounted products.",
  image: IMG.flowerBud2,
};

export default async function SpecialsPage() {
  const specials = await getSpecials();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Specials" }]} />
      <CategoryShopClient category={SPECIALS_COLLECTION} products={specials} hideOnSaleFilter />
    </div>
  );
}
