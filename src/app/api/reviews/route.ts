import { ReviewService } from "@/services/ReviewService";
import { requireUser } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok, created } from "@/utils/apiResponse";
import { ValidationError } from "@/utils/errors";

export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  if (!productId) throw new ValidationError("productId query parameter is required");

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
  const result = await ReviewService.listByProduct(Number(productId), page, limit);
  return ok(result.items, 200, result.meta);
});

export const POST = withErrorHandler(async (request: Request) => {
  const user = await requireUser(request);
  const body = await request.json();
  const review = await ReviewService.create(user.id, body);
  return created(review);
});
