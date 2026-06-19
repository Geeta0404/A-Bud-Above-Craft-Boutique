import type { Workshop } from "@/lib/types";

export const workshops: Workshop[] = [
  {
    slug: "intro-to-wheel-throwing",
    title: "Intro to Wheel Throwing",
    description: "A hands-on beginner pottery class — leave with two pieces you've thrown yourself.",
    image: "https://images.unsplash.com/photo-1565193298357-c7b9b2e2ad4d?q=80&w=1200&auto=format&fit=crop",
    date: "2026-07-12",
    time: "10:00 AM – 1:00 PM",
    location: "Riverstone Ceramics Studio, Toronto",
    price: 95,
    seatsLeft: 4,
    instructor: "Riverstone Ceramics",
  },
  {
    slug: "soy-candle-making-workshop",
    title: "Soy Candle Making Workshop",
    description: "Blend your own fragrance and pour two custom candles to take home.",
    image: "https://images.unsplash.com/photo-1602874801007-bd36c0cfcfae?q=80&w=1200&auto=format&fit=crop",
    date: "2026-07-19",
    time: "2:00 PM – 4:00 PM",
    location: "Maple & Ember Studio, Halifax",
    price: 65,
    seatsLeft: 8,
    instructor: "Maple & Ember Co.",
  },
  {
    slug: "intro-to-woodworking-joinery",
    title: "Intro to Hand-Tool Joinery",
    description: "Learn classic finger-joint techniques while building a small keepsake box.",
    image: "https://images.unsplash.com/photo-1601058268499-e52e8b850b97?q=80&w=1200&auto=format&fit=crop",
    date: "2026-08-02",
    time: "9:00 AM – 3:00 PM",
    location: "Northbound Woodshop, Peterborough",
    price: 140,
    seatsLeft: 2,
    instructor: "Northbound Woodshop",
  },
  {
    slug: "macrame-for-beginners",
    title: "Macramé for Beginners",
    description: "Tie your first knots and finish a plant hanger to take home the same day.",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1200&auto=format&fit=crop",
    date: "2026-08-09",
    time: "1:00 PM – 3:30 PM",
    location: "Thistle & Loom Studio, Montréal",
    price: 55,
    seatsLeft: 10,
    instructor: "Thistle & Loom",
  },
];

export function getWorkshopBySlug(slug: string) {
  return workshops.find((w) => w.slug === slug);
}
