"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-muted">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 lg:order-1"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Handcrafted in Canada
          </p>
          <h1 className="font-heading text-5xl font-medium leading-[1.05] tracking-tight italic sm:text-6xl lg:text-7xl">
            Pieces with a story, made by hand
          </h1>
          <p className="mt-6 max-w-md text-balance text-base text-muted-foreground sm:text-lg">
            Discover one-of-a-kind candles, pottery, woodwork, and textile art from independent Canadian
            artisans — thoughtfully made, beautifully imperfect.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/shop">Shop the Collection</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/our-story">Our Story</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 grid grid-cols-2 gap-4 lg:order-2"
        >
          <div className="hover-lift relative col-span-2 aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image
              src={IMG.potteryBowls}
              alt="Handmade stoneware pottery on a wooden table"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="hover-lift relative aspect-square overflow-hidden rounded-2xl shadow-lg">
            <Image src={IMG.candleJar} alt="Hand-poured soy candle" fill sizes="25vw" className="object-cover" />
          </div>
          <div className="hover-lift relative aspect-square overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={IMG.woodworkers}
              alt="Artisan woodworkers crafting a handmade piece"
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
