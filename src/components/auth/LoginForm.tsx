"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  getFirebaseClientAuth,
  isFirebaseClientConfigured,
} from "@/lib/firebase/client";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { PhoneOtpForm } from "@/components/auth/PhoneOtpForm";

const fieldClass = cn(
  "h-11 w-full rounded-none border-0 border-b-2 border-input bg-transparent px-0 text-base shadow-none",
  "transition-colors placeholder:text-muted-foreground/70",
  "focus-visible:border-primary focus-visible:ring-0",
  "dark:bg-transparent"
);

const labelClass =
  "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

export function LoginForm() {
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirectTo") || "/";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFirebaseClientConfigured()) {
      toast.error("Sign-in is temporarily unavailable.");
      return;
    }

    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email"));

    const password = String(formData.get("password"));

    try {
      const credential = await signInWithEmailAndPassword(
        getFirebaseClientAuth(),
        email,
        password
      );

      // Firebase ID Token
      const token = await credential.user.getIdToken();

      // Check admin from backend
      const response = await fetch("/api/auth/check-admin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to verify admin account.");
      }

      const data = await response.json();

      toast.success("Welcome back!");

      if (data.isAdmin) {
        router.push("/admin");
      } else {
        router.push(redirectTo);
      }

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Sign in failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-7 rounded-3xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur-sm sm:p-10">
      <GoogleSignInButton redirectTo={redirectTo} />

      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <Tabs defaultValue="email">
        <TabsList className="w-full">
          <TabsTrigger value="email" className="flex-1">
            Email
          </TabsTrigger>

          <TabsTrigger value="phone" className="flex-1">
            Phone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="pt-6">
          <form onSubmit={onSubmit} className="space-y-7">
            <div className="space-y-1.5">
              <Label htmlFor="email" className={labelClass}>
                Email
              </Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className={fieldClass}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className={labelClass}>
                  Password
                </Label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className={fieldClass}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              size="lg"
              className="w-full sm:w-auto"
            >
              {submitting ? "Signing in..." : "Sign In"}

              <LogIn className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="phone" className="pt-6">
          <PhoneOtpForm redirectTo={redirectTo} />
        </TabsContent>
      </Tabs>

      <p className="text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}