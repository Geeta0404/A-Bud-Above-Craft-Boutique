import { UserService } from "@/services/UserService";
import { requireUser } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok } from "@/utils/apiResponse";

export const GET = withErrorHandler(async (request: Request) => {
  // requireUser() upserts the Postgres row from the verified Firebase token,
  // so calling this after sign-in also doubles as first-login provisioning.
  const user = await requireUser(request);
  return ok(user);
});

export const PUT = withErrorHandler(async (request: Request) => {
  const user = await requireUser(request);
  const body = await request.json();
  const updated = await UserService.updateProfile(user.id, body);
  return ok(updated);
});
