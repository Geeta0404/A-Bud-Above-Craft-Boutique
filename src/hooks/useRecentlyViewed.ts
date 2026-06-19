"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "aba-recently-viewed";
const MAX_ITEMS = 8;

function readStored(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useRecentlyViewed() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
    setSlugs(readStored());
  }, []);

  return slugs;
}

export function trackRecentlyViewed(slug: string) {
  const current = readStored().filter((s) => s !== slug);
  const updated = [slug, ...current].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
