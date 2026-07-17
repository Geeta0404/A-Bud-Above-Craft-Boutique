import { CouponService } from "@/services/CouponService";
import { requireAdmin } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok, created } from "@/utils/apiResponse";

export const GET = withErrorHandler(async (request: Request) => {
  await requireAdmin(request);
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
  const result = await CouponService.list(page, limit);
  return ok(result.items, 200, result.meta);
});

export const POST = withErrorHandler(async (request: Request) => {
  await requireAdmin(request);
  const body = await request.json();
  const coupon = await CouponService.create(body);
  return created(coupon);
});
