import { z } from "zod";
import { ReviewRepository } from "@/repositories/ReviewRepository";
import { ProductRepository } from "@/repositories/ProductRepository";
import { ForbiddenError, NotFoundError } from "@/utils/errors";
import type { Review } from "@/types/review";
import type { User } from "@/types/user";

export const reviewInputSchema = z.object({
  productId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(150).nullish(),
  body: z.string().max(5000).nullish(),
});

export const reviewUpdateSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().max(150).nullish(),
  body: z.string().max(5000).nullish(),
  isApproved: z.boolean().optional(),
});

export const ReviewService = {
  listByProduct: (productId: number, page?: number, limit?: number) =>
    ReviewRepository.listByProduct(productId, page, limit),

  async create(userId: number, input: unknown): Promise<Review> {
    const data = reviewInputSchema.parse(input);
    const product = await ProductRepository.findById(data.productId);
    if (!product) throw new NotFoundError("Product");
    return ReviewRepository.create(userId, data.productId, data.rating, data.title ?? null, data.body ?? null);
  },

  async update(id: number, actor: User, input: unknown): Promise<Review> {
    const existing = await ReviewRepository.findById(id);
    if (!existing) throw new NotFoundError("Review");

    const isOwner = existing.userId === actor.id;
    const isAdmin = actor.role === "admin";
    if (!isOwner && !isAdmin) throw new ForbiddenError();

    const data = reviewUpdateSchema.parse(input);
    // Only an admin may toggle moderation status; owners editing their own
    // review can't silently re-approve it.
    if (data.isApproved !== undefined && !isAdmin) delete data.isApproved;

    const updated = await ReviewRepository.update(id, data);
    if (!updated) throw new NotFoundError("Review");
    return updated;
  },

  async delete(id: number, actor: User): Promise<void> {
    const existing = await ReviewRepository.findById(id);
    if (!existing) throw new NotFoundError("Review");

    const isOwner = existing.userId === actor.id;
    const isAdmin = actor.role === "admin";
    if (!isOwner && !isAdmin) throw new ForbiddenError();

    await ReviewRepository.delete(id);
  },
};
