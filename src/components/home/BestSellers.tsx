import Link from "next/link";
import { getBestSellers } from "@/lib/data/products";
import { ProductCard } from "@/components/shop/ProductCard";

export function BestSellers() {
  const products = getBestSellers(4);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-3xl font-semibold">Best Sellers</h2>
          <p className="mt-2 text-muted-foreground">Loved again and again by our customers.</p>
        </div>
        <Link href="/shop?sort=popularity" className="hidden text-sm font-medium text-primary hover:underline sm:block">
          Shop best sellers →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
