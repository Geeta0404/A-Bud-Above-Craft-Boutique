import { z } from "zod";
import { CouponRepository } from "@/repositories/CouponRepository";
import { NotFoundError } from "@/utils/errors";
import { computeDiscount, assertCouponUsable } from "@/utils/coupon";
import type { Coupon } from "@/types/commerce";

export { computeDiscount, assertCouponUsable };

export const couponInputSchema = z.object({
  code: z.string().min(1).max(50),
  description: z.string().max(255).nullish(),
  discountType: z.enum(["percentage", "fixed_amount"]),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().nonnegative().optional(),
  maxDiscountAmount: z.number().nonnegative().nullish(),
  usageLimit: z.number().int().positive().nullish(),
  isActive: z.boolean().optional(),
  startsAt: z.string().datetime().nullish(),
  expiresAt: z.string().datetime().nullish(),
});

export const CouponService = {
  list: (page?: number, limit?: number) => CouponRepository.list(page, limit),

  async getById(id: number): Promise<Coupon> {
    const coupon = await CouponRepository.findById(id);
    if (!coupon) throw new NotFoundError("Coupon");
    return coupon;
  },

  async validate(code: string, subtotal: number): Promise<{ coupon: Coupon; discountAmount: number }> {
    const coupon = await CouponRepository.findByCode(code);
    if (!coupon) throw new NotFoundError("Coupon");
    assertCouponUsable(coupon, subtotal);
    return { coupon, discountAmount: computeDiscount(coupon, subtotal) };
  },

  async create(input: unknown): Promise<Coupon> {
    const data = couponInputSchema.parse(input);
    return CouponRepository.create(data);
  },

  async update(id: number, input: unknown): Promise<Coupon> {
    const data = couponInputSchema.partial().parse(input);
    const updated = await CouponRepository.update(id, data);
    if (!updated) throw new NotFoundError("Coupon");
    return updated;
  },

  async delete(id: number): Promise<void> {
    const deleted = await CouponRepository.delete(id);
    if (!deleted) throw new NotFoundError("Coupon");
  },
};
