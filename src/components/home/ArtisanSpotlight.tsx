import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";

export function ArtisanSpotlight() {
  return (
    <section className="bg-muted">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={IMG.woodworkers}
            alt="Artisan carving a wooden spoon by hand"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">Artisan Spotlight</p>
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl">Northbound Woodshop</h2>
          <p className="mt-4 text-muted-foreground">
            Tucked into a converted barn outside Peterborough, Ontario, Tom and Lia have been giving reclaimed
            hardwood a second life since 2016. Every board, spoon, and box passes through six pairs of hands
            before it reaches your home.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/blog/meet-the-makers-northbound-woodshop">Read Their Story</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
