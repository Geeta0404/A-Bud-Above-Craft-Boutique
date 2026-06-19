"use client";

import { useEffect } from "react";
import { trackRecentlyViewed } from "@/hooks/useRecentlyViewed";

export function TrackView({ slug }: { slug: string }) {
  useEffect(() => {
    trackRecentlyViewed(slug);
  }, [slug]);

  return null;
}
