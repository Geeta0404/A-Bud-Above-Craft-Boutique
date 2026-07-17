"use client";

import { useEffect, useState } from "react";
import { onIdTokenChanged, type User } from "firebase/auth";
import { getFirebaseClientAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";

async function syncSessionCookie(user: User | null) {
  if (!user) {
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    return;
  }
  const idToken = await user.getIdToken();
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  }).catch(() => {});
}

// Tracks the signed-in Firebase user client-side and keeps the HttpOnly
// session cookie (read by proxy.ts / Server Components) in sync on every
// sign-in, sign-out, and token refresh.
export function useFirebaseUser(): { user: User | null; loaded: boolean } {
  const configured = isFirebaseClientConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(!configured);

  useEffect(() => {
    if (!configured) return;

    const auth = getFirebaseClientAuth();
    const unsubscribe = onIdTokenChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoaded(true);
      void syncSessionCookie(nextUser);
    });

    return unsubscribe;
  }, [configured]);

  return { user, loaded };
}
