import { ProductService } from "@/services/ProductService";
import { requireAdmin } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok } from "@/utils/apiResponse";

export const GET = withErrorHandler(async (request: Request) => {
  await requireAdmin(request);
  const { searchParams } = new URL(request.url);
  const threshold = searchParams.get("threshold") ? Number(searchParams.get("threshold")) : undefined;
  const products = await ProductService.lowStock(threshold);
  return ok(products);
});
