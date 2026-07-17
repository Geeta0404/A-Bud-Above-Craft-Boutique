import "server-only";
import { query, queryOne, withTransaction } from "@/lib/db/query";
import type { Review } from "@/types/review";
import type { PaginatedResult } from "@/types/api";

type ReviewRow = {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  author_name?: string | null;
};

function mapRow(row: ReviewRow): Review {
  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    rating: row.rating,
    title: row.title,
    body: row.body,
    isVerifiedPurchase: row.is_verified_purchase,
    isApproved: row.is_approved,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorName: row.author_name ?? undefined,
  };
}

const SELECT_WITH_AUTHOR = `
  SELECT reviews.*, TRIM(COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '')) AS author_name
  FROM reviews
  JOIN users u ON u.id = reviews.user_id
`;

async function hasPurchased(userId: number, productId: number): Promise<boolean> {
  const row = await queryOne(
    `SELECT 1 FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     WHERE o.user_id = $1 AND oi.product_id = $2 AND o.status IN ('delivered', 'shipped', 'processing')
     LIMIT 1`,
    [userId, productId]
  );
  return row !== null;
}

export const ReviewRepository = {
  async listByProduct(productId: number, page = 1, limit = 20): Promise<PaginatedResult<Review>> {
    const offset = (page - 1) * limit;
    const [rows, countRow] = await Promise.all([
      query<ReviewRow>(
        `${SELECT_WITH_AUTHOR} WHERE reviews.product_id = $1 AND reviews.is_approved = TRUE
         ORDER BY reviews.created_at DESC LIMIT $2 OFFSET $3`,
        [productId, limit, offset]
      ),
      queryOne<{ count: string }>(
        "SELECT COUNT(*) AS count FROM reviews WHERE product_id = $1 AND is_approved = TRUE",
        [productId]
      ),
    ]);
    const total = Number(countRow?.count ?? 0);
    return { items: rows.map(mapRow), meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
  },

  async findById(id: number): Promise<Review | null> {
    const row = await queryOne<ReviewRow>(`${SELECT_WITH_AUTHOR} WHERE reviews.id = $1`, [id]);
    return row ? mapRow(row) : null;
  },

  async create(userId: number, productId: number, rating: number, title: string | null, body: string | null): Promise<Review> {
    return withTransaction(async (client) => {
      const verified = await hasPurchased(userId, productId);
      const result = await client.query<ReviewRow>(
        `INSERT INTO reviews (product_id, user_id, rating, title, body, is_verified_purchase)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [productId, userId, rating, title, body, verified]
      );
      await client.query(
        `UPDATE products SET
           review_count = review_count + 1,
           rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE product_id = $1 AND is_approved = TRUE)
         WHERE id = $1`,
        [productId]
      );
      return mapRow(result.rows[0]);
    });
  },

  async update(id: number, input: { rating?: number; title?: string | null; body?: string | null; isApproved?: boolean }): Promise<Review | null> {
    return withTransaction(async (client) => {
      const result = await client.query<ReviewRow>(
        `UPDATE reviews SET
           rating = COALESCE($2, rating),
           title = COALESCE($3, title),
           body = COALESCE($4, body),
           is_approved = COALESCE($5, is_approved)
         WHERE id = $1
         RETURNING *`,
        [id, input.rating, input.title, input.body, input.isApproved]
      );
      if (result.rows.length === 0) return null;
      const productId = result.rows[0].product_id;
      await client.query(
        `UPDATE products SET rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE product_id = $1 AND is_approved = TRUE), 0)
         WHERE id = $1`,
        [productId]
      );
      return mapRow(result.rows[0]);
    });
  },

  async delete(id: number): Promise<boolean> {
    return withTransaction(async (client) => {
      const result = await client.query<{ product_id: number }>("DELETE FROM reviews WHERE id = $1 RETURNING product_id", [id]);
      if (result.rows.length === 0) return false;
      const productId = result.rows[0].product_id;
      await client.query(
        `UPDATE products SET
           review_count = GREATEST(review_count - 1, 0),
           rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE product_id = $1 AND is_approved = TRUE), 0)
         WHERE id = $1`,
        [productId]
      );
      return true;
    });
  },
};
