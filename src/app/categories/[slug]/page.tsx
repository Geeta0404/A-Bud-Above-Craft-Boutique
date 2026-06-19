import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return { title: category.name, description: category.description };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const categoryProducts = products.filter((p) => p.category === category.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Categories", href: "/categories" }, { label: category.name }]} />
      <h1 className="font-heading text-3xl font-semibold">{category.name}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>
      <div className="mt-8">
        <ProductGrid products={categoryProducts} />
      </div>
    </div>
  );
}
