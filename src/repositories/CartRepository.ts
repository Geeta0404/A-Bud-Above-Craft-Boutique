import "server-only";
import { query, queryOne } from "@/lib/db/query";
import type { CartItem } from "@/types/commerce";

type CartRow = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product_name?: string;
  product_slug?: string;
  product_price?: string;
  product_stock?: number;
  product_image?: string | null;
};

function mapRow(row: CartRow): CartItem {
  return {
    id: row.id,
    userId: row.user_id,
    productId: row.product_id,
    quantity: row.quantity,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    product: row.product_name
      ? {
          name: row.product_name,
          slug: row.product_slug!,
          price: Number(row.product_price),
          stockQuantity: row.product_stock!,
          imageUrl: row.product_image ?? null,
        }
      : undefined,
  };
}

const SELECT_WITH_PRODUCT = `
  SELECT
    cart.*,
    p.name AS product_name,
    p.slug AS product_slug,
    p.price AS product_price,
    p.stock_quantity AS product_stock,
    (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC LIMIT 1) AS product_image
  FROM cart
  JOIN products p ON p.id = cart.product_id
`;

export const CartRepository = {
  async listByUser(userId: number): Promise<CartItem[]> {
    const rows = await query<CartRow>(
      `${SELECT_WITH_PRODUCT} WHERE cart.user_id = $1 ORDER BY cart.created_at DESC`,
      [userId]
    );
    return rows.map(mapRow);
  },

  async findById(id: number): Promise<CartItem | null> {
    const row = await queryOne<CartRow>(`${SELECT_WITH_PRODUCT} WHERE cart.id = $1`, [id]);
    return row ? mapRow(row) : null;
  },

  async upsert(userId: number, productId: number, quantity: number): Promise<CartItem> {
    const row = await queryOne<CartRow>(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity
       RETURNING *`,
      [userId, productId, quantity]
    );
    return (await this.findById(row!.id))!;
  },

  async updateQuantity(id: number, userId: number, quantity: number): Promise<CartItem | null> {
    const row = await queryOne<CartRow>(
      "UPDATE cart SET quantity = $3 WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId, quantity]
    );
    return row ? this.findById(row.id) : null;
  },

  async remove(id: number, userId: number): Promise<boolean> {
    const rows = await query("DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING id", [id, userId]);
    return rows.length > 0;
  },

  async clearForUser(userId: number): Promise<void> {
    await query("DELETE FROM cart WHERE user_id = $1", [userId]);
  },
};
