import type { Metadata } from "next";
import Image from "next/image";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about A Bud Above Craft Boutique and our commitment to curated, quality cannabis.",
};

const values = [
  { title: "Curated, Always", body: "Every product is hand-selected and tested for quality — we never carry something just to fill a shelf." },
  { title: "Trusted BC Brands", body: "We partner exclusively with licensed BC growers and producers, supporting the local cannabis economy." },
  { title: "Care in Every Order", body: "From discreet packaging to knowledgeable staff, we treat every order like it's for a friend." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "About Us" }]} />
      <h1 className="font-heading text-3xl font-semibold sm:text-4xl">About A Bud Above</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        We started A Bud Above Craft Boutique to give BC&rsquo;s independent cannabis growers and producers a
        beautiful home online — a place where premium flower, pre-rolls, vapes, and edibles could find their way
        to more people, backed by real product knowledge.
      </p>

      <div className="relative mt-8 aspect-[16/7] overflow-hidden rounded-2xl">
        <Image
          src={IMG.flowerBud4}
          alt="Close-up of premium cannabis flower"
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
