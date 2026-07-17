import { AdminDashboardService } from "@/services/AdminDashboardService";
import { requireAdmin } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok } from "@/utils/apiResponse";

export const GET = withErrorHandler(async (request: Request) => {
  await requireAdmin(request);
  const stats = await AdminDashboardService.getStats();
  return ok(stats);
});
