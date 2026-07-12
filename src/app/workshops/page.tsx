import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { workshops } from "@/lib/data/workshops";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { CAD } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Workshops & Events",
  description: "Join hands-on cannabis education sessions led by our in-house team.",
};

export default function WorkshopsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Workshops & Events" }]} />
      <h1 className="font-heading text-3xl font-semibold">Workshops & Events</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Learn directly from our team in small, hands-on sessions — no experience necessary. Must be 19+ with valid ID.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {workshops.map((w) => (
          <div key={w.slug} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="relative aspect-[16/9]">
              <Image src={w.image} alt={w.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="p-5">
              <h2 className="font-heading text-lg font-semibold">{w.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{w.description}</p>
              <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" /> {w.date} · {w.time}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {w.location}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> {w.seatsLeft} seats left
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-semibold">{CAD(w.price)}</span>
                <Button size="sm">Reserve a Spot</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
