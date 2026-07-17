import "server-only";
import type { DecodedIdToken } from "firebase-admin/auth";
import { verifyIdToken } from "@/lib/firebase/verifyIdToken";

export const SESSION_COOKIE = "session";

export async function verifySessionCookie(token: string | undefined): Promise<DecodedIdToken | null> {
  if (!token) return null;
  try {
    return await verifyIdToken(token);
  } catch {
    return null;
  }
}
