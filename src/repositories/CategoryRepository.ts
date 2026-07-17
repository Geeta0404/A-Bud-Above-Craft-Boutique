import "server-only";
import { query, queryOne } from "@/lib/db/query";
import type { Category, CategoryInput } from "@/types/catalog";

type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

function mapRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    parentId: row.parent_id,
    imageUrl: row.image_url,
    isActive: row.is_active,
    // pg returns timestamptz columns as Date objects, not strings.
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export const CategoryRepository = {
  async list(includeInactive = false): Promise<Category[]> {
    const rows = await query<CategoryRow>(
      includeInactive
        ? "SELECT * FROM categories ORDER BY name ASC"
        : "SELECT * FROM categories WHERE is_active = TRUE ORDER BY name ASC"
    );
    return rows.map(mapRow);
  },

  async findById(id: number): Promise<Category | null> {
    const row = await queryOne<CategoryRow>("SELECT * FROM categories WHERE id = $1", [id]);
    return row ? mapRow(row) : null;
  },

  async findBySlug(slug: string): Promise<Category | null> {
    const row = await queryOne<CategoryRow>("SELECT * FROM categories WHERE slug = $1", [slug]);
    return row ? mapRow(row) : null;
  },

  async create(input: CategoryInput): Promise<Category> {
    const row = await queryOne<CategoryRow>(
      `INSERT INTO categories (name, slug, description, parent_id, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6, TRUE))
       RETURNING *`,
      [input.name, input.slug, input.description ?? null, input.parentId ?? null, input.imageUrl ?? null, input.isActive]
    );
    return mapRow(row!);
  },

  async update(id: number, input: Partial<CategoryInput>): Promise<Category | null> {
    const row = await queryOne<CategoryRow>(
      `UPDATE categories SET
         name = COALESCE($2, name),
         slug = COALESCE($3, slug),
         description = COALESCE($4, description),
         parent_id = COALESCE($5, parent_id),
         image_url = COALESCE($6, image_url),
         is_active = COALESCE($7, is_active)
       WHERE id = $1
       RETURNING *`,
      [id, input.name, input.slug, input.description, input.parentId, input.imageUrl, input.isActive]
    );
    return row ? mapRow(row) : null;
  },

  async delete(id: number): Promise<boolean> {
    const rows = await query("DELETE FROM categories WHERE id = $1 RETURNING id", [id]);
    return rows.length > 0;
  },
};
