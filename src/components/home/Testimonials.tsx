import { testimonials } from "@/lib/data/testimonials";
import { RatingStars } from "@/components/shared/RatingStars";
import { Reveal } from "@/components/shared/Reveal";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Happy Customers</p>
          <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">What Our Customers Say</h2>
          <p className="mt-2 text-muted-foreground">Real reviews from customers across BC.</p>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.08}>
            <figure className="hover-lift flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6">
              <RatingStars rating={t.rating} />
              <blockquote className="font-heading text-sm italic text-foreground/90">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-auto text-xs text-muted-foreground">
                {t.author} — {t.location}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
