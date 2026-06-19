import type { Metadata } from "next";
import Image from "next/image";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";

export const metadata: Metadata = {
  title: "Our Story",
  description: "From a single farmers market table to a national platform for Canadian artisans — this is our story.",
};

const milestones = [
  { year: "2019", text: "Founded as a single table at the Halifax Seaport Farmers' Market, selling hand-poured candles." },
  { year: "2021", text: "Partnered with our first five artisan studios and launched our online boutique." },
  { year: "2023", text: "Grew to over 30 Canadian makers and shipped to every province and territory." },
  { year: "2025", text: "Opened our first in-person workshop space, hosting hands-on classes with our artisans." },
];

export default function OurStoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Our Story" }]} />
      <h1 className="font-heading text-3xl font-semibold sm:text-4xl">Our Story</h1>
      <p className="mt-4 text-muted-foreground">
        A Bud Above began with a simple idea: handmade things carry more warmth than anything mass-produced ever
        could. What started as a single candle stand has grown into a curated home for dozens of Canadian
        artisans — but our mission hasn't changed.
      </p>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
        <Image
          src="https://images.unsplash.com/photo-1576697010702-f86ad0a4f9e3?q=80&w=1600&auto=format&fit=crop"
          alt="Seasonal handmade goods on display"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <ol className="mt-10 space-y-6 border-l border-border pl-6">
        {milestones.map((m) => (
          <li key={m.year} className="relative">
            <span className="absolute -left-[31px] flex h-4 w-4 -translate-y-0.5 items-center justify-center rounded-full bg-primary" />
            <p className="font-heading text-lg font-semibold text-primary">{m.year}</p>
            <p className="mt-1 text-muted-foreground">{m.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
