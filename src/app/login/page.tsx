import type { Metadata } from "next";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your A Bud Above Craft Boutique account.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs items={[{ label: "Sign In" }]} />
      <h1 className="font-heading text-3xl font-semibold">Welcome Back</h1>
      <p className="mt-2 text-muted-foreground">Sign in to track orders, manage your wishlist, and more.</p>

      <div className="mt-10">
        <LoginForm />
      </div>
    </div>
  );
}
