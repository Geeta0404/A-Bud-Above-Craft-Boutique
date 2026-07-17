import { BrandService } from "@/services/BrandService";
import { requireAdmin } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok } from "@/utils/apiResponse";

export const GET = withErrorHandler(async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const brand = await BrandService.getById(Number(id));
  return ok(brand);
});

export const PUT = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin(request);
  const { id } = await params;
  const body = await request.json();
  const brand = await BrandService.update(Number(id), body);
  return ok(brand);
});

export const DELETE = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin(request);
  const { id } = await params;
  await BrandService.delete(Number(id));
  return ok({ deleted: true });
});
