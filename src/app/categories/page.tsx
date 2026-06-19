import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";

export const metadata: Metadata = {
  title: "Shop by Category",
  description: "Browse our handcrafted collections by category — candles, pottery, woodwork, textile art, home décor, and gifts.",
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Categories" }]} />
      <h1 className="font-heading text-3xl font-semibold">Shop by Category</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Every collection is handmade by an independent Canadian artisan or small studio.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="font-heading text-xl font-semibold">{category.name}</h2>
              <p className="mt-1 text-sm text-white/85">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
