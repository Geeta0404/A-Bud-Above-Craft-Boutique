import { z } from "zod";
import { ProductRepository } from "@/repositories/ProductRepository";
import { NotFoundError, ValidationError } from "@/utils/errors";
import type { Product, ProductListFilters } from "@/types/catalog";
import type { PaginatedResult } from "@/types/api";

const imageSchema = z.object({
  imageUrl: z.string().url(),
  altText: z.string().max(255).nullish(),
  sortOrder: z.number().int().optional(),
  isPrimary: z.boolean().optional(),
});

const specSchema = z.object({
  specKey: z.string().min(1).max(100),
  specValue: z.string().min(1).max(255),
  sortOrder: z.number().int().optional(),
});

export const productInputSchema = z.object({
  categoryId: z.number().int().positive(),
  brandId: z.number().int().positive().nullish(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(220).regex(/^[a-z0-9-]+$/, "slug must be lowercase, alphanumeric, and hyphens only"),
  sku: z.string().max(64).nullish(),
  description: z.string().max(2000).nullish(),
  longDescription: z.string().max(10000).nullish(),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().nullish(),
  stockQuantity: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  images: z.array(imageSchema).optional(),
  specifications: z.array(specSchema).optional(),
});

function parseFilters(searchParams: URLSearchParams): ProductListFilters {
  const filters: ProductListFilters = {};
  if (searchParams.get("q")) filters.q = searchParams.get("q")!;
  if (searchParams.get("categoryId")) filters.categoryId = Number(searchParams.get("categoryId"));
  if (searchParams.get("category")) filters.categorySlug = searchParams.get("category")!;
  if (searchParams.get("brandId")) filters.brandId = Number(searchParams.get("brandId"));
  if (searchParams.get("brand")) filters.brandSlug = searchParams.get("brand")!;
  if (searchParams.get("minPrice")) filters.minPrice = Number(searchParams.get("minPrice"));
  if (searchParams.get("maxPrice")) filters.maxPrice = Number(searchParams.get("maxPrice"));
  if (searchParams.get("inStock") === "true") filters.inStock = true;
  if (searchParams.get("featured") === "true") filters.isFeatured = true;
  const sort = searchParams.get("sort");
  if (sort === "newest" || sort === "price_asc" || sort === "price_desc" || sort === "rating" || sort === "name") {
    filters.sort = sort;
  }
  if (searchParams.get("page")) filters.page = Number(searchParams.get("page"));
  if (searchParams.get("limit")) filters.limit = Number(searchParams.get("limit"));
  return filters;
}

export const ProductService = {
  async list(searchParams: URLSearchParams, { includeInactive = false } = {}): Promise<PaginatedResult<Product>> {
    const filters = parseFilters(searchParams);
    filters.includeInactive = includeInactive;
    return ProductRepository.list(filters);
  },

  async getBySlug(slug: string): Promise<Product> {
    const product = await ProductRepository.findBySlug(slug);
    if (!product) throw new NotFoundError("Product");
    return product;
  },

  async getById(id: number): Promise<Product> {
    const product = await ProductRepository.findById(id);
    if (!product) throw new NotFoundError("Product");
    return product;
  },

  featured: (limit?: number) => ProductRepository.featured(limit),
  latest: (limit?: number) => ProductRepository.latest(limit),
  lowStock: (threshold?: number) => ProductRepository.lowStock(threshold),

  async related(slug: string, limit = 4): Promise<Product[]> {
    const product = await ProductRepository.findBySlug(slug);
    if (!product) throw new NotFoundError("Product");
    return ProductRepository.related(product.id, product.categoryId, limit);
  },

  async create(input: unknown): Promise<Product> {
    const data = productInputSchema.parse(input);
    return ProductRepository.create(data);
  },

  async update(id: number, input: unknown): Promise<Product> {
    const data = productInputSchema.partial().parse(input);
    const updated = await ProductRepository.update(id, data);
    if (!updated) throw new NotFoundError("Product");
    return updated;
  },

  async delete(id: number): Promise<void> {
    const deleted = await ProductRepository.delete(id);
    if (!deleted) throw new NotFoundError("Product");
  },

  async setStock(id: number, quantity: number): Promise<Product> {
    if (quantity < 0) throw new ValidationError("Stock quantity cannot be negative");
    const updated = await ProductRepository.setStock(id, quantity);
    if (!updated) throw new NotFoundError("Product");
    return updated;
  },
};
