"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/data/testimonials";
import { RatingStars } from "@/components/shared/RatingStars";
import { Reveal } from "@/components/shared/Reveal";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, []);

  const goTo = (i: number) => {
    setIndex(((i % testimonials.length) + testimonials.length) % testimonials.length);
    resetAutoplay();
  };

  const t = testimonials[index];

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Happy Customers</p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">What Our Customers Say</h2>
            <p className="mt-2 text-muted-foreground">Real reviews from customers across BC.</p>
          </div>
        </Reveal>

        <div className="relative mx-auto max-w-3xl">
          <div className="relative min-h-[280px] overflow-hidden sm:min-h-[240px]">
            <AnimatePresence mode="sync">
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 16, position: "absolute" }}
                animate={{ opacity: 1, y: 0, position: "relative" }}
                exit={{ opacity: 0, y: -16, position: "absolute" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="top-0 left-0 flex w-full flex-col items-center rounded-3xl border border-border bg-card px-6 py-10 text-center shadow-sm sm:px-14 sm:py-12"
              >
                <Quote className="h-8 w-8 text-primary/40" />
                <RatingStars rating={t.rating} className="mt-4" />
                <blockquote className="mt-5 max-w-xl font-heading text-xl italic leading-relaxed text-foreground sm:text-2xl">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-sm font-medium text-muted-foreground">
                  {t.author} — {t.location}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => goTo(index - 1)}
            className="absolute left-0 top-1/2 z-10 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md transition-colors hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => goTo(index + 1)}
            className="absolute right-0 top-1/2 z-10 flex size-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md transition-colors hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="mt-8 flex items-center justify-center gap-2">
            {testimonials.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Show testimonial ${i + 1} from ${item.author}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-primary" : "w-2 bg-primary/25 hover:bg-primary/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
