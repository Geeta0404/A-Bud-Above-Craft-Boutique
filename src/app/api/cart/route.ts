import { CartService } from "@/services/CartService";
import { requireUser } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok, created } from "@/utils/apiResponse";

export const GET = withErrorHandler(async (request: Request) => {
  const user = await requireUser(request);
  const items = await CartService.list(user.id);
  return ok(items);
});

export const POST = withErrorHandler(async (request: Request) => {
  const user = await requireUser(request);
  const body = await request.json();
  const item = await CartService.add(user.id, body);
  return created(item);
});
