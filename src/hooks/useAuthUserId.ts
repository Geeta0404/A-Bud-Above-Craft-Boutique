"use client";

import { useFirebaseUser } from "@/hooks/useFirebaseUser";

// Scopes per-browser data (cart, wishlist) to the signed-in account.
// Returns "guest" while signed out, or while the session is still loading.
export function useAuthUserId(): string {
  const { user } = useFirebaseUser();
  return user?.uid ?? "guest";
}
