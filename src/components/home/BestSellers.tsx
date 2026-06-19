import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBestSellers } from "@/lib/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/shared/Reveal";

export function BestSellers() {
  const products = getBestSellers(4);
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Customer Favourites</p>
            <h2 className="mt-2 font-heading text-3xl font-medium italic sm:text-4xl">Best Sellers</h2>
            <p className="mt-2 text-muted-foreground">Loved again and again by our customers.</p>
          </div>
          <Link
            href="/shop?sort=popularity"
            className="group hidden items-center gap-1.5 text-sm font-medium text-primary sm:flex"
          >
            Shop best sellers
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product, i) => (
          <Reveal key={product.slug} delay={i * 0.08}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
