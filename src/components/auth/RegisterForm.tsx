"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { PhoneOtpForm } from "@/components/auth/PhoneOtpForm";

const fieldClass = cn(
  "h-11 w-full rounded-none border-0 border-b-2 border-input bg-transparent px-0 text-base shadow-none",
  "transition-colors placeholder:text-muted-foreground/70",
  "focus-visible:border-primary focus-visible:ring-0",
  "dark:bg-transparent"
);
const labelClass = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

export function RegisterForm() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const firstName = String(formData.get("firstName"));
    const lastName = String(formData.get("lastName"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const confirmPassword = String(formData.get("confirmPassword"));

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!isSupabaseConfigured()) {
      toast.error("Account creation is temporarily unavailable. Please try again later.");
      return;
    }

    setSubmitting(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Account created! Check your email to confirm, then sign in.");
    router.push("/login");
  };

  return (
    <div className="space-y-7 rounded-3xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur-sm sm:p-10">
      <GoogleSignInButton />

      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <Tabs defaultValue="email">
        <TabsList className="w-full">
          <TabsTrigger value="email" className="flex-1">Email</TabsTrigger>
          <TabsTrigger value="phone" className="flex-1">Phone</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="pt-6">
          <form onSubmit={onSubmit} className="space-y-7">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className={labelClass}>First Name</Label>
                <Input id="firstName" name="firstName" placeholder="Jane" required className={fieldClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className={labelClass}>Last Name</Label>
                <Input id="lastName" name="lastName" placeholder="Doe" required className={fieldClass} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className={labelClass}>Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required className={fieldClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className={labelClass}>Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} className={fieldClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className={labelClass}>Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required minLength={8} className={fieldClass} />
            </div>
            <Button type="submit" disabled={submitting} size="lg" className="w-full sm:w-auto">
              {submitting ? "Creating account…" : "Create Account"}
              <UserPlus className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="phone" className="pt-6">
          <PhoneOtpForm />
        </TabsContent>
      </Tabs>

      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
