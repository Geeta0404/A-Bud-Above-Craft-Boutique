import { z } from "zod";
import { CategoryRepository } from "@/repositories/CategoryRepository";
import { NotFoundError } from "@/utils/errors";
import type { Category } from "@/types/catalog";

export const categoryInputSchema = z.object({
  name: z.string().min(1).max(150),
  slug: z.string().min(1).max(160).regex(/^[a-z0-9-]+$/, "slug must be lowercase, alphanumeric, and hyphens only"),
  description: z.string().max(2000).nullish(),
  parentId: z.number().int().positive().nullish(),
  imageUrl: z.string().url().nullish(),
  isActive: z.boolean().optional(),
});

export const CategoryService = {
  list: (includeInactive = false) => CategoryRepository.list(includeInactive),

  async getBySlug(slug: string): Promise<Category> {
    const category = await CategoryRepository.findBySlug(slug);
    if (!category) throw new NotFoundError("Category");
    return category;
  },

  async getById(id: number): Promise<Category> {
    const category = await CategoryRepository.findById(id);
    if (!category) throw new NotFoundError("Category");
    return category;
  },

  async create(input: unknown): Promise<Category> {
    const data = categoryInputSchema.parse(input);
    return CategoryRepository.create(data);
  },

  async update(id: number, input: unknown): Promise<Category> {
    const data = categoryInputSchema.partial().parse(input);
    const updated = await CategoryRepository.update(id, data);
    if (!updated) throw new NotFoundError("Category");
    return updated;
  },

  async delete(id: number): Promise<void> {
    const deleted = await CategoryRepository.delete(id);
    if (!deleted) throw new NotFoundError("Category");
  },
};
