"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";

const SLIDES = [
  {
    image: IMG.flowerBud3,
    eyebrow: "Weekly Deals",
    title: "Save Up to 20% on Select Flower",
    href: "/categories/flower",
    cta: "Shop Flower",
    alt: "Close-up of cannabis flower bud",
  },
  {
    image: IMG.vapePen3,
    eyebrow: "New Drops",
    title: "Liquid Diamond Vapes Just Landed",
    href: "/categories/vaporizers",
    cta: "Shop Vaporizers",
    alt: "Cannabis vape pen",
  },
  {
    image: IMG.gummies2,
    eyebrow: "Fan Favourite",
    title: "Fully Blasted Gummies, 10-Packs",
    href: "/categories/edibles",
    cta: "Shop Edibles",
    alt: "Gummy candy edibles",
  },
];

export function PromoCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative flex h-[42vh] min-h-[280px] w-full items-center overflow-hidden rounded-2xl">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image src={slide.image} alt={slide.alt} fill priority={index === 0} sizes="100vw" className="object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      <div className="relative w-full px-6 sm:px-10">
        <motion.div
          key={`text-${index}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md"
        >
          <p className="mb-3 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
            {slide.eyebrow}
          </p>
          <h2 className="font-heading text-2xl font-bold leading-tight text-white sm:text-3xl">{slide.title}</h2>
          <Button className="mt-5" variant="warm" asChild>
            <Link href={slide.href}>{slide.cta}</Link>
          </Button>
        </motion.div>

        <div className="mt-6 flex gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}: ${s.eyebrow}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
