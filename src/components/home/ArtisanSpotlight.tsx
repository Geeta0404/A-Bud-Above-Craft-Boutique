"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";
import { Reveal } from "@/components/shared/Reveal";

const SLIDES = [
  {
    eyebrow: "Grower Spotlight",
    title: "BC Smalls",
    description:
      "Grown indoors in small batches and cured slow for maximum flavour, BC Smalls proves that the trim doesn't have to mean a tradeoff on quality — same bud, better value.",
    image: IMG.flowerBud5,
    alt: "Close-up of premium cannabis flower",
    cta: "Shop Flower",
    href: "/categories/flower",
  },
  {
    eyebrow: "Concentrate Spotlight",
    title: "Good Supply",
    description:
      "Dense, terpene-rich concentrates cured slow for maximum flavour — Good Supply proves potency and quality can come from the same jar.",
    image: IMG.concentrate3,
    alt: "Cannabis concentrate shatter",
    cta: "Shop Concentrates",
    href: "/categories/concentrates",
  },
  {
    eyebrow: "Edible Spotlight",
    title: "SOURZ by Spinach",
    description:
      "Tart, candy-inspired gummies precisely dosed for a consistent, reliable experience — SOURZ turns edibles into an everyday treat.",
    image: IMG.gummies3,
    alt: "Cannabis-infused gummy candy",
    cta: "Shop Edibles",
    href: "/categories/edibles",
  },
  {
    eyebrow: "Vapor Spotlight",
    title: "General Admission",
    description:
      "Festival-ready liquid diamond vapes built for maximum potency and flavour — General Admission keeps every session dialed in.",
    image: IMG.vapePen3,
    alt: "Cannabis vaporizer and cartridge",
    cta: "Shop Vaporizers",
    href: "/categories/vaporizers",
  },
];

export function ArtisanSpotlight() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, [index]);

  const goTo = (dir: 1 | -1) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);

  const slide = SLIDES[index];

  return (
    <section className="bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Trusted BC Brands</p>
              <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Shop by Brand</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Every brand we carry is lab-tested and hand-picked for quality.
              </p>
            </div>
            <Link
              href="/brands"
              className="group hidden items-center gap-1.5 text-sm font-medium text-primary sm:flex"
            >
              View all brands
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="img-frame hover-lift relative aspect-[4/3] overflow-hidden">
              <AnimatePresence mode="sync">
                <motion.div
                  key={slide.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                aria-label="Previous spotlight"
                onClick={() => goTo(-1)}
                className="absolute left-4 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-md backdrop-blur-sm transition-colors hover:bg-background"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next spotlight"
                onClick={() => goTo(1)}
                className="absolute right-4 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-md backdrop-blur-sm transition-colors hover:bg-background"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="relative">
              <AnimatePresence mode="sync">
                <motion.div
                  key={slide.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, position: "relative" }}
                  exit={{ opacity: 0, y: -16, position: "absolute" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="top-0 left-0 w-full"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">{slide.eyebrow}</p>
                  <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">{slide.title}</h2>
                  <p className="mt-5 text-muted-foreground">{slide.description}</p>
                  <Button className="mt-7" asChild>
                    <Link href={slide.href}>{slide.cta}</Link>
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
    </section>
  );
}

