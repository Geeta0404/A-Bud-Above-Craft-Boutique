import { ProductService } from "@/services/ProductService";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok } from "@/utils/apiResponse";

export const GET = withErrorHandler(async (_request: Request, { params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const product = await ProductService.getBySlug(slug);
  return ok(product);
});
