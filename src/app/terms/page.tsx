import type { Metadata } from "next";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms & Conditions for ${SITE_NAME}.`,
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Terms & Conditions" }]} />
      <h1 className="font-heading text-3xl font-semibold">Terms & Conditions</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: June 19, 2026</p>

      <div className="prose prose-neutral mt-8 max-w-none space-y-6 text-foreground/90">
        <section>
          <h2 className="font-heading text-xl font-semibold">1. Acceptance of Terms</h2>
          <p className="mt-2 text-muted-foreground">
            By accessing or using {SITE_NAME}, you agree to be bound by these Terms & Conditions and our Privacy
            Policy.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold">2. Products & Pricing</h2>
          <p className="mt-2 text-muted-foreground">
            All prices are listed in CAD and are subject to change without notice. Because
            every item is handmade, slight variations in colour, texture, and size should be expected.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold">3. Orders & Payment</h2>
          <p className="mt-2 text-muted-foreground">
            We reserve the right to refuse or cancel any order for any reason, including suspected fraud or
            errors in pricing or product information.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold">4. Shipping & Returns</h2>
          <p className="mt-2 text-muted-foreground">
            Shipping timelines are estimates only. Please see our FAQ for detailed information on our return and
            refund policy.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold">5. Workshops & Events</h2>
          <p className="mt-2 text-muted-foreground">
            Workshop tickets are subject to the cancellation policy listed on the workshop page at time of
            booking.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold">6. Limitation of Liability</h2>
          <p className="mt-2 text-muted-foreground">
            {SITE_NAME} is not liable for any indirect, incidental, or consequential damages arising from the use
            of our products or website.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold">7. Governing Law</h2>
          <p className="mt-2 text-muted-foreground">
            These terms are governed by the laws of the jurisdiction in which the Company operates.
          </p>
        </section>
      </div>
    </div>
  );
}
