import { z } from "zod";
import { withTransaction } from "@/lib/db/query";
import { OrderRepository } from "@/repositories/OrderRepository";
import { ProductRepository } from "@/repositories/ProductRepository";
import { CartRepository } from "@/repositories/CartRepository";
import { PaymentRepository } from "@/repositories/PaymentRepository";
import { CouponService, computeDiscount, assertCouponUsable } from "@/services/CouponService";
import { CouponRepository } from "@/repositories/CouponRepository";
import { ForbiddenError, NotFoundError, ValidationError } from "@/utils/errors";
import type { Order, OrderStatus } from "@/types/commerce";
import type { PaginatedResult } from "@/types/api";
import type { User } from "@/types/user";

export const createOrderSchema = z.object({
  shippingAddressId: z.number().int().positive().nullish(),
  billingAddressId: z.number().int().positive().nullish(),
  notes: z.string().max(2000).nullish(),
  couponCode: z.string().max(50).nullish(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .optional(),
});

// Tax and shipping calculation are business decisions outside this backend's
// scope (jurisdiction, carrier rates, etc.) — both default to 0 as an
// intentional extension point rather than an invented number.
const TAX_TOTAL = 0;
const SHIPPING_TOTAL = 0;

export const OrderService = {
  async create(user: User, input: unknown): Promise<Order> {
    const data = createOrderSchema.parse(input);

    const usingCart = !data.items || data.items.length === 0;
    const sourceItems = usingCart
      ? (await CartRepository.listByUser(user.id)).map((c) => ({ productId: c.productId, quantity: c.quantity }))
      : data.items!;

    if (sourceItems.length === 0) {
      throw new ValidationError("No items to order — cart is empty and no items were provided");
    }

    const lineItems: { productId: number; productName: string; productSku: string | null; unitPrice: number; quantity: number }[] = [];
    let subtotal = 0;

    for (const item of sourceItems) {
      const product = await ProductRepository.findById(item.productId);
      if (!product || !product.isActive) throw new NotFoundError(`Product ${item.productId}`);
      if (product.stockQuantity < item.quantity) {
        throw new ValidationError(`Not enough stock for "${product.name}" (${product.stockQuantity} available)`);
      }
      lineItems.push({
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        unitPrice: product.price,
        quantity: item.quantity,
      });
      subtotal += product.price * item.quantity;
    }

    let discountTotal = 0;
    let appliedCoupon: Awaited<ReturnType<typeof CouponService.getById>> | null = null;
    if (data.couponCode) {
      const coupon = await CouponRepository.findByCode(data.couponCode);
      if (!coupon) throw new NotFoundError("Coupon");
      assertCouponUsable(coupon, subtotal);
      discountTotal = computeDiscount(coupon, subtotal);
      appliedCoupon = coupon;
    }

    const total = Math.max(0, subtotal - discountTotal + TAX_TOTAL + SHIPPING_TOTAL);
    const customerName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

    const orderId = await withTransaction(async (client) => {
      for (const item of lineItems) {
        await ProductRepository.decrementStock(client, item.productId, item.quantity);
      }

      const order = await OrderRepository.createOrder(client, {
        orderNumber: OrderRepository.generateOrderNumber(),
        userId: user.id,
        customerEmail: user.email,
        customerName,
        shippingAddressId: data.shippingAddressId,
        billingAddressId: data.billingAddressId,
        subtotal,
        discountTotal,
        taxTotal: TAX_TOTAL,
        shippingTotal: SHIPPING_TOTAL,
        total,
        notes: data.notes,
      });

      await OrderRepository.createOrderItems(client, order.id, lineItems);

      if (appliedCoupon) {
        await OrderRepository.recordCouponUsage(client, order.id, appliedCoupon.id, appliedCoupon.code, discountTotal);
      }

      await PaymentRepository.create(client, { orderId: order.id, provider: "stripe", amount: total });

      return order.id;
    });

    if (usingCart) {
      await CartRepository.clearForUser(user.id);
    }

    return (await OrderRepository.findById(orderId))!;
  },

  async getById(id: number, actor: User): Promise<Order> {
    const order = await OrderRepository.findById(id);
    if (!order) throw new NotFoundError("Order");
    if (actor.role !== "admin" && order.userId !== actor.id) throw new ForbiddenError();
    return order;
  },

  async list(actor: User, params: { status?: OrderStatus; page?: number; limit?: number }): Promise<PaginatedResult<Order>> {
    if (actor.role === "admin") {
      return OrderRepository.listAll(params);
    }
    return OrderRepository.listByUser(actor.id, params.page, params.limit);
  },

  async updateStatus(id: number, actor: User, status: OrderStatus): Promise<Order> {
    const order = await OrderRepository.findById(id);
    if (!order) throw new NotFoundError("Order");

    if (actor.role !== "admin") {
      if (order.userId !== actor.id) throw new ForbiddenError();
      if (status !== "cancelled" || order.status !== "pending") {
        throw new ForbiddenError("You can only cancel your own pending orders");
      }
    }

    const updated = await OrderRepository.updateStatus(id, status);
    return updated!;
  },
};
