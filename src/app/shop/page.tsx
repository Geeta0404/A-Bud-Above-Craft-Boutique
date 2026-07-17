import type { Metadata } from "next";
import Link from "next/link";
import { PromoCarousel } from "@/components/shop/PromoCarousel";
import { CategoryRail } from "@/components/shop/CategoryRail";
import { ProductRail } from "@/components/shop/ProductRail";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/data/categories";
import { getAllProducts, getBestSellers, getNewArrivals } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Premium flower, pre-rolls, vapes, edibles, concentrates, topicals, and beverages from trusted BC brands.",
};

export default async function ShopPage() {
  const [bestSellers, newArrivals, products, categories] = await Promise.all([
    getBestSellers(8),
    getNewArrivals(8),
    getAllProducts(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      <PromoCarousel />
      <CategoryRail categories={categories} />

      <ProductRail title="Best Sellers" products={bestSellers} viewAllHref="/shop/best-sellers" />
      <ProductRail title="New Arrivals" products={newArrivals} viewAllHref="/shop/new-arrivals" />

      {categories.map((category) => (
        <ProductRail
          key={category.slug}
          title={`Popular ${category.name}`}
          products={products.filter((p) => p.category === category.slug)}
          viewAllHref={`/categories/${category.slug}`}
        />
      ))}

      <div className="flex justify-center pt-4">
        <Button size="lg" asChild>
          <Link href="/shop/all">Shop All Products</Link>
        </Button>
      </div>
    </div>
  );
}
