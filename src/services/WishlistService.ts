import { z } from "zod";
import { WishlistRepository } from "@/repositories/WishlistRepository";
import { ProductRepository } from "@/repositories/ProductRepository";
import { NotFoundError } from "@/utils/errors";
import type { WishlistItem } from "@/types/commerce";

export const addToWishlistSchema = z.object({
  productId: z.number().int().positive(),
});

export const WishlistService = {
  list: (userId: number) => WishlistRepository.listByUser(userId),

  async add(userId: number, input: unknown): Promise<WishlistItem> {
    const { productId } = addToWishlistSchema.parse(input);
    const product = await ProductRepository.findById(productId);
    if (!product) throw new NotFoundError("Product");
    return WishlistRepository.add(userId, productId);
  },

  async remove(id: number, userId: number): Promise<void> {
    const deleted = await WishlistRepository.remove(id, userId);
    if (!deleted) throw new NotFoundError("Wishlist item");
  },
};
