import "server-only";
import type { DecodedIdToken } from "firebase-admin/auth";
import { extractBearerToken, verifyIdToken } from "@/lib/firebase/verifyIdToken";
import { UserRepository } from "@/repositories/UserRepository";
import { UnauthorizedError, ForbiddenError } from "@/utils/errors";
import type { User } from "@/types/user";

export async function requireAuth(request: Request): Promise<DecodedIdToken> {
  const token = extractBearerToken(request);
  if (!token) throw new UnauthorizedError("Missing bearer token");

  try {
    return await verifyIdToken(token);
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

// Verifies the token AND ensures a matching row exists in Postgres, creating
// one on first sign-in (Firebase owns the identity, Postgres owns the profile).
export async function requireUser(request: Request): Promise<User> {
  const decoded = await requireAuth(request);
  const user = await UserRepository.upsertFromFirebase({
    firebaseUid: decoded.uid,
    email: decoded.email ?? "",
    isEmailVerified: decoded.email_verified ?? false,
  });
  return user;
}

export async function requireAdmin(request: Request): Promise<User> {
  const user = await requireUser(request);
  if (user.role !== "admin") {
    throw new ForbiddenError("Admin access required");
  }
  return user;
}
