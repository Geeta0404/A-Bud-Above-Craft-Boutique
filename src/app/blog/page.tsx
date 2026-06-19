import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/data/blog";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog",
  description: "Care guides, artisan spotlights, and gift ideas from A Bud Above Craft Boutique.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Blog" }]} />
      <h1 className="font-heading text-3xl font-semibold">The Journal</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Care guides, artisan spotlights, and gifting inspiration from A Bud Above.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-xl border border-border bg-card">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <Badge variant="secondary">{post.category}</Badge>
              <h2 className="mt-3 font-heading text-lg font-semibold group-hover:underline">{post.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {post.date} · {post.readTime}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
