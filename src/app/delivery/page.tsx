import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Clock, Smartphone, PackageCheck, Truck, IdCard, ShieldCheck } from "lucide-react";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DELIVERY_ZONES } from "@/lib/data/deliveryZones";
import { STORE_INFO, CAD } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Delivery",
  description: "Free same-day cannabis delivery across Metro Vancouver. Order online and we'll bring it to your door.",
};

const STEPS = [
  {
    icon: Smartphone,
    title: "Choose Delivery at Checkout",
    description: "Select delivery and your neighbourhood when you check out online.",
  },
  {
    icon: PackageCheck,
    title: "We Prepare Your Order",
    description: "Our team packs your order fresh and gets it ready for your driver.",
  },
  {
    icon: Truck,
    title: "Track in Real Time",
    description: "We'll text you when your driver leaves, and again when they're close.",
  },
  {
    icon: IdCard,
    title: "Show ID on Arrival",
    description: "Have your valid government ID and the card used to pay ready for the driver.",
  },
];

const DELIVERY_FAQS = [
  {
    question: "Is there a delivery fee?",
    answer:
      "Delivery is free once your order is over the minimum for your neighbourhood, or a small flat fee applies otherwise. Check your area above for exact details.",
  },
  {
    question: "What are your delivery hours?",
    answer: `Most areas: ${STORE_INFO.deliveryHours.replace("Delivery available ", "")}. Order before the cutoff time for your neighbourhood to get same-day delivery.`,
  },
  {
    question: "Do I need to be home to receive my order?",
    answer:
      "Yes — someone 19 years of age or older must be present to sign for the delivery and show valid government-issued photo ID.",
  },
  {
    question: "Can I track my delivery?",
    answer: "You'll receive a text when your driver is on the way, and again when they're nearby.",
  },
  {
    question: "Do you deliver outside these areas?",
    answer: "We're expanding our delivery zones regularly — contact us to see if we can accommodate your address.",
  },
];

export default function DeliveryPage() {
  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <PageBreadcrumbs items={[{ label: "Delivery" }]} />
      </div>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest">
            Free on orders $50+ · $6.99 flat rate under
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold sm:text-5xl">
            Free Same-Day Cannabis Delivery
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">
            Skip the trip and get your order brought straight to your door — order online and we&rsquo;ll take
            care of the rest.
          </p>
          <Button asChild variant="secondary" size="lg" className="mt-7">
            <Link href="/shop">Order Delivery</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Delivery Areas</p>
          <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Where We Deliver</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Choose your neighbourhood below to see hours, fees, and order cutoff times.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {DELIVERY_ZONES.map((zone, i) => (
            <Reveal key={zone.name} delay={i * 0.05}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-heading text-lg font-semibold">{zone.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{zone.description}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  <p>
                    Free on orders {CAD(zone.freeOver)}+ (or {CAD(zone.flatFee)})
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {zone.hours} · Order by {zone.orderBy}
                  </p>
                  <p>Serviced from {STORE_INFO.name}, {STORE_INFO.address}.</p>
                </div>
                <Button asChild className="mt-5 w-full sm:w-auto">
                  <Link href="/shop">Shop This Area</Link>
                </Button>
              </div>
            </Reveal>
          ))}

          <Reveal delay={DELIVERY_ZONES.length * 0.05}>
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center text-muted-foreground">
              <p className="font-heading text-lg font-semibold text-foreground">More Areas Coming Soon</p>
              <p className="mt-1 text-sm">We&rsquo;re expanding across Metro Vancouver — check back soon.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">
              How It Works
            </p>
            <h2 className="mt-2 text-center font-heading text-3xl font-bold sm:text-4xl">
              How Delivery Works
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.05}>
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <p className="mt-4 font-heading text-lg font-semibold">
                    {i + 1}. {step.title}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              Recipients must be 19 years of age or older with valid government-issued photo ID. Orders are
              confirmed by signature on arrival, and we reserve the right to refuse delivery if ID cannot be
              verified.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-14 font-heading text-2xl font-bold sm:text-3xl">Delivery FAQ</h2>
          <Accordion type="single" collapsible className="mt-4">
            {DELIVERY_FAQS.map((f) => (
              <AccordionItem key={f.question} value={f.question}>
                <AccordionTrigger>{f.question}</AccordionTrigger>
                <AccordionContent>{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      <section className="bg-warm text-warm-foreground">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">Ready to order?</h2>
          <p className="mt-2 text-warm-foreground/90">Delivery is just a few clicks away.</p>
          <Button asChild variant="secondary" size="lg" className="mt-6">
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
