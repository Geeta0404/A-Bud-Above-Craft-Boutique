import { testimonials } from "@/lib/data/testimonials";
import { RatingStars } from "@/components/shared/RatingStars";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="font-heading text-3xl font-semibold">What Our Customers Say</h2>
        <p className="mt-2 text-muted-foreground">Real reviews from artisan-loving customers across Canada.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t) => (
          <figure key={t.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
            <RatingStars rating={t.rating} />
            <blockquote className="text-sm text-foreground/90">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-auto text-xs text-muted-foreground">
              {t.author} — {t.location}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
