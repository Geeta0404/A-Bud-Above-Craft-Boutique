import { WishlistService } from "@/services/WishlistService";
import { requireUser } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok } from "@/utils/apiResponse";

export const DELETE = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireUser(request);
  const { id } = await params;
  await WishlistService.remove(Number(id), user.id);
  return ok({ deleted: true });
});
