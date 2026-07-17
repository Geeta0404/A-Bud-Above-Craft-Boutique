import type { Metadata } from "next";
import { getBrands } from "@/lib/data/products";
import { BrandsGrid } from "@/components/shop/BrandsGrid";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";

export const metadata: Metadata = {
  title: "Brands",
  description: "Shop by your favourite brand.",
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Brands" }]} />
      <BrandsGrid brands={brands} />
    </div>
  );
}
