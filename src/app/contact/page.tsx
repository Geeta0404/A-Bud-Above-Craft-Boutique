import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { ContactForm } from "@/components/contact/ContactForm";

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

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <ContactForm />
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">hello@abudabovecraftboutique.ca</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">1-800-555-0123</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Studio</p>
              <p className="text-sm text-muted-foreground">123 Seaport Lane, Halifax, NS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
