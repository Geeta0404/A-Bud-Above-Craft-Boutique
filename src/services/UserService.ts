import { z } from "zod";
import { UserRepository } from "@/repositories/UserRepository";
import { NotFoundError } from "@/utils/errors";
import type { User, UserRole } from "@/types/user";

export const userProfileInputSchema = z.object({
  firstName: z.string().max(100).nullish(),
  lastName: z.string().max(100).nullish(),
  phone: z.string().max(30).nullish(),
});

export const UserService = {
  list: (page?: number, limit?: number) => UserRepository.list(page, limit),

  async getById(id: number): Promise<User> {
    const user = await UserRepository.findById(id);
    if (!user) throw new NotFoundError("User");
    return user;
  },

  async updateProfile(id: number, input: unknown): Promise<User> {
    const data = userProfileInputSchema.parse(input);
    const updated = await UserRepository.updateProfile(id, data);
    if (!updated) throw new NotFoundError("User");
    return updated;
  },

  async updateRole(id: number, role: UserRole): Promise<User> {
    const updated = await UserRepository.updateRole(id, role);
    if (!updated) throw new NotFoundError("User");
    return updated;
  },
};
