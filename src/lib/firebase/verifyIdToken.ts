import "server-only";
import type { DecodedIdToken } from "firebase-admin/auth";
import { getFirebaseAuth } from "@/lib/firebase/firebase-admin";

export function extractBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

export async function verifyIdToken(idToken: string): Promise<DecodedIdToken> {
  return getFirebaseAuth().verifyIdToken(idToken);
}
