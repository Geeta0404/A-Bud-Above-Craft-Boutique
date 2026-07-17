import "server-only";
import type { PoolClient } from "pg";
import { query, queryOne } from "@/lib/db/query";
import type { Payment, PaymentProvider, PaymentStatus } from "@/types/commerce";

type PaymentRow = {
  id: number;
  order_id: number;
  provider: PaymentProvider;
  provider_payment_id: string | null;
  provider_customer_id: string | null;
  status: PaymentStatus;
  amount: string;
  currency: string;
  method: string | null;
  failure_reason: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: PaymentRow): Payment {
  return {
    id: row.id,
    orderId: row.order_id,
    provider: row.provider,
    providerPaymentId: row.provider_payment_id,
    providerCustomerId: row.provider_customer_id,
    status: row.status,
    amount: Number(row.amount),
    currency: row.currency,
    method: row.method,
    failureReason: row.failure_reason,
    paidAt: row.paid_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const PaymentRepository = {
  async create(
    client: PoolClient,
    data: { orderId: number; provider: PaymentProvider; amount: number; method?: string | null }
  ): Promise<Payment> {
    const result = await client.query<PaymentRow>(
      `INSERT INTO payments (order_id, provider, amount, method)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.orderId, data.provider, data.amount, data.method ?? null]
    );
    return mapRow(result.rows[0]);
  },

  async findById(id: number): Promise<Payment | null> {
    const row = await queryOne<PaymentRow>("SELECT * FROM payments WHERE id = $1", [id]);
    return row ? mapRow(row) : null;
  },

  async findByOrderId(orderId: number): Promise<Payment[]> {
    const rows = await query<PaymentRow>("SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC", [orderId]);
    return rows.map(mapRow);
  },

  async updateStatus(
    id: number,
    status: PaymentStatus,
    extra?: { providerPaymentId?: string | null; providerCustomerId?: string | null; failureReason?: string | null }
  ): Promise<Payment | null> {
    const row = await queryOne<PaymentRow>(
      `UPDATE payments SET
         status = $2,
         provider_payment_id = COALESCE($3, provider_payment_id),
         provider_customer_id = COALESCE($4, provider_customer_id),
         failure_reason = COALESCE($5, failure_reason),
         paid_at = CASE WHEN $2 = 'succeeded' THEN now() ELSE paid_at END
       WHERE id = $1
       RETURNING *`,
      [id, status, extra?.providerPaymentId, extra?.providerCustomerId, extra?.failureReason]
    );
    return row ? mapRow(row) : null;
  },
};
