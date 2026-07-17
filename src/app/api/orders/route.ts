import { OrderService } from "@/services/OrderService";
import { requireUser } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok, created } from "@/utils/apiResponse";
import type { OrderStatus } from "@/types/commerce";

const VALID_STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];

export const GET = withErrorHandler(async (request: Request) => {
  const user = await requireUser(request);
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const status = VALID_STATUSES.includes(statusParam as OrderStatus) ? (statusParam as OrderStatus) : undefined;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

  const result = await OrderService.list(user, { status, page, limit });
  return ok(result.items, 200, result.meta);
});

export const POST = withErrorHandler(async (request: Request) => {
  const user = await requireUser(request);
  const body = await request.json();
  const order = await OrderService.create(user, body);
  return created(order);
});
