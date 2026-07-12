"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";

const SLIDES = [
  {
    image: IMG.flowerBud2,
    eyebrow: "Premium BC Flower",
    title: "Grown Slow, Cured Right",
    alt: "Close-up of premium indoor-grown cannabis flower",
  },
  {
    image: IMG.preRoll3,
    eyebrow: "Hand-Rolled Pre-Rolls",
    title: "Ready When You Are",
    alt: "Hand-rolled cannabis pre-roll",
  },
  {
    image: IMG.vapePen2,
    eyebrow: "Vaporizers & Cartridges",
    title: "Discreet. Potent. Precise.",
    alt: "Cannabis vaporizer and 510-thread cartridge",
  },
  {
    image: IMG.gummies2,
    eyebrow: "Edibles & Beverages",
    title: "Precisely Dosed, Deliciously Made",
    alt: "Cannabis-infused gummies",
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative flex min-h-[88vh] w-full items-center overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          key={`text-${index}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
            {slide.eyebrow}
          </p>
          <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {slide.title}
          </h1>
          <p className="mt-6 max-w-md text-balance text-base text-white/85 sm:text-lg">
            Premium flower, pre-rolls, vapes, edibles, and concentrates from trusted BC brands —
            curated cannabis, delivered with care.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" variant="warm" asChild>
              <Link href="/shop">Shop the Collection</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
            >
              <Link href="/our-story">Our Story</Link>
            </Button>
          </div>
        </motion.div>

        <div className="mt-12 flex gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}: ${s.eyebrow}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-10 bg-white" : "w-4 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
