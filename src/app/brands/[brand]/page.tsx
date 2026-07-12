import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrands, getProductsByBrand } from "@/lib/data/products";
import { CategoryShopClient } from "@/components/shop/CategoryShopClient";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";

export function generateStaticParams() {
  return getBrands().map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const brand = getBrands().find((b) => b.slug === brandSlug);
  if (!brand) return {};
  return { title: brand.name, description: `Shop all products from ${brand.name}.` };
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  const brand = getBrands().find((b) => b.slug === brandSlug);
  if (!brand) notFound();

  const brandProducts = getProductsByBrand(brandSlug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Brands", href: "/brands" }, { label: brand.name }]} />
      <CategoryShopClient
        category={{
          slug: brand.slug,
          name: brand.name,
          description: `${brand.count} product${brand.count === 1 ? "" : "s"} from ${brand.name}.`,
          image: brand.image,
        }}
        products={brandProducts}
      />
    </div>
  );
}
