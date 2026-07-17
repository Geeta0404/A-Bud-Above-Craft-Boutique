import "server-only";
import type { PoolClient } from "pg";
import { query, queryOne, withTransaction } from "@/lib/db/query";
import type {
  PotencyUnit,
  Product,
  ProductImage,
  ProductInput,
  ProductListFilters,
  ProductSpecification,
  StrainType,
} from "@/types/catalog";
import type { PaginatedResult } from "@/types/api";

type ProductRow = {
  id: number;
  category_id: number;
  brand_id: number | null;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  long_description: string | null;
  price: string;
  compare_at_price: string | null;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  rating: string;
  review_count: number;
  strain_type: string | null;
  thc_min: string | null;
  thc_max: string | null;
  thc_unit: string | null;
  cbd_min: string | null;
  cbd_max: string | null;
  cbd_unit: string | null;
  size: string | null;
  is_best_seller: boolean;
  is_new: boolean;
  is_seasonal: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_slug?: string;
  brand_name?: string;
  brand_slug?: string;
};

type ProductImageRow = {
  id: number;
  product_id: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

type ProductSpecRow = {
  id: number;
  product_id: number;
  spec_key: string;
  spec_value: string;
  sort_order: number;
};

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    categoryId: row.category_id,
    brandId: row.brand_id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    description: row.description,
    longDescription: row.long_description,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price === null ? null : Number(row.compare_at_price),
    stockQuantity: row.stock_quantity,
    isActive: row.is_active,
    isFeatured: row.is_featured,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    strainType: row.strain_type as StrainType | null,
    thcMin: row.thc_min === null ? null : Number(row.thc_min),
    thcMax: row.thc_max === null ? null : Number(row.thc_max),
    thcUnit: row.thc_unit as PotencyUnit | null,
    cbdMin: row.cbd_min === null ? null : Number(row.cbd_min),
    cbdMax: row.cbd_max === null ? null : Number(row.cbd_max),
    cbdUnit: row.cbd_unit as PotencyUnit | null,
    size: row.size,
    isBestSeller: row.is_best_seller,
    isNew: row.is_new,
    isSeasonal: row.is_seasonal,
    tags: row.tags ?? [],
    // pg returns timestamptz columns as Date objects, not strings — the
    // `string` type here is what every consumer expects (JSON.stringify
    // masks this for API routes, but direct Server Component calls don't).
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    categoryName: row.category_name,
    categorySlug: row.category_slug,
    brandName: row.brand_name,
    brandSlug: row.brand_slug,
  };
}

function mapImage(row: ProductImageRow): ProductImage {
  return {
    id: row.id,
    productId: row.product_id,
    imageUrl: row.image_url,
    altText: row.alt_text,
    sortOrder: row.sort_order,
    isPrimary: row.is_primary,
  };
}

function mapSpec(row: ProductSpecRow): ProductSpecification {
  return {
    id: row.id,
    productId: row.product_id,
    specKey: row.spec_key,
    specValue: row.spec_value,
    sortOrder: row.sort_order,
  };
}

const BASE_SELECT = `
  SELECT p.*, c.name AS category_name, c.slug AS category_slug, b.name AS brand_name, b.slug AS brand_slug
  FROM products p
  JOIN categories c ON c.id = p.category_id
  LEFT JOIN brands b ON b.id = p.brand_id
`;

async function attachRelations(products: Product[]): Promise<Product[]> {
  if (products.length === 0) return products;
  const ids = products.map((p) => p.id);

  const [imageRows, specRows] = await Promise.all([
    query<ProductImageRow>(
      `SELECT * FROM product_images WHERE product_id = ANY($1) ORDER BY sort_order ASC`,
      [ids]
    ),
    query<ProductSpecRow>(
      `SELECT * FROM product_specifications WHERE product_id = ANY($1) ORDER BY sort_order ASC`,
      [ids]
    ),
  ]);

  const imagesByProduct = new Map<number, ProductImage[]>();
  for (const row of imageRows) {
    const image = mapImage(row);
    const list = imagesByProduct.get(image.productId) ?? [];
    list.push(image);
    imagesByProduct.set(image.productId, list);
  }

  const specsByProduct = new Map<number, ProductSpecification[]>();
  for (const row of specRows) {
    const spec = mapSpec(row);
    const list = specsByProduct.get(spec.productId) ?? [];
    list.push(spec);
    specsByProduct.set(spec.productId, list);
  }

  for (const product of products) {
    product.images = imagesByProduct.get(product.id) ?? [];
    product.specifications = specsByProduct.get(product.id) ?? [];
  }

  return products;
}

async function replaceImagesAndSpecs(client: PoolClient, productId: number, input: ProductInput) {
  if (input.images) {
    await client.query("DELETE FROM product_images WHERE product_id = $1", [productId]);
    for (const [index, image] of input.images.entries()) {
      await client.query(
        `INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
         VALUES ($1, $2, $3, $4, $5)`,
        [productId, image.imageUrl, image.altText ?? null, image.sortOrder ?? index, image.isPrimary ?? index === 0]
      );
    }
  }

  if (input.specifications) {
    await client.query("DELETE FROM product_specifications WHERE product_id = $1", [productId]);
    for (const [index, spec] of input.specifications.entries()) {
      await client.query(
        `INSERT INTO product_specifications (product_id, spec_key, spec_value, sort_order)
         VALUES ($1, $2, $3, $4)`,
        [productId, spec.specKey, spec.specValue, spec.sortOrder ?? index]
      );
    }
  }
}

async function getById(id: number): Promise<Product | null> {
  const row = await queryOne<ProductRow>(`${BASE_SELECT} WHERE p.id = $1`, [id]);
  if (!row) return null;
  const [product] = await attachRelations([mapRow(row)]);
  return product;
}

export const ProductRepository = {
  async list(filters: ProductListFilters): Promise<PaginatedResult<Product>> {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (!filters.includeInactive) {
      conditions.push("p.is_active = TRUE");
    }
    if (filters.q) {
      params.push(`%${filters.q}%`);
      conditions.push(`(p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
    }
    if (filters.categoryId) {
      params.push(filters.categoryId);
      conditions.push(`p.category_id = $${params.length}`);
    }
    if (filters.categorySlug) {
      params.push(filters.categorySlug);
      conditions.push(`c.slug = $${params.length}`);
    }
    if (filters.brandId) {
      params.push(filters.brandId);
      conditions.push(`p.brand_id = $${params.length}`);
    }
    if (filters.brandSlug) {
      params.push(filters.brandSlug);
      conditions.push(`b.slug = $${params.length}`);
    }
    if (filters.minPrice !== undefined) {
      params.push(filters.minPrice);
      conditions.push(`p.price >= $${params.length}`);
    }
    if (filters.maxPrice !== undefined) {
      params.push(filters.maxPrice);
      conditions.push(`p.price <= $${params.length}`);
    }
    if (filters.inStock) {
      conditions.push("p.stock_quantity > 0");
    }
    if (filters.isFeatured) {
      conditions.push("p.is_featured = TRUE");
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const sortMap: Record<string, string> = {
      newest: "p.created_at DESC",
      price_asc: "p.price ASC",
      price_desc: "p.price DESC",
      rating: "p.rating DESC",
      name: "p.name ASC",
    };
    const orderBy = sortMap[filters.sort ?? "newest"] ?? sortMap.newest;

    const countRow = await queryOne<{ count: string }>(
      `SELECT COUNT(*) AS count FROM products p
       JOIN categories c ON c.id = p.category_id
       LEFT JOIN brands b ON b.id = p.brand_id
       ${whereClause}`,
      params
    );
    const total = Number(countRow?.count ?? 0);

    params.push(limit, offset);
    const rows = await query<ProductRow>(
      `${BASE_SELECT} ${whereClause} ORDER BY ${orderBy} LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const items = await attachRelations(rows.map(mapRow));

    return {
      items,
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  },

  async findById(id: number): Promise<Product | null> {
    return getById(id);
  },

  async findBySlug(slug: string): Promise<Product | null> {
    const row = await queryOne<ProductRow>(`${BASE_SELECT} WHERE p.slug = $1`, [slug]);
    if (!row) return null;
    const [product] = await attachRelations([mapRow(row)]);
    return product;
  },

  async featured(limit = 8): Promise<Product[]> {
    const rows = await query<ProductRow>(
      `${BASE_SELECT} WHERE p.is_active = TRUE AND p.is_featured = TRUE ORDER BY p.created_at DESC LIMIT $1`,
      [limit]
    );
    return attachRelations(rows.map(mapRow));
  },

  async latest(limit = 8): Promise<Product[]> {
    const rows = await query<ProductRow>(
      `${BASE_SELECT} WHERE p.is_active = TRUE ORDER BY p.created_at DESC LIMIT $1`,
      [limit]
    );
    return attachRelations(rows.map(mapRow));
  },

  async related(productId: number, categoryId: number, limit = 4): Promise<Product[]> {
    const rows = await query<ProductRow>(
      `${BASE_SELECT} WHERE p.is_active = TRUE AND p.category_id = $1 AND p.id != $2
       ORDER BY p.created_at DESC LIMIT $3`,
      [categoryId, productId, limit]
    );
    return attachRelations(rows.map(mapRow));
  },

  async bestSellers(limit = 8): Promise<Product[]> {
    const rows = await query<ProductRow>(
      `${BASE_SELECT} WHERE p.is_active = TRUE AND p.is_best_seller = TRUE ORDER BY p.created_at DESC LIMIT $1`,
      [limit]
    );
    return attachRelations(rows.map(mapRow));
  },

  async newArrivals(limit = 8): Promise<Product[]> {
    const rows = await query<ProductRow>(
      `${BASE_SELECT} WHERE p.is_active = TRUE AND p.is_new = TRUE ORDER BY p.created_at DESC LIMIT $1`,
      [limit]
    );
    return attachRelations(rows.map(mapRow));
  },

  async seasonal(limit = 8): Promise<Product[]> {
    const rows = await query<ProductRow>(
      `${BASE_SELECT} WHERE p.is_active = TRUE AND p.is_seasonal = TRUE ORDER BY p.created_at DESC LIMIT $1`,
      [limit]
    );
    return attachRelations(rows.map(mapRow));
  },

  async specials(limit = 8): Promise<Product[]> {
    const rows = await query<ProductRow>(
      `${BASE_SELECT} WHERE p.is_active = TRUE AND p.compare_at_price IS NOT NULL AND p.compare_at_price > p.price
       ORDER BY p.created_at DESC LIMIT $1`,
      [limit]
    );
    return attachRelations(rows.map(mapRow));
  },

  async create(input: ProductInput): Promise<Product> {
    return withTransaction(async (client) => {
      const result = await client.query<ProductRow>(
        `INSERT INTO products
           (category_id, brand_id, name, slug, sku, description, long_description,
            price, compare_at_price, stock_quantity, is_active, is_featured,
            strain_type, thc_min, thc_max, thc_unit, cbd_min, cbd_max, cbd_unit, size,
            is_best_seller, is_new, is_seasonal, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10, 0), COALESCE($11, TRUE), COALESCE($12, FALSE),
                 $13, $14, $15, $16, $17, $18, $19, $20,
                 COALESCE($21, FALSE), COALESCE($22, FALSE), COALESCE($23, FALSE), COALESCE($24, '{}'))
         RETURNING *`,
        [
          input.categoryId,
          input.brandId ?? null,
          input.name,
          input.slug,
          input.sku ?? null,
          input.description ?? null,
          input.longDescription ?? null,
          input.price,
          input.compareAtPrice ?? null,
          input.stockQuantity,
          input.isActive,
          input.isFeatured,
          input.strainType ?? null,
          input.thcMin ?? null,
          input.thcMax ?? null,
          input.thcUnit ?? null,
          input.cbdMin ?? null,
          input.cbdMax ?? null,
          input.cbdUnit ?? null,
          input.size ?? null,
          input.isBestSeller,
          input.isNew,
          input.isSeasonal,
          input.tags,
        ]
      );

      const product = result.rows[0];
      await replaceImagesAndSpecs(client, product.id, input);
      return product.id;
    }).then(async (id) => (await getById(id))!);
  },

  async update(id: number, input: Partial<ProductInput>): Promise<Product | null> {
    return withTransaction(async (client) => {
      const result = await client.query<ProductRow>(
        `UPDATE products SET
           category_id = COALESCE($2, category_id),
           brand_id = COALESCE($3, brand_id),
           name = COALESCE($4, name),
           slug = COALESCE($5, slug),
           sku = COALESCE($6, sku),
           description = COALESCE($7, description),
           long_description = COALESCE($8, long_description),
           price = COALESCE($9, price),
           compare_at_price = COALESCE($10, compare_at_price),
           stock_quantity = COALESCE($11, stock_quantity),
           is_active = COALESCE($12, is_active),
           is_featured = COALESCE($13, is_featured),
           strain_type = COALESCE($14, strain_type),
           thc_min = COALESCE($15, thc_min),
           thc_max = COALESCE($16, thc_max),
           thc_unit = COALESCE($17, thc_unit),
           cbd_min = COALESCE($18, cbd_min),
           cbd_max = COALESCE($19, cbd_max),
           cbd_unit = COALESCE($20, cbd_unit),
           size = COALESCE($21, size),
           is_best_seller = COALESCE($22, is_best_seller),
           is_new = COALESCE($23, is_new),
           is_seasonal = COALESCE($24, is_seasonal),
           tags = COALESCE($25, tags)
         WHERE id = $1
         RETURNING *`,
        [
          id,
          input.categoryId,
          input.brandId,
          input.name,
          input.slug,
          input.sku,
          input.description,
          input.longDescription,
          input.price,
          input.compareAtPrice,
          input.stockQuantity,
          input.isActive,
          input.isFeatured,
          input.strainType,
          input.thcMin,
          input.thcMax,
          input.thcUnit,
          input.cbdMin,
          input.cbdMax,
          input.cbdUnit,
          input.size,
          input.isBestSeller,
          input.isNew,
          input.isSeasonal,
          input.tags,
        ]
      );

      if (result.rows.length === 0) return null;
      await replaceImagesAndSpecs(client, id, input as ProductInput);
      return id;
    }).then(async (updatedId) => (updatedId ? getById(updatedId) : null));
  },

  async delete(id: number): Promise<boolean> {
    const rows = await query("DELETE FROM products WHERE id = $1 RETURNING id", [id]);
    return rows.length > 0;
  },

  async setStock(id: number, quantity: number): Promise<Product | null> {
    const row = await queryOne<ProductRow>(
      "UPDATE products SET stock_quantity = $2 WHERE id = $1 RETURNING *",
      [id, quantity]
    );
    return row ? mapRow(row) : null;
  },

  async decrementStock(client: PoolClient, id: number, quantity: number): Promise<void> {
    const result = await client.query(
      "UPDATE products SET stock_quantity = stock_quantity - $2 WHERE id = $1 AND stock_quantity >= $2 RETURNING id",
      [id, quantity]
    );
    if (result.rows.length === 0) {
      throw new Error(`Insufficient stock for product ${id}`);
    }
  },

  async lowStock(threshold = 10): Promise<Product[]> {
    const rows = await query<ProductRow>(
      `${BASE_SELECT} WHERE p.stock_quantity <= $1 ORDER BY p.stock_quantity ASC`,
      [threshold]
    );
    return attachRelations(rows.map(mapRow));
  },
};
