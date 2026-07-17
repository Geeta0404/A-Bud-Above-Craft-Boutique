import "server-only";
import { query, queryOne } from "@/lib/db/query";
import { ProductRepository } from "@/repositories/ProductRepository";
import { OrderRepository } from "@/repositories/OrderRepository";
import type { Order } from "@/types/commerce";

export type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  lowStockCount: number;
  recentOrders: Order[];
};

export const AdminDashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [productCount, userCount, revenueRow, statusRows, lowStock, recent] = await Promise.all([
      queryOne<{ count: string }>("SELECT COUNT(*) AS count FROM products"),
      queryOne<{ count: string }>("SELECT COUNT(*) AS count FROM users"),
      queryOne<{ sum: string | null }>(
        "SELECT SUM(total) AS sum FROM orders WHERE status IN ('delivered', 'shipped', 'processing')"
      ),
      query<{ status: string; count: string }>("SELECT status, COUNT(*) AS count FROM orders GROUP BY status"),
      ProductRepository.lowStock(10),
      OrderRepository.listAll({ page: 1, limit: 5 }),
    ]);

    const ordersByStatus: Record<string, number> = {};
    for (const row of statusRows) ordersByStatus[row.status] = Number(row.count);

    return {
      totalProducts: Number(productCount?.count ?? 0),
      totalOrders: Object.values(ordersByStatus).reduce((sum, count) => sum + count, 0),
      totalUsers: Number(userCount?.count ?? 0),
      totalRevenue: Number(revenueRow?.sum ?? 0),
      ordersByStatus,
      lowStockCount: lowStock.length,
      recentOrders: recent.items,
    };
  },
};
