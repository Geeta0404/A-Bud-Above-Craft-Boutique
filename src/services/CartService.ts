import { z } from "zod";
import { CartRepository } from "@/repositories/CartRepository";
import { ProductRepository } from "@/repositories/ProductRepository";
import { ForbiddenError, NotFoundError, ValidationError } from "@/utils/errors";
import type { CartItem } from "@/types/commerce";

export const addToCartSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive(),
});

export const CartService = {
  list: (userId: number) => CartRepository.listByUser(userId),

  async add(userId: number, input: unknown): Promise<CartItem> {
    const data = addToCartSchema.parse(input);
    const product = await ProductRepository.findById(data.productId);
    if (!product || !product.isActive) throw new NotFoundError("Product");
    if (product.stockQuantity < data.quantity) throw new ValidationError("Not enough stock available");
    return CartRepository.upsert(userId, data.productId, data.quantity);
  },

  async updateQuantity(id: number, userId: number, input: unknown): Promise<CartItem> {
    const { quantity } = updateCartItemSchema.parse(input);
    const item = await CartRepository.findById(id);
    if (!item) throw new NotFoundError("Cart item");
    if (item.userId !== userId) throw new ForbiddenError();

    const product = await ProductRepository.findById(item.productId);
    if (product && product.stockQuantity < quantity) throw new ValidationError("Not enough stock available");

    const updated = await CartRepository.updateQuantity(id, userId, quantity);
    if (!updated) throw new NotFoundError("Cart item");
    return updated;
  },

  async remove(id: number, userId: number): Promise<void> {
    const deleted = await CartRepository.remove(id, userId);
    if (!deleted) throw new NotFoundError("Cart item");
  },
};
