import { BrandService } from "@/services/BrandService";
import { requireAdmin } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok, created } from "@/utils/apiResponse";

export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const wantsInactive = searchParams.get("includeInactive") === "true";
  const isAdmin = wantsInactive && (await requireAdmin(request).then(() => true, () => false));
  const brands = await BrandService.list(isAdmin);
  return ok(brands);
});

export const POST = withErrorHandler(async (request: Request) => {
  await requireAdmin(request);
  const body = await request.json();
  const brand = await BrandService.create(body);
  return created(brand);
});
