"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, ArrowLeft } from "lucide-react";
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

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Reset link sent! Check your inbox.");
      setSubmitting(false);
      setSent(true);
    }, 600);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-7 rounded-3xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur-sm sm:p-10"
    >
      {sent ? (
        <p className="text-sm text-muted-foreground">
          If an account exists for that email, we&rsquo;ve sent a link to reset your password.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Enter the email associated with your account and we&rsquo;ll send you a link to reset your password.
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="email" className={labelClass}>Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required className={fieldClass} />
          </div>
          <Button type="submit" disabled={submitting} size="lg" className="w-full sm:w-auto">
            {submitting ? "Sending…" : "Send Reset Link"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </>
      )}
      <p className="text-sm text-muted-foreground">
        <Link href="/login" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      </p>
    </form>
  );
}
