import { AddressService } from "@/services/AddressService";
import { requireUser } from "@/middleware/withAuth";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok, created } from "@/utils/apiResponse";

export const GET = withErrorHandler(async (request: Request) => {
  const user = await requireUser(request);
  const addresses = await AddressService.list(user.id);
  return ok(addresses);
});

export const POST = withErrorHandler(async (request: Request) => {
  const user = await requireUser(request);
  const body = await request.json();
  const address = await AddressService.create(user.id, body);
  return created(address);
});
