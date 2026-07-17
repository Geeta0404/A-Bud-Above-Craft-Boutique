import { z } from "zod";
import { ProductService } from "@/services/ProductService";
import { requireAdmin } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok } from "@/utils/apiResponse";

const setStockSchema = z.object({
  quantity: z.number().int().nonnegative(),
});

export const PUT = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin(request);
  const { id } = await params;
  const { quantity } = setStockSchema.parse(await request.json());
  const product = await ProductService.setStock(Number(id), quantity);
  return ok(product);
});
