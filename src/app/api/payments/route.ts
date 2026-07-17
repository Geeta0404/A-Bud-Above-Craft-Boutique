import { PaymentService } from "@/services/PaymentService";
import { OrderService } from "@/services/OrderService";
import { requireUser } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok } from "@/utils/apiResponse";
import { ValidationError } from "@/utils/errors";

export const GET = withErrorHandler(async (request: Request) => {
  const user = await requireUser(request);
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");
  if (!orderId) throw new ValidationError("orderId query parameter is required");

  // Confirms the caller can see this order (owner or admin) before listing its payments.
  await OrderService.getById(Number(orderId), user);
  const payments = await PaymentService.listByOrder(Number(orderId));
  return ok(payments);
});
