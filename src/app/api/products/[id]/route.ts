import { ProductService } from "@/services/ProductService";
import { requireAdmin } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok } from "@/utils/apiResponse";

export const GET = withErrorHandler(async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const product = await ProductService.getById(Number(id));
  return ok(product);
});

export const PUT = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin(request);
  const { id } = await params;
  const body = await request.json();
  const product = await ProductService.update(Number(id), body);
  return ok(product);
});

export const DELETE = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin(request);
  const { id } = await params;
  await ProductService.delete(Number(id));
  return ok({ deleted: true });
});
