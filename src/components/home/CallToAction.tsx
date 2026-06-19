import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-semibold sm:text-4xl">Bring Handmade Home</h2>
        <p className="max-w-xl text-primary-foreground/90">
          From cozy candle nights to gifts that actually mean something — discover artisan pieces made for the
          way you live.
        </p>
        <Button size="lg" variant="secondary" asChild className="mt-2">
          <Link href="/shop">Shop Now</Link>
        </Button>
      </div>
    </section>
  );
}
