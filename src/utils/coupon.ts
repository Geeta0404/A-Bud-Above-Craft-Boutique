import { ValidationError } from "./errors.ts";
import type { Coupon } from "@/types/commerce";

// Pure coupon math, deliberately free of any DB/repository import so it can
// be unit tested without a database connection.
export function computeDiscount(coupon: Coupon, subtotal: number): number {
  const raw = coupon.discountType === "percentage" ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
  const capped = coupon.maxDiscountAmount !== null ? Math.min(raw, coupon.maxDiscountAmount) : raw;
  return Math.min(capped, subtotal);
}

export function assertCouponUsable(coupon: Coupon, subtotal: number, now = new Date()): void {
  if (!coupon.isActive) throw new ValidationError("This coupon is no longer active");
  if (coupon.startsAt && now < new Date(coupon.startsAt)) throw new ValidationError("This coupon is not active yet");
  if (coupon.expiresAt && now > new Date(coupon.expiresAt)) throw new ValidationError("This coupon has expired");
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    throw new ValidationError("This coupon has reached its usage limit");
  }
  if (subtotal < coupon.minOrderAmount) {
    throw new ValidationError(`This coupon requires a minimum order of $${coupon.minOrderAmount.toFixed(2)}`);
  }
}
