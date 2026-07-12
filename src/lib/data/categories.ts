import type { Category } from "@/lib/types";
import { IMG } from "@/lib/images";

export const categories: Category[] = [
  {
    slug: "flower",
    name: "Flower",
    description: "Premium indoor-grown sativa, indica, and hybrid bud.",
    image: IMG.flowerBud1,
  },
  {
    slug: "pre-rolls",
    name: "Pre-Rolls",
    description: "Hand-rolled joints and blunts, ready to enjoy.",
    image: IMG.preRoll1,
  },
  {
    slug: "vaporizers",
    name: "Vaporizers",
    description: "Disposable vapes and 510-thread cartridges.",
    image: IMG.vapePen1,
  },
  {
    slug: "edibles",
    name: "Edibles",
    description: "Gummies and infused treats, precisely dosed.",
    image: IMG.gummies1,
  },
  {
    slug: "concentrates",
    name: "Concentrates",
    description: "Shatter, live resin, and rosin for the connoisseur.",
    image: IMG.concentrate1,
  },
  {
    slug: "topicals",
    name: "Topicals",
    description: "Balms and relief sticks for targeted, non-intoxicating care.",
    image: IMG.topical1,
  },
  {
    slug: "beverages",
    name: "Beverages",
    description: "THC and CBD infused drinks for a lighter way to unwind.",
    image: IMG.beverage1,
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Grinders, papers, and gear for your sesh.",
    image: IMG.accessory1,
  },
];
