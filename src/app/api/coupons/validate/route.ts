import { z } from "zod";
import { CouponService } from "@/services/CouponService";
import { withErrorHandler } from "@/middleware/withErrorHandler";
import { ok } from "@/utils/apiResponse";

const validateSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().nonnegative(),
});

export const POST = withErrorHandler(async (request: Request) => {
  const { code, subtotal } = validateSchema.parse(await request.json());
  const { coupon, discountAmount } = await CouponService.validate(code, subtotal);
  return ok({ coupon, discountAmount });
});
