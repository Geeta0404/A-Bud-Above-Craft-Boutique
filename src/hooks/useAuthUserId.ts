"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Scopes per-browser data (cart, wishlist) to the signed-in account.
// Returns "guest" while signed out, or while the session is still loading.
export function useAuthUserId(): string {
  const [userId, setUserId] = useState("guest");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? "guest");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? "guest");
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return userId;
}
