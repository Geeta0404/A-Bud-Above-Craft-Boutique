import "server-only";
import { cookies } from "next/headers";
import { verifySessionCookie, SESSION_COOKIE } from "@/lib/firebase/session";
import { UserRepository } from "@/repositories/UserRepository";
import type { User } from "@/types/user";

export async function requireAdmin(): Promise<User | null> {
  const cookieStore = await cookies();
  const decoded = await verifySessionCookie(cookieStore.get(SESSION_COOKIE)?.value);
  if (!decoded) return null;

  const user = await UserRepository.findByFirebaseUid(decoded.uid);
  if (!user || user.role !== "admin") return null;

  return user;
}
