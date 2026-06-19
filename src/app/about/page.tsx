import type { Metadata } from "next";
import Image from "next/image";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about A Bud Above Craft Boutique and the Canadian artisans behind every handcrafted piece.",
};

const values = [
  { title: "Handmade, Always", body: "Every product is made by hand by an independent artisan or small studio — never mass produced." },
  { title: "Canadian Made", body: "We partner exclusively with makers based in Canada, supporting local craft economies coast to coast." },
  { title: "Slow & Sustainable", body: "We favour natural materials, small batches, and packaging that's kind to the planet." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "About Us" }]} />
      <h1 className="font-heading text-3xl font-semibold sm:text-4xl">About A Bud Above</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        We started A Bud Above Craft Boutique to give Canadian artisans a beautiful home online — a place where
        handmade candles, pottery, woodwork, and textile art could find their way into homes across the country.
      </p>

      <div className="relative mt-8 aspect-[16/7] overflow-hidden rounded-2xl">
        <Image
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1600&auto=format&fit=crop"
          alt="Artisan working in a craft studio"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-semibold">{v.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
