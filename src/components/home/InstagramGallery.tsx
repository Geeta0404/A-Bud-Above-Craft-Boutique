import Image from "next/image";
import { AtSign } from "lucide-react";
import { IMG } from "@/lib/images";

const images = [
  IMG.flowerBud3,
  IMG.preRoll1,
  IMG.vapePen4,
  IMG.gummies3,
  IMG.concentrate2,
  IMG.beverage1,
];

export function InstagramGallery() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-center gap-2 text-center">
        <AtSign className="h-5 w-5 text-primary" />
        <h2 className="font-heading text-2xl font-semibold">@abudabovecraftboutique</h2>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
        {images.map((src, i) => (
          <div key={src} className="relative aspect-square overflow-hidden rounded-lg">
            <Image src={src} alt={`Instagram post ${i + 1}`} fill sizes="16vw" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
