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
              src={IMG.woodworkers}
              alt="Artisan woodworkers crafting a handmade piece"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Artisan Spotlight</p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Northbound Woodshop</h2>
            <p className="mt-5 text-muted-foreground">
              Tucked into a converted barn outside Peterborough, Ontario, Tom and Lia have been giving reclaimed
              hardwood a second life since 2016. Every board, spoon, and box passes through six pairs of hands
              before it reaches your home.
            </p>
            <Button className="mt-7" asChild>
              <Link href="/blog/meet-the-makers-northbound-woodshop">Read Their Story</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
