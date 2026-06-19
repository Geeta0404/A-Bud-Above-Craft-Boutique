"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] w-full items-center overflow-hidden">
      <Image
        src={IMG.woodworkers}
        alt="Artisan workshop filled with handcrafted goods"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
            Handcrafted &amp; One of a Kind
          </p>
          <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Elegance, Crafted by Hand
          </h1>
          <p className="mt-6 max-w-md text-balance text-base text-white/85 sm:text-lg">
            Discover one-of-a-kind candles, pottery, woodwork, and textile art from independent artisans —
            thoughtfully made, beautifully imperfect.
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
      </div>
    </section>
  );
}
