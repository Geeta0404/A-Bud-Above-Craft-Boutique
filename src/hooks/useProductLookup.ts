"use client";

import { useEffect, useState } from "react";

type ProductLookup = { brand: string; size: string };

// Cart/checkout items only carry {slug, name, price, image, quantity}; this
// fills in the extra display fields (brand, size) via the public product API
// since client components can't import server-only data functions directly.
export function useProductLookup(slugs: string[]): Record<string, ProductLookup> {
  const [lookup, setLookup] = useState<Record<string, ProductLookup>>({});
  const key = slugs.join(",");

  useEffect(() => {
    if (!key) return;
    let cancelled = false;

    Promise.all(
      key.split(",").map((slug) =>
        fetch(`/api/products/slug/${slug}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((body) => [slug, body?.data] as const)
          .catch(() => [slug, null] as const)
      )
    ).then((results) => {
      if (cancelled) return;
      const next: Record<string, ProductLookup> = {};
      for (const [slug, data] of results) {
        if (data) next[slug] = { brand: data.brandName ?? "", size: data.size ?? "" };
      }
      setLookup(next);
    });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return lookup;
}
