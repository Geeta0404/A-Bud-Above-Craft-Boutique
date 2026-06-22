import type { Metadata } from "next";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create an A Bud Above Craft Boutique account.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Create Account" }]} />
      <h1 className="font-heading text-3xl font-semibold">Create Your Account</h1>
      <p className="mt-2 text-muted-foreground">Join us for faster checkout, order tracking, and exclusive offers.</p>

      <div className="mt-10">
        <RegisterForm />
      </div>
    </div>
  );
}
