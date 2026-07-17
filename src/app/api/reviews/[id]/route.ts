import { ReviewService } from "@/services/ReviewService";
import { requireUser } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok } from "@/utils/apiResponse";

export const PUT = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireUser(request);
  const { id } = await params;
  const body = await request.json();
  const review = await ReviewService.update(Number(id), user, body);
  return ok(review);
});

export const DELETE = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireUser(request);
  const { id } = await params;
  await ReviewService.delete(Number(id), user);
  return ok({ deleted: true });
});
