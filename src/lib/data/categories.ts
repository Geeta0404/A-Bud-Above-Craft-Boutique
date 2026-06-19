import type { Category } from "@/lib/types";
import { IMG } from "@/lib/images";

export const categories: Category[] = [
  {
    slug: "candles",
    name: "Candles & Fragrance",
    description: "Hand-poured soy candles infused with natural botanicals.",
    image: IMG.candleJar,
  },
  {
    slug: "pottery",
    name: "Pottery & Ceramics",
    description: "Wheel-thrown stoneware and porcelain, glazed by hand.",
    image: IMG.potteryBowls,
  },
  {
    slug: "woodwork",
    name: "Woodwork",
    description: "Live-edge and joinery pieces from reclaimed timber.",
    image: IMG.woodworkers,
  },
  {
    slug: "home-decor",
    name: "Home Décor",
    description: "Curated accents that bring warmth and texture to any room.",
    image: IMG.linenPillow,
  },
  {
    slug: "textile-art",
    name: "Textile Art",
    description: "Woven wall hangings, macramé, and hand-loomed throws.",
    image: IMG.macrame,
  },
  {
    slug: "gifts",
    name: "Gifts",
    description: "Thoughtfully boxed sets for every occasion.",
    image: IMG.giftBox,
  },
  {
    slug: "seasonal",
    name: "Seasonal Collection",
    description: "Limited-run pieces inspired by the changing seasons.",
    image: IMG.wreath,
  },
];
