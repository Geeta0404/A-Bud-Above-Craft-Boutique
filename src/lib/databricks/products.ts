import "server-only";
import { randomUUID } from "crypto";
import { runQuery, productsTable, escapeSql } from "./client";
import type { AdminProduct, AdminProductInput } from "@/lib/types";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compare_at_price: number | null;
  description: string;
  long_description: string;
  images: string[];
  brand: string;
  rating: number;
  review_count: number;
  tags: string[];
  strain_type: string;
  thc_min: number;
  thc_max: number;
  thc_unit: string;
  cbd_min: number;
  cbd_max: number;
  cbd_unit: string;
  size: string;
  in_stock: boolean;
  stock_quantity: number;
  is_best_seller: boolean;
  is_new: boolean;
  is_seasonal: boolean;
  created_at: string;
  updated_at: string;
};

function rowToProduct(row: ProductRow): AdminProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    description: row.description,
    longDescription: row.long_description,
    images: row.images ?? [],
    brand: row.brand,
    rating: row.rating ?? 0,
    reviewCount: row.review_count ?? 0,
    reviews: [],
    tags: row.tags ?? [],
    strainType: row.strain_type as AdminProduct["strainType"],
    thcMin: row.thc_min ?? 0,
    thcMax: row.thc_max ?? 0,
    thcUnit: row.thc_unit as AdminProduct["thcUnit"],
    cbdMin: row.cbd_min ?? 0,
    cbdMax: row.cbd_max ?? 0,
    cbdUnit: row.cbd_unit as AdminProduct["cbdUnit"],
    size: row.size,
    inStock: row.in_stock,
    stockQuantity: row.stock_quantity,
    isBestSeller: row.is_best_seller,
    isNew: row.is_new,
    isSeasonal: row.is_seasonal,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function sqlArray(values: string[]): string {
  if (!values.length) return "array()";
  return `array(${values.map((v) => `'${escapeSql(v)}'`).join(", ")})`;
}

export async function listProducts(): Promise<AdminProduct[]> {
  const rows = await runQuery<ProductRow>(
    `SELECT * FROM ${productsTable} ORDER BY created_at DESC`
  );
  return rows.map(rowToProduct);
}

export async function getProductById(id: string): Promise<AdminProduct | null> {
  const rows = await runQuery<ProductRow>(
    `SELECT * FROM ${productsTable} WHERE id = '${escapeSql(id)}' LIMIT 1`
  );
  return rows[0] ? rowToProduct(rows[0]) : null;
}

export async function createProduct(input: AdminProductInput): Promise<string> {
  const id = randomUUID();
  const now = new Date().toISOString();

  await runQuery(`
    INSERT INTO ${productsTable} (
      id, slug, name, category, price, compare_at_price, description, long_description,
      images, brand, rating, review_count, tags, strain_type, thc_min, thc_max, thc_unit,
      cbd_min, cbd_max, cbd_unit, size, in_stock, stock_quantity,
      is_best_seller, is_new, is_seasonal, created_at, updated_at
    ) VALUES (
      '${id}', '${escapeSql(input.slug)}', '${escapeSql(input.name)}', '${escapeSql(input.category)}',
      ${input.price}, ${input.compareAtPrice ?? "NULL"}, '${escapeSql(input.description)}',
      '${escapeSql(input.longDescription)}', ${sqlArray(input.images)}, '${escapeSql(input.brand)}',
      ${input.rating ?? 0}, ${input.reviewCount ?? 0}, ${sqlArray(input.tags)}, '${escapeSql(input.strainType)}',
      ${input.thcMin}, ${input.thcMax}, '${escapeSql(input.thcUnit)}',
      ${input.cbdMin}, ${input.cbdMax}, '${escapeSql(input.cbdUnit)}', '${escapeSql(input.size)}',
      ${input.inStock}, ${input.stockQuantity}, ${input.isBestSeller ?? false}, ${input.isNew ?? false},
      ${input.isSeasonal ?? false}, '${now}', '${now}'
    )
  `);

  return id;
}

export async function updateProduct(id: string, input: AdminProductInput): Promise<void> {
  const now = new Date().toISOString();

  await runQuery(`
    UPDATE ${productsTable} SET
      slug = '${escapeSql(input.slug)}',
      name = '${escapeSql(input.name)}',
      category = '${escapeSql(input.category)}',
      price = ${input.price},
      compare_at_price = ${input.compareAtPrice ?? "NULL"},
      description = '${escapeSql(input.description)}',
      long_description = '${escapeSql(input.longDescription)}',
      images = ${sqlArray(input.images)},
      brand = '${escapeSql(input.brand)}',
      tags = ${sqlArray(input.tags)},
      strain_type = '${escapeSql(input.strainType)}',
      thc_min = ${input.thcMin},
      thc_max = ${input.thcMax},
      thc_unit = '${escapeSql(input.thcUnit)}',
      cbd_min = ${input.cbdMin},
      cbd_max = ${input.cbdMax},
      cbd_unit = '${escapeSql(input.cbdUnit)}',
      size = '${escapeSql(input.size)}',
      in_stock = ${input.inStock},
      stock_quantity = ${input.stockQuantity},
      is_best_seller = ${input.isBestSeller ?? false},
      is_new = ${input.isNew ?? false},
      is_seasonal = ${input.isSeasonal ?? false},
      updated_at = '${now}'
    WHERE id = '${escapeSql(id)}'
  `);
}

export async function deleteProduct(id: string): Promise<void> {
  await runQuery(`DELETE FROM ${productsTable} WHERE id = '${escapeSql(id)}'`);
}
