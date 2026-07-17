import "server-only";
import { query, queryOne } from "@/lib/db/query";
import type { Brand, BrandInput } from "@/types/catalog";

type BrandRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

function mapRow(row: BrandRow): Brand {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    logoUrl: row.logo_url,
    isActive: row.is_active,
    // pg returns timestamptz columns as Date objects, not strings.
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export type BrandWithProductCount = Brand & { productCount: number; sampleImageUrl: string | null };

export const BrandRepository = {
  // Only brands with at least one active product, each with a representative
  // image (first product's first image) — mirrors the storefront's brand grid.
  async listWithProductCounts(): Promise<BrandWithProductCount[]> {
    const rows = await query<BrandRow & { product_count: string; sample_image_url: string | null }>(
      `SELECT b.*,
         COUNT(p.id) FILTER (WHERE p.is_active = TRUE) AS product_count,
         (
           SELECT pi.image_url FROM products p2
           JOIN product_images pi ON pi.product_id = p2.id
           WHERE p2.brand_id = b.id AND p2.is_active = TRUE
           ORDER BY p2.id ASC, pi.sort_order ASC
           LIMIT 1
         ) AS sample_image_url
       FROM brands b
       LEFT JOIN products p ON p.brand_id = b.id
       WHERE b.is_active = TRUE
       GROUP BY b.id
       HAVING COUNT(p.id) FILTER (WHERE p.is_active = TRUE) > 0
       ORDER BY b.name ASC`
    );
    return rows.map((row) => ({
      ...mapRow(row),
      productCount: Number(row.product_count),
      sampleImageUrl: row.sample_image_url,
    }));
  },

  async list(includeInactive = false): Promise<Brand[]> {
    const rows = await query<BrandRow>(
      includeInactive
        ? "SELECT * FROM brands ORDER BY name ASC"
        : "SELECT * FROM brands WHERE is_active = TRUE ORDER BY name ASC"
    );
    return rows.map(mapRow);
  },

  async findById(id: number): Promise<Brand | null> {
    const row = await queryOne<BrandRow>("SELECT * FROM brands WHERE id = $1", [id]);
    return row ? mapRow(row) : null;
  },

  async findBySlug(slug: string): Promise<Brand | null> {
    const row = await queryOne<BrandRow>("SELECT * FROM brands WHERE slug = $1", [slug]);
    return row ? mapRow(row) : null;
  },

  async create(input: BrandInput): Promise<Brand> {
    const row = await queryOne<BrandRow>(
      `INSERT INTO brands (name, slug, description, logo_url, is_active)
       VALUES ($1, $2, $3, $4, COALESCE($5, TRUE))
       RETURNING *`,
      [input.name, input.slug, input.description ?? null, input.logoUrl ?? null, input.isActive]
    );
    return mapRow(row!);
  },

  async update(id: number, input: Partial<BrandInput>): Promise<Brand | null> {
    const row = await queryOne<BrandRow>(
      `UPDATE brands SET
         name = COALESCE($2, name),
         slug = COALESCE($3, slug),
         description = COALESCE($4, description),
         logo_url = COALESCE($5, logo_url),
         is_active = COALESCE($6, is_active)
       WHERE id = $1
       RETURNING *`,
      [id, input.name, input.slug, input.description, input.logoUrl, input.isActive]
    );
    return row ? mapRow(row) : null;
  },

  async delete(id: number): Promise<boolean> {
    const rows = await query("DELETE FROM brands WHERE id = $1 RETURNING id", [id]);
    return rows.length > 0;
  },
};
