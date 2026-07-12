import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { ContactForm } from "@/components/contact/ContactForm";
import { STORE_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the A Bud Above Craft Boutique team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Contact Us" }]} />
      <h1 className="font-heading text-3xl font-semibold">Contact Us</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Questions about an order, a product, or a workshop? We&rsquo;d love to hear from you.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <ContactForm />
        <div className="space-y-5 self-start">
          <div className="flex items-start gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warm/15 text-warm">
              <Mail className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{STORE_INFO.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warm/15 text-warm">
              <Phone className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{STORE_INFO.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warm/15 text-warm">
              <MapPin className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium">Store</p>
              <p className="text-sm text-muted-foreground">{STORE_INFO.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
