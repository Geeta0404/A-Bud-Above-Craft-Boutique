import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/data/categories";
import { getAllProducts } from "@/lib/data/products";
import { CategoryTabs } from "@/components/shop/CategoryTabs";
import { CategoryShopClient } from "@/components/shop/CategoryShopClient";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return { title: category.name, description: category.description };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const categoryProducts = products.filter((p) => p.category === category.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Categories", href: "/categories" }, { label: category.name }]} />
      <div className="mb-8">
        <CategoryTabs activeSlug={category.slug} categories={categories} />
      </div>
      <CategoryShopClient category={category} products={categoryProducts} />
    </div>
  );
}
