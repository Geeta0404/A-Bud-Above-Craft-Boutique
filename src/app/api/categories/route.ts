import { CategoryService } from "@/services/CategoryService";
import { requireAdmin } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok, created } from "@/utils/apiResponse";

export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const wantsInactive = searchParams.get("includeInactive") === "true";
  const isAdmin = wantsInactive && (await requireAdmin(request).then(() => true, () => false));
  const categories = await CategoryService.list(isAdmin);
  return ok(categories);
});

export const POST = withErrorHandler(async (request: Request) => {
  await requireAdmin(request);
  const body = await request.json();
  const category = await CategoryService.create(body);
  return created(category);
});
