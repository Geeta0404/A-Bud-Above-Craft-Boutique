import type { BlogPost } from "@/lib/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "caring-for-handmade-pottery",
    title: "How to Care for Your Handmade Pottery",
    excerpt: "Simple tips to keep your stoneware and ceramic pieces beautiful for years to come.",
    content: [
      "Handmade pottery carries the marks of the hands that shaped it, and a little extra care goes a long way toward keeping those details vibrant.",
      "Hand-wash glazed stoneware when possible, even if it's labelled dishwasher safe — high heat and harsh detergents can dull glazes over time.",
      "Avoid sudden temperature changes, like moving a piece straight from the fridge to a hot oven, which can cause cracking.",
      "Store pieces with felt or cloth between them to prevent chipping, and let unglazed terracotta breathe rather than sealing it in plastic.",
    ],
    image: "https://images.unsplash.com/photo-1565193298357-c7b9b2e2ad4d?q=80&w=1200&auto=format&fit=crop",
    author: "Riverstone Ceramics",
    date: "2025-09-02",
    category: "Care Guides",
    readTime: "4 min read",
  },
  {
    slug: "meet-the-makers-northbound-woodshop",
    title: "Meet the Makers: Northbound Woodshop",
    excerpt: "A conversation with the husband-and-wife duo behind our best-selling walnut boards.",
    content: [
      "Tucked into a converted barn outside Peterborough, Ontario, Northbound Woodshop has been milling reclaimed hardwood since 2016.",
      "\"We only work with wood that's already lived a life,\" says co-founder Tom. \"Old barn beams, storm-fallen trees — every board has a story before it even reaches our shop.\"",
      "Each piece passes through six pairs of hands before it ships, from rough milling to the final hand-rubbed oil finish.",
    ],
    image: "https://images.unsplash.com/photo-1601058268499-e52e8b850b97?q=80&w=1200&auto=format&fit=crop",
    author: "A Bud Above Editorial",
    date: "2025-10-14",
    category: "Artisan Spotlight",
    readTime: "5 min read",
  },
  {
    slug: "candle-care-101",
    title: "Candle Care 101: Getting the Most From Your Burn",
    excerpt: "Trim, burn, and store your soy candles the right way for an even, long-lasting glow.",
    content: [
      "On the first burn, let your candle pool wax all the way to the edge of the vessel — this prevents tunnelling later on.",
      "Trim the wick to about 6mm before each burn to keep the flame steady and reduce soot.",
      "Keep burns under four hours at a time, and always burn on a heat-safe, level surface away from drafts.",
    ],
    image: "https://images.unsplash.com/photo-1602874801007-bd36c0cfcfae?q=80&w=1200&auto=format&fit=crop",
    author: "Maple & Ember Co.",
    date: "2025-11-01",
    category: "Care Guides",
    readTime: "3 min read",
  },
  {
    slug: "gifting-guide-for-the-holidays",
    title: "A Handmade Gifting Guide for the Holidays",
    excerpt: "Thoughtful, Canadian-made gift ideas for everyone on your list this season.",
    content: [
      "Skip the mass-produced gift aisle this year — every piece in this guide is made by a small Canadian studio or workshop.",
      "For the home cook: our carved maple spoon set or live-edge walnut board.",
      "For the cozy homebody: a chunky knit throw or our balsam fir candle.",
      "For the person who has everything: a curated artisan gift box, packed and ribboned by hand.",
    ],
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop",
    author: "A Bud Above Editorial",
    date: "2025-11-20",
    category: "Gift Guides",
    readTime: "6 min read",
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
