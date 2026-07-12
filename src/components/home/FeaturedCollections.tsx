import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { Reveal } from "@/components/shared/Reveal";

export function FeaturedCollections() {
  const featured = categories.slice(0, 4);
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Shop by Collection</p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Featured Collections</h2>
            <p className="mt-2 text-muted-foreground">Explore our full range by category.</p>
          </div>
          <Link
            href="/categories"
            className="group hidden items-center gap-1.5 text-sm font-medium text-primary sm:flex"
          >
            View all categories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {featured.map((category, i) => (
          <Reveal key={category.slug} delay={i * 0.08}>
            <Link
              href={`/categories/${category.slug}`}
              className="img-frame hover-lift group relative block aspect-[3/4] overflow-hidden"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity group-hover:from-black/80" />
              <span className="absolute bottom-5 left-5 font-heading text-lg font-medium text-white">
                {category.name}
              </span>
              <span className="absolute bottom-5 right-5 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-white/90 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowRight className="h-4 w-4 text-foreground" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
