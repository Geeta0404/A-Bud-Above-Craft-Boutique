"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuthUserId } from "@/hooks/useAuthUserId";

type WishlistContextValue = {
  slugs: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const storageKeyFor = (userId: string) => `aba-wishlist-${userId}`;

export function WishlistProvider({ children }: { children: ReactNode }) {
  const userId = useAuthUserId();
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Re-hydrate from this account's own storage bucket whenever the signed-in user changes.
  useEffect(() => {
    setHydrated(false);
    try {
      const raw = localStorage.getItem(storageKeyFor(userId));
      setSlugs(raw ? JSON.parse(raw) : []);
    } catch {
      setSlugs([]);
    }
    setHydrated(true);
  }, [userId]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(storageKeyFor(userId), JSON.stringify(slugs));
  }, [slugs, hydrated, userId]);

  const toggle = (slug: string) =>
    setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));

  const has = (slug: string) => slugs.includes(slug);

  return <WishlistContext.Provider value={{ slugs, toggle, has }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
