import { z } from "zod";
import { BrandRepository } from "@/repositories/BrandRepository";
import { NotFoundError } from "@/utils/errors";
import type { Brand } from "@/types/catalog";

export const brandInputSchema = z.object({
  name: z.string().min(1).max(150),
  slug: z.string().min(1).max(160).regex(/^[a-z0-9-]+$/, "slug must be lowercase, alphanumeric, and hyphens only"),
  description: z.string().max(2000).nullish(),
  logoUrl: z.string().url().nullish(),
  isActive: z.boolean().optional(),
});

export const BrandService = {
  list: (includeInactive = false) => BrandRepository.list(includeInactive),

  async getBySlug(slug: string): Promise<Brand> {
    const brand = await BrandRepository.findBySlug(slug);
    if (!brand) throw new NotFoundError("Brand");
    return brand;
  },

  async getById(id: number): Promise<Brand> {
    const brand = await BrandRepository.findById(id);
    if (!brand) throw new NotFoundError("Brand");
    return brand;
  },

  async create(input: unknown): Promise<Brand> {
    const data = brandInputSchema.parse(input);
    return BrandRepository.create(data);
  },

  async update(id: number, input: unknown): Promise<Brand> {
    const data = brandInputSchema.partial().parse(input);
    const updated = await BrandRepository.update(id, data);
    if (!updated) throw new NotFoundError("Brand");
    return updated;
  },

  async delete(id: number): Promise<void> {
    const deleted = await BrandRepository.delete(id);
    if (!deleted) throw new NotFoundError("Brand");
  },
};
