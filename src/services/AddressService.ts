import { z } from "zod";
import { AddressRepository } from "@/repositories/AddressRepository";
import { ForbiddenError, NotFoundError } from "@/utils/errors";
import type { Address } from "@/types/user";

export const addressInputSchema = z.object({
  label: z.string().max(50).nullish(),
  fullName: z.string().min(1).max(150),
  phone: z.string().max(30).nullish(),
  line1: z.string().min(1).max(255),
  line2: z.string().max(255).nullish(),
  city: z.string().min(1).max(100),
  province: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  country: z.string().max(100).optional(),
  isDefault: z.boolean().optional(),
});

export const AddressService = {
  list: (userId: number) => AddressRepository.listByUser(userId),

  async create(userId: number, input: unknown): Promise<Address> {
    const data = addressInputSchema.parse(input);
    return AddressRepository.create(userId, data);
  },

  async update(id: number, userId: number, input: unknown): Promise<Address> {
    const existing = await AddressRepository.findById(id);
    if (!existing) throw new NotFoundError("Address");
    if (existing.userId !== userId) throw new ForbiddenError();

    const data = addressInputSchema.partial().parse(input);
    const updated = await AddressRepository.update(id, userId, data);
    if (!updated) throw new NotFoundError("Address");
    return updated;
  },

  async delete(id: number, userId: number): Promise<void> {
    const deleted = await AddressRepository.delete(id, userId);
    if (!deleted) throw new NotFoundError("Address");
  },
};
