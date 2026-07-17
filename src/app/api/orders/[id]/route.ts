import { z } from "zod";
import { OrderService } from "@/services/OrderService";
import { requireUser } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok } from "@/utils/apiResponse";

const updateOrderSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]),
});

export const GET = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireUser(request);
  const { id } = await params;
  const order = await OrderService.getById(Number(id), user);
  return ok(order);
});

export const PUT = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireUser(request);
  const { id } = await params;
  const body = updateOrderSchema.parse(await request.json());
  const order = await OrderService.updateStatus(Number(id), user, body.status);
  return ok(order);
});
