import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop All Handcrafted Goods",
  description: "Browse candles, pottery, woodwork, textile art, home décor, and gifts handmade by independent artisans.",
};

export default function ShopPage() {
  return (
    <Suspense>
      <ShopClient />
    </Suspense>
  );
}
