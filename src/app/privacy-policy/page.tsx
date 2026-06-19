import type { Metadata } from "next";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME}.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Privacy Policy" }]} />
      <h1 className="font-heading text-3xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: June 19, 2026</p>

      <div className="prose prose-neutral mt-8 max-w-none space-y-6 text-foreground/90">
        <section>
          <h2 className="font-heading text-xl font-semibold">1. Information We Collect</h2>
          <p className="mt-2 text-muted-foreground">
            When you place an order, sign up for our newsletter, or contact us, we collect information such as
            your name, email address, shipping address, and payment details necessary to fulfill your request.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold">2. How We Use Your Information</h2>
          <p className="mt-2 text-muted-foreground">
            We use your information to process orders, communicate with you about purchases, send marketing
            communications you&rsquo;ve opted into, and improve our products and services.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold">3. Cookies</h2>
          <p className="mt-2 text-muted-foreground">
            We use cookies and local storage to remember your cart, wishlist, and preferences across visits. You
            can disable cookies in your browser settings, though some features may not function correctly.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold">4. Sharing Your Information</h2>
          <p className="mt-2 text-muted-foreground">
            We do not sell your personal information. We may share information with trusted service providers
            (such as shipping carriers and payment processors) solely to fulfill your order.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold">5. Your Rights</h2>
          <p className="mt-2 text-muted-foreground">
            Under Canadian privacy law (PIPEDA), you have the right to access, correct, or request deletion of
            your personal information. Contact us at privacy@abudabovecraftboutique.ca to make a request.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-semibold">6. Contact Us</h2>
          <p className="mt-2 text-muted-foreground">
            Questions about this policy can be directed to privacy@abudabovecraftboutique.ca.
          </p>
        </section>
      </div>
    </div>
  );
}
