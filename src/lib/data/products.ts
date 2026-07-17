import type { Product, Review, StrainType } from "@/lib/types";
import { ProductRepository } from "@/repositories/ProductRepository";
import { BrandRepository } from "@/repositories/BrandRepository";
import { ReviewRepository } from "@/repositories/ReviewRepository";
import type { Product as DbProduct } from "@/types/catalog";

function mapReview(review: Awaited<ReturnType<typeof ReviewRepository.listByProduct>>["items"][number]): Review {
  return {
    id: String(review.id),
    author: review.authorName ?? "Anonymous",
    rating: review.rating,
    date: review.createdAt.slice(0, 10),
    title: review.title ?? "",
    body: review.body ?? "",
  };
}

async function mapProduct(p: DbProduct, reviews: Review[] = []): Promise<Product> {
  return {
    slug: p.slug,
    name: p.name,
    category: p.categorySlug ?? "",
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? undefined,
    description: p.description ?? "",
    longDescription: p.longDescription ?? "",
    images: (p.images ?? []).map((img) => img.imageUrl),
    brand: p.brandName ?? "",
    rating: p.rating,
    reviewCount: p.reviewCount,
    reviews,
    tags: p.tags,
    inStock: p.stockQuantity > 0,
    isBestSeller: p.isBestSeller,
    isNew: p.isNew,
    isSeasonal: p.isSeasonal,
    createdAt: p.createdAt.slice(0, 10),
    strainType: (p.strainType ?? "Blend") as StrainType,
    thcMin: p.thcMin ?? 0,
    thcMax: p.thcMax ?? 0,
    thcUnit: p.thcUnit ?? "%",
    cbdMin: p.cbdMin ?? 0,
    cbdMax: p.cbdMax ?? 0,
    cbdUnit: p.cbdUnit ?? "%",
    size: p.size ?? "",
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const { items } = await ProductRepository.list({ limit: 100 });
  return Promise.all(items.map((p) => mapProduct(p)));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const product = await ProductRepository.findBySlug(slug);
  if (!product) return undefined;

  const { items: reviewRows } = await ReviewRepository.listByProduct(product.id, 1, 50);
  return mapProduct(product, reviewRows.map(mapReview));
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const dbProduct = await ProductRepository.findBySlug(product.slug);
  if (!dbProduct) return [];
  const related = await ProductRepository.related(dbProduct.id, dbProduct.categoryId, limit);
  return Promise.all(related.map((p) => mapProduct(p)));
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const items = await ProductRepository.bestSellers(limit);
  return Promise.all(items.map((p) => mapProduct(p)));
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const items = await ProductRepository.newArrivals(limit);
  return Promise.all(items.map((p) => mapProduct(p)));
}

export async function getSeasonalProducts(limit = 8): Promise<Product[]> {
  const items = await ProductRepository.seasonal(limit);
  return Promise.all(items.map((p) => mapProduct(p)));
}

export type BrandSummary = { name: string; slug: string; count: number; image: string; description: string };

export async function getBrands(): Promise<BrandSummary[]> {
  const brands = await BrandRepository.listWithProductCounts();
  return brands.map((b) => ({
    name: b.name,
    slug: b.slug,
    count: b.productCount,
    image: b.sampleImageUrl ?? "",
    description: b.description ?? "",
  }));
}

export async function getProductsByBrand(brandSlug: string): Promise<Product[]> {
  const { items } = await ProductRepository.list({ brandSlug, limit: 100 });
  return Promise.all(items.map((p) => mapProduct(p)));
}

export async function getSpecials(limit = 100): Promise<Product[]> {
  const items = await ProductRepository.specials(limit);
  return Promise.all(items.map((p) => mapProduct(p)));
}
