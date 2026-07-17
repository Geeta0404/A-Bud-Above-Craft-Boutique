import { z } from "zod";
import { UserService } from "@/services/UserService";
import { requireAdmin } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok } from "@/utils/apiResponse";

const updateRoleSchema = z.object({
  role: z.enum(["customer", "admin"]),
});

export const PUT = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin(request);
  const { id } = await params;
  const { role } = updateRoleSchema.parse(await request.json());
  const user = await UserService.updateRole(Number(id), role);
  return ok(user);
});
