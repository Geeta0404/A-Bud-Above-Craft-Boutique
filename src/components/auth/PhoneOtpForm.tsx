"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const fieldClass = cn(
  "h-11 w-full rounded-none border-0 border-b-2 border-input bg-transparent px-0 text-base shadow-none",
  "transition-colors placeholder:text-muted-foreground/70",
  "focus-visible:border-primary focus-visible:ring-0",
  "dark:bg-transparent"
);
const labelClass = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

export function PhoneOtpForm({ redirectTo = "/" }: { redirectTo?: string }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Supabase/Twilio require strict E.164 (e.g. +15551234567) — strip spaces, dashes, parens.
    const normalized = phone.replace(/[^\d+]/g, "");
    if (!/^\+[1-9]\d{6,14}$/.test(normalized)) {
      toast.error("Enter a valid phone number with country code, e.g. +15551234567");
      return;
    }

    setSubmitting(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({ phone: normalized });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setPhone(normalized);
    toast.success("Verification code sent.");
    setStep("otp");
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Welcome back!");
    router.push(redirectTo);
    router.refresh();
  };

  if (step === "otp") {
    return (
      <form onSubmit={verifyOtp} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="otp" className={labelClass}>Enter the 6-digit code</Label>
          <Input
            id="otp"
            inputMode="numeric"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className={fieldClass}
          />
        </div>
        <Button type="submit" disabled={submitting} size="lg" className="w-full sm:w-auto">
          {submitting ? "Verifying…" : "Verify & Sign In"}
        </Button>
        <button
          type="button"
          onClick={() => setStep("phone")}
          className="block text-sm text-muted-foreground hover:underline"
        >
          Use a different number
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={sendOtp} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="phone" className={labelClass}>Phone number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 555 123 4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className={fieldClass}
        />
      </div>
      <Button type="submit" disabled={submitting} size="lg" className="w-full sm:w-auto">
        {submitting ? "Sending…" : "Send Code"}
      </Button>
    </form>
  );
}
