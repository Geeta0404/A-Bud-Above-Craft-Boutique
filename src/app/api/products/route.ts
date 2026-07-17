import { ProductService } from "@/services/ProductService";
import { requireAdmin } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok, created } from "@/utils/apiResponse";

export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await ProductService.list(searchParams);
  return ok(result.items, 200, result.meta);
});

export const POST = withErrorHandler(async (request: Request) => {
  await requireAdmin(request);
  const body = await request.json();
  const product = await ProductService.create(body);
  return created(product);
});
