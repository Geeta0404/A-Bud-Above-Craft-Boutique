import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-muted">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
        <div className="order-2 lg:order-1">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Handcrafted in Canada
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Pieces with a story, made by hand
          </h1>
          <p className="mt-5 max-w-md text-muted-foreground sm:text-lg">
            Discover one-of-a-kind candles, pottery, woodwork, and textile art from independent Canadian
            artisans — thoughtfully made, beautifully imperfect.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/shop">Shop the Collection</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/our-story">Our Story</Link>
            </Button>
          </div>
        </div>
        <div className="order-1 grid grid-cols-2 gap-4 lg:order-2">
          <div className="relative col-span-2 aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={IMG.potteryBowls}
              alt="Handmade stoneware pottery on a wooden table"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image
              src={IMG.candleJar}
              alt="Hand-poured soy candle"
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image
              src={IMG.woodworkers}
              alt="Live-edge wooden charcuterie board"
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
