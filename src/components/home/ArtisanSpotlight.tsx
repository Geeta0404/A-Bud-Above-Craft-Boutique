import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";
import { Reveal } from "@/components/shared/Reveal";

export function ArtisanSpotlight() {
  return (
    <section className="bg-muted">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div className="img-frame hover-lift relative aspect-[4/3] overflow-hidden">
            <Image
              src={IMG.flowerBud5}
              alt="Close-up of premium cannabis flower"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Grower Spotlight</p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">BC Smalls</h2>
            <p className="mt-5 text-muted-foreground">
              Grown indoors in small batches and cured slow for maximum flavour, BC Smalls proves that the
              trim doesn&apos;t have to mean a tradeoff on quality — same bud, better value.
            </p>
            <Button className="mt-7" asChild>
              <Link href="/categories/flower">Shop Flower</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
