import "server-only";
import { query, queryOne } from "@/lib/db/query";
import type { Coupon, CouponInput } from "@/types/commerce";
import type { PaginatedResult } from "@/types/api";

type CouponRow = {
  id: number;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed_amount";
  discount_value: string;
  min_order_amount: string;
  max_discount_amount: string | null;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: CouponRow): Coupon {
  return {
    id: row.id,
    code: row.code,
    description: row.description,
    discountType: row.discount_type,
    discountValue: Number(row.discount_value),
    minOrderAmount: Number(row.min_order_amount),
    maxDiscountAmount: row.max_discount_amount === null ? null : Number(row.max_discount_amount),
    usageLimit: row.usage_limit,
    usageCount: row.usage_count,
    isActive: row.is_active,
    startsAt: row.starts_at,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const CouponRepository = {
  async list(page = 1, limit = 20): Promise<PaginatedResult<Coupon>> {
    const offset = (page - 1) * limit;
    const [rows, countRow] = await Promise.all([
      query<CouponRow>("SELECT * FROM coupons ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit, offset]),
      queryOne<{ count: string }>("SELECT COUNT(*) AS count FROM coupons"),
    ]);
    const total = Number(countRow?.count ?? 0);
    return { items: rows.map(mapRow), meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
  },

  async findById(id: number): Promise<Coupon | null> {
    const row = await queryOne<CouponRow>("SELECT * FROM coupons WHERE id = $1", [id]);
    return row ? mapRow(row) : null;
  },

  async findByCode(code: string): Promise<Coupon | null> {
    const row = await queryOne<CouponRow>("SELECT * FROM coupons WHERE code = $1", [code.toUpperCase()]);
    return row ? mapRow(row) : null;
  },

  async create(input: CouponInput): Promise<Coupon> {
    const row = await queryOne<CouponRow>(
      `INSERT INTO coupons
         (code, description, discount_type, discount_value, min_order_amount, max_discount_amount,
          usage_limit, is_active, starts_at, expires_at)
       VALUES ($1, $2, $3, $4, COALESCE($5, 0), $6, $7, COALESCE($8, TRUE), $9, $10)
       RETURNING *`,
      [
        input.code.toUpperCase(),
        input.description ?? null,
        input.discountType,
        input.discountValue,
        input.minOrderAmount,
        input.maxDiscountAmount ?? null,
        input.usageLimit ?? null,
        input.isActive,
        input.startsAt ?? null,
        input.expiresAt ?? null,
      ]
    );
    return mapRow(row!);
  },

  async update(id: number, input: Partial<CouponInput>): Promise<Coupon | null> {
    const row = await queryOne<CouponRow>(
      `UPDATE coupons SET
         description = COALESCE($2, description),
         discount_type = COALESCE($3, discount_type),
         discount_value = COALESCE($4, discount_value),
         min_order_amount = COALESCE($5, min_order_amount),
         max_discount_amount = COALESCE($6, max_discount_amount),
         usage_limit = COALESCE($7, usage_limit),
         is_active = COALESCE($8, is_active),
         starts_at = COALESCE($9, starts_at),
         expires_at = COALESCE($10, expires_at)
       WHERE id = $1
       RETURNING *`,
      [
        id,
        input.description,
        input.discountType,
        input.discountValue,
        input.minOrderAmount,
        input.maxDiscountAmount,
        input.usageLimit,
        input.isActive,
        input.startsAt,
        input.expiresAt,
      ]
    );
    return row ? mapRow(row) : null;
  },

  async delete(id: number): Promise<boolean> {
    const rows = await query("DELETE FROM coupons WHERE id = $1 RETURNING id", [id]);
    return rows.length > 0;
  },
};
