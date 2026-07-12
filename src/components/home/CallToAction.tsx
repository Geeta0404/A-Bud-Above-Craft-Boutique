import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/Reveal";

export function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <Reveal className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">Elevate Every Session</h2>
        <p className="max-w-xl text-primary-foreground/90">
          From quiet nights in to weekend get-togethers — discover cannabis curated for the way you unwind.
        </p>
        <Button size="lg" variant="warm" asChild className="mt-2">
          <Link href="/shop">Shop Now</Link>
        </Button>
      </Reveal>
    </section>
  );
}
