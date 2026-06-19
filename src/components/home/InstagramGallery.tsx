import Image from "next/image";
import { AtSign } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1602874801007-bd36c0cfcfae?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565193298357-c7b9b2e2ad4d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601058268499-e52e8b850b97?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1616627561839-074385245ff6?q=80&w=600&auto=format&fit=crop",
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
