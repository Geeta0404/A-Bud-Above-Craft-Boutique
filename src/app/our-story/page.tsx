import type { Metadata } from "next";
import Image from "next/image";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Our Story",
  description: "From a single Granville Street storefront to a trusted home for BC cannabis — this is our story.",
};

const milestones = [
  { year: "2019", text: "Founded as a single storefront on Granville Street in Vancouver, carrying a handful of trusted BC growers." },
  { year: "2021", text: "Partnered with our first five craft cannabis brands and launched online ordering." },
  { year: "2023", text: "Grew to carry over 30 trusted BC brands and added same-day delivery across Metro Vancouver." },
  { year: "2025", text: "Opened our in-store product counter, pairing every visit with real cannabis knowledge." },
];

export default function OurStoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Our Story" }]} />
      <h1 className="font-heading text-3xl font-semibold sm:text-4xl">Our Story</h1>
      <p className="mt-4 text-muted-foreground">
        A Bud Above began with a simple idea: cannabis is better when it&rsquo;s curated, not just stocked. What
        started as a single Vancouver storefront has grown into a trusted home for dozens of BC growers and
        producers — but our mission hasn&rsquo;t changed.
      </p>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
        <Image
          src={IMG.flowerBud1}
          alt="Premium cannabis flower on display"
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
