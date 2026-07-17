import { test } from "node:test";
import assert from "node:assert/strict";
import { computeDiscount, assertCouponUsable } from "./coupon.ts";
import type { Coupon } from "@/types/commerce";

function makeCoupon(overrides: Partial<Coupon> = {}): Coupon {
  return {
    id: 1,
    code: "TEST10",
    description: null,
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscountAmount: null,
    usageLimit: null,
    usageCount: 0,
    isActive: true,
    startsAt: null,
    expiresAt: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

test("computeDiscount: percentage discount", () => {
  const coupon = makeCoupon({ discountType: "percentage", discountValue: 10 });
  assert.equal(computeDiscount(coupon, 100), 10);
});

test("computeDiscount: fixed amount discount", () => {
  const coupon = makeCoupon({ discountType: "fixed_amount", discountValue: 15 });
  assert.equal(computeDiscount(coupon, 100), 15);
});

test("computeDiscount: caps at maxDiscountAmount", () => {
  const coupon = makeCoupon({ discountType: "percentage", discountValue: 50, maxDiscountAmount: 20 });
  assert.equal(computeDiscount(coupon, 100), 20);
});

test("computeDiscount: never exceeds the subtotal itself", () => {
  const coupon = makeCoupon({ discountType: "fixed_amount", discountValue: 999 });
  assert.equal(computeDiscount(coupon, 30), 30);
});

test("assertCouponUsable: throws when inactive", () => {
  assert.throws(() => assertCouponUsable(makeCoupon({ isActive: false }), 100), /no longer active/);
});

test("assertCouponUsable: throws before startsAt", () => {
  const coupon = makeCoupon({ startsAt: "2026-06-01T00:00:00.000Z" });
  assert.throws(() => assertCouponUsable(coupon, 100, new Date("2026-01-01T00:00:00.000Z")), /not active yet/);
});

test("assertCouponUsable: throws after expiresAt", () => {
  const coupon = makeCoupon({ expiresAt: "2026-01-01T00:00:00.000Z" });
  assert.throws(() => assertCouponUsable(coupon, 100, new Date("2026-06-01T00:00:00.000Z")), /expired/);
});

test("assertCouponUsable: throws when usage limit reached", () => {
  const coupon = makeCoupon({ usageLimit: 5, usageCount: 5 });
  assert.throws(() => assertCouponUsable(coupon, 100), /usage limit/);
});

test("assertCouponUsable: throws below minOrderAmount", () => {
  const coupon = makeCoupon({ minOrderAmount: 50 });
  assert.throws(() => assertCouponUsable(coupon, 49), /minimum order/);
});

test("assertCouponUsable: passes for a valid coupon", () => {
  const coupon = makeCoupon({ minOrderAmount: 20, usageLimit: 10, usageCount: 2 });
  assert.doesNotThrow(() => assertCouponUsable(coupon, 50));
});
