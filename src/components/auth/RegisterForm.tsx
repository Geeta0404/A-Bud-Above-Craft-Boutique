"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Account created! Welcome to A Bud Above.");
      setSubmitting(false);
      router.push("/");
    }, 600);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-7 rounded-3xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur-sm sm:p-10"
    >
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
        <Input id="password" name="password" type="password" placeholder="••••••••" required className={fieldClass} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className={labelClass}>Confirm Password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required className={fieldClass} />
      </div>
      <Button type="submit" disabled={submitting} size="lg" className="w-full sm:w-auto">
        {submitting ? "Creating account…" : "Create Account"}
        <UserPlus className="ml-2 h-4 w-4" />
      </Button>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
