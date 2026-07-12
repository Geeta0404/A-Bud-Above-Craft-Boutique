import type { Workshop } from "@/lib/types";
import { IMG } from "@/lib/images";

export const workshops: Workshop[] = [
  {
    slug: "rolling-techniques-101",
    title: "Rolling Techniques 101",
    description: "Master the perfect roll with hands-on guidance from our team — leave with the technique down.",
    image: IMG.preRoll2,
    date: "2026-07-12",
    time: "10:00 AM – 12:00 PM",
    location: "A Bud Above — Granville Street, Vancouver",
    price: 35,
    seatsLeft: 6,
    instructor: "A Bud Above Team",
  },
  {
    slug: "terpene-aroma-tasting",
    title: "Terpene & Aroma Tasting",
    description: "A guided nosing session through our favourite strains — learn to identify terpene profiles by scent alone.",
    image: IMG.flowerBud3,
    date: "2026-07-19",
    time: "2:00 PM – 3:30 PM",
    location: "A Bud Above — Granville Street, Vancouver",
    price: 25,
    seatsLeft: 8,
    instructor: "A Bud Above Team",
  },
  {
    slug: "edibles-dosing-101",
    title: "Edibles & Dosing 101",
    description: "Learn how to read labels, gauge onset time, and dose edibles confidently and safely.",
    image: IMG.gummies4,
    date: "2026-08-02",
    time: "1:00 PM – 2:30 PM",
    location: "A Bud Above — Granville Street, Vancouver",
    price: 20,
    seatsLeft: 10,
    instructor: "A Bud Above Team",
  },
  {
    slug: "intro-to-vapes-concentrates",
    title: "Intro to Vapes & Concentrates",
    description: "A hands-on look at device types, temperature control, and choosing the right setup for you.",
    image: IMG.concentrate3,
    date: "2026-08-09",
    time: "1:00 PM – 3:00 PM",
    location: "A Bud Above — Granville Street, Vancouver",
    price: 30,
    seatsLeft: 5,
    instructor: "A Bud Above Team",
  },
];

export function getWorkshopBySlug(slug: string) {
  return workshops.find((w) => w.slug === slug);
}
