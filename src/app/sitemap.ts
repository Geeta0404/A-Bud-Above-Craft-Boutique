import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { blogPosts } from "@/lib/data/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);
  const staticRoutes = [
    "",
    "/shop",
    "/categories",
    "/about",
    "/our-story",
    "/workshops",
    "/blog",
    "/faq",
    "/contact",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/shop/${p.slug}`,
    lastModified: p.createdAt,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${SITE_URL}/categories/${c.slug}`,
    lastModified: new Date(),
  }));

  const blogRoutes = blogPosts.map((b) => ({
    url: `${SITE_URL}/blog/${b.slug}`,
    lastModified: b.date,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes];
}
