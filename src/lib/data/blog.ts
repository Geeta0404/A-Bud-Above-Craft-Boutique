import type { BlogPost } from "@/lib/types";
import { IMG } from "@/lib/images";

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-store-your-flower-properly",
    title: "How to Store Your Flower Properly",
    excerpt: "Simple tips to keep your flower fresh, potent, and flavourful for longer.",
    content: [
      "Fresh flower is a living product — light, heat, and air all work against it the moment the jar is opened.",
      "Store flower in an airtight glass container, away from direct sunlight and heat sources like windowsills or appliances.",
      "Aim to keep humidity between 59–63%. Too dry and terpenes fade; too humid and you risk mould.",
      "Avoid the freezer — repeated temperature swings make trichomes brittle and can degrade both flavour and potency over time.",
    ],
    image: IMG.flowerBud2,
    author: "A Bud Above Editorial",
    date: "2025-09-02",
    category: "Care Guides",
    readTime: "4 min read",
  },
  {
    slug: "grower-spotlight-bc-smalls",
    title: "Grower Spotlight: BC Smalls",
    excerpt: "A conversation with the indoor growers behind one of our best-selling flower lines.",
    content: [
      "Grown indoors in small batches outside Vancouver, BC Smalls has been curing bud slow since 2018.",
      "\"Smalls are the same plant as full-size flower — just smaller buds off the same colas,\" says head grower Priya. \"Same terpenes, same potency, better value.\"",
      "Every batch is cured for a minimum of three weeks before it reaches our shelves, and lab-tested for potency and purity along the way.",
    ],
    image: IMG.flowerBud5,
    author: "A Bud Above Editorial",
    date: "2025-10-14",
    category: "Grower Spotlight",
    readTime: "5 min read",
  },
  {
    slug: "sativa-vs-indica-vs-hybrid",
    title: "Sativa vs. Indica vs. Hybrid: What's the Difference?",
    excerpt: "A quick, honest guide to what these labels actually tell you — and what they don't.",
    content: [
      "Sativa strains are generally associated with energizing, uplifting effects — often reached for during the day.",
      "Indica strains tend to be linked with more relaxing, body-heavy effects — a common evening pick.",
      "Hybrids blend traits of both parent strains, and most modern flower falls somewhere on that spectrum.",
      "In practice, terpene profile and individual body chemistry matter as much as the sativa/indica label — start low, go slow, and pay attention to what actually works for you.",
    ],
    image: IMG.flowerBud3,
    author: "A Bud Above Editorial",
    date: "2025-11-01",
    category: "Strain Guides",
    readTime: "3 min read",
  },
  {
    slug: "first-timers-guide-to-edibles",
    title: "A First-Timer's Guide to Edibles",
    excerpt: "Onset time, dosing, and what to expect the first time you try an edible.",
    content: [
      "Edibles hit differently than smoking or vaping — effects can take 30 minutes to 2 hours to kick in, and last much longer.",
      "Start with a low dose (2.5–5mg THC) and wait at least two hours before considering more, even if you don't feel anything yet.",
      "Eat on a normal stomach, not empty — it helps make onset a little more predictable.",
      "Every product page lists exact THC and CBD content per unit, so you always know what you're working with before you start.",
    ],
    image: IMG.gummies1,
    author: "A Bud Above Editorial",
    date: "2025-11-20",
    category: "Guides",
    readTime: "6 min read",
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
