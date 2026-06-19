import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data/categories";

export function FeaturedCollections() {
  const featured = categories.slice(0, 4);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-3xl font-semibold">Featured Collections</h2>
          <p className="mt-2 text-muted-foreground">Explore handcrafted goods by category.</p>
        </div>
        <Link href="/categories" className="hidden text-sm font-medium text-primary hover:underline sm:block">
          View all categories →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {featured.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-xl"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span className="absolute bottom-4 left-4 font-heading text-lg font-semibold text-white">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
