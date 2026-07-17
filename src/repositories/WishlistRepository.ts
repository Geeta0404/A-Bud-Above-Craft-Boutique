import "server-only";
import { query, queryOne } from "@/lib/db/query";
import type { WishlistItem } from "@/types/commerce";

type WishlistRow = {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  product_name?: string;
  product_slug?: string;
  product_price?: string;
  product_image?: string | null;
};

function mapRow(row: WishlistRow): WishlistItem {
  return {
    id: row.id,
    userId: row.user_id,
    productId: row.product_id,
    createdAt: row.created_at,
    product: row.product_name
      ? {
          name: row.product_name,
          slug: row.product_slug!,
          price: Number(row.product_price),
          imageUrl: row.product_image ?? null,
        }
      : undefined,
  };
}

const SELECT_WITH_PRODUCT = `
  SELECT
    wishlist.*,
    p.name AS product_name,
    p.slug AS product_slug,
    p.price AS product_price,
    (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC LIMIT 1) AS product_image
  FROM wishlist
  JOIN products p ON p.id = wishlist.product_id
`;

export const WishlistRepository = {
  async listByUser(userId: number): Promise<WishlistItem[]> {
    const rows = await query<WishlistRow>(
      `${SELECT_WITH_PRODUCT} WHERE wishlist.user_id = $1 ORDER BY wishlist.created_at DESC`,
      [userId]
    );
    return rows.map(mapRow);
  },

  async add(userId: number, productId: number): Promise<WishlistItem> {
    const row = await queryOne<{ id: number }>(
      `INSERT INTO wishlist (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO UPDATE SET user_id = EXCLUDED.user_id
       RETURNING id`,
      [userId, productId]
    );
    const full = await queryOne<WishlistRow>(`${SELECT_WITH_PRODUCT} WHERE wishlist.id = $1`, [row!.id]);
    return mapRow(full!);
  },

  async remove(id: number, userId: number): Promise<boolean> {
    const rows = await query("DELETE FROM wishlist WHERE id = $1 AND user_id = $2 RETURNING id", [id, userId]);
    return rows.length > 0;
  },
};
