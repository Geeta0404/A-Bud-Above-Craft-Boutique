import type { Category } from "@/lib/types";
import { CategoryRepository } from "@/repositories/CategoryRepository";

export async function getCategories(): Promise<Category[]> {
  const categories = await CategoryRepository.list();
  return categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description ?? "",
    image: c.imageUrl ?? "",
  }));
}
