import "server-only";
import type { PoolClient } from "pg";
import { query, queryOne } from "@/lib/db/query";
import type { Order, OrderItem, OrderStatus } from "@/types/commerce";
import type { PaginatedResult } from "@/types/api";

type OrderRow = {
  id: number;
  order_number: string;
  user_id: number | null;
  status: OrderStatus;
  customer_email: string;
  customer_name: string;
  shipping_address_id: number | null;
  billing_address_id: number | null;
  subtotal: string;
  discount_total: string;
  tax_total: string;
  shipping_total: string;
  total: string;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type OrderItemRow = {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  product_sku: string | null;
  unit_price: string;
  quantity: number;
  line_total: string;
};

function mapOrderRow(row: OrderRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    userId: row.user_id,
    status: row.status,
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    shippingAddressId: row.shipping_address_id,
    billingAddressId: row.billing_address_id,
    subtotal: Number(row.subtotal),
    discountTotal: Number(row.discount_total),
    taxTotal: Number(row.tax_total),
    shippingTotal: Number(row.shipping_total),
    total: Number(row.total),
    currency: row.currency,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapItemRow(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productName: row.product_name,
    productSku: row.product_sku,
    unitPrice: Number(row.unit_price),
    quantity: row.quantity,
    lineTotal: Number(row.line_total),
  };
}

async function attachItems(orders: Order[]): Promise<Order[]> {
  if (orders.length === 0) return orders;
  const ids = orders.map((o) => o.id);
  const rows = await query<OrderItemRow>("SELECT * FROM order_items WHERE order_id = ANY($1)", [ids]);
  const byOrder = new Map<number, OrderItem[]>();
  for (const row of rows) {
    const item = mapItemRow(row);
    const list = byOrder.get(item.orderId) ?? [];
    list.push(item);
    byOrder.set(item.orderId, list);
  }
  for (const order of orders) {
    order.items = byOrder.get(order.id) ?? [];
  }
  return orders;
}

export const OrderRepository = {
  generateOrderNumber(): string {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
    return `ORD-${datePart}-${randomPart}`;
  },

  async createOrder(
    client: PoolClient,
    data: {
      orderNumber: string;
      userId: number | null;
      customerEmail: string;
      customerName: string;
      shippingAddressId?: number | null;
      billingAddressId?: number | null;
      subtotal: number;
      discountTotal: number;
      taxTotal: number;
      shippingTotal: number;
      total: number;
      notes?: string | null;
    }
  ): Promise<Order> {
    const result = await client.query<OrderRow>(
      `INSERT INTO orders
         (order_number, user_id, customer_email, customer_name, shipping_address_id, billing_address_id,
          subtotal, discount_total, tax_total, shipping_total, total, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        data.orderNumber,
        data.userId,
        data.customerEmail,
        data.customerName,
        data.shippingAddressId ?? null,
        data.billingAddressId ?? null,
        data.subtotal,
        data.discountTotal,
        data.taxTotal,
        data.shippingTotal,
        data.total,
        data.notes ?? null,
      ]
    );
    return mapOrderRow(result.rows[0]);
  },

  async createOrderItems(
    client: PoolClient,
    orderId: number,
    items: { productId: number; productName: string; productSku: string | null; unitPrice: number; quantity: number }[]
  ): Promise<void> {
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_sku, unit_price, quantity, line_total)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [orderId, item.productId, item.productName, item.productSku, item.unitPrice, item.quantity, item.unitPrice * item.quantity]
      );
    }
  },

  async recordCouponUsage(
    client: PoolClient,
    orderId: number,
    couponId: number,
    couponCode: string,
    discountAmount: number
  ): Promise<void> {
    await client.query(
      `INSERT INTO order_coupons (order_id, coupon_id, coupon_code, discount_amount) VALUES ($1, $2, $3, $4)`,
      [orderId, couponId, couponCode, discountAmount]
    );
    await client.query("UPDATE coupons SET usage_count = usage_count + 1 WHERE id = $1", [couponId]);
  },

  async findById(id: number): Promise<Order | null> {
    const row = await queryOne<OrderRow>("SELECT * FROM orders WHERE id = $1", [id]);
    if (!row) return null;
    const [order] = await attachItems([mapOrderRow(row)]);
    return order;
  },

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const row = await queryOne<OrderRow>("SELECT * FROM orders WHERE order_number = $1", [orderNumber]);
    if (!row) return null;
    const [order] = await attachItems([mapOrderRow(row)]);
    return order;
  },

  async listByUser(userId: number, page = 1, limit = 20): Promise<PaginatedResult<Order>> {
    const offset = (page - 1) * limit;
    const [rows, countRow] = await Promise.all([
      query<OrderRow>(
        "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
        [userId, limit, offset]
      ),
      queryOne<{ count: string }>("SELECT COUNT(*) AS count FROM orders WHERE user_id = $1", [userId]),
    ]);
    const total = Number(countRow?.count ?? 0);
    const items = await attachItems(rows.map(mapOrderRow));
    return { items, meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
  },

  async listAll(filters: { status?: OrderStatus; page?: number; limit?: number }): Promise<PaginatedResult<Order>> {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];
    if (filters.status) {
      params.push(filters.status);
      conditions.push(`status = $${params.length}`);
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countRow = await queryOne<{ count: string }>(`SELECT COUNT(*) AS count FROM orders ${whereClause}`, params);
    const total = Number(countRow?.count ?? 0);

    params.push(limit, offset);
    const rows = await query<OrderRow>(
      `SELECT * FROM orders ${whereClause} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const items = await attachItems(rows.map(mapOrderRow));
    return { items, meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
  },

  async updateStatus(id: number, status: OrderStatus): Promise<Order | null> {
    const row = await queryOne<OrderRow>("UPDATE orders SET status = $2 WHERE id = $1 RETURNING *", [id, status]);
    if (!row) return null;
    const [order] = await attachItems([mapOrderRow(row)]);
    return order;
  },
};
