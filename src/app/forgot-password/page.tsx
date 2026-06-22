import type { Metadata } from "next";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your A Bud Above Craft Boutique account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Forgot Password" }]} />
      <h1 className="font-heading text-3xl font-semibold">Reset Your Password</h1>
      <p className="mt-2 text-muted-foreground">We&rsquo;ll email you a link to get back into your account.</p>

      <div className="mt-10">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
