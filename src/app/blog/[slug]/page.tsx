import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug } from "@/lib/data/blog";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { SITE_URL } from "@/lib/constants";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [post.image] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          image: [post.image],
          author: { "@type": "Organization", name: post.author },
          datePublished: post.date,
          url: `${SITE_URL}/blog/${post.slug}`,
        }}
      />
      <PageBreadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
      <h1 className="font-heading text-3xl font-semibold sm:text-4xl">{post.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {post.author} · {post.date} · {post.readTime}
      </p>
      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
        <Image src={post.image} alt={post.title} fill sizes="100vw" className="object-cover" />
      </div>
      <div className="prose prose-neutral mt-8 max-w-none space-y-4 text-foreground/90">
        {post.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
