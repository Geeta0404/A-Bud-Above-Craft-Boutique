"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const fieldClass = cn(
  "h-11 w-full rounded-none border-0 border-b-2 border-input bg-transparent px-0 text-base shadow-none",
  "transition-colors placeholder:text-muted-foreground/70",
  "focus-visible:border-primary focus-visible:ring-0",
  "dark:bg-transparent"
);

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Thanks for reaching out! We'll reply within 1-2 business days.");
      e.currentTarget.reset();
      setSubmitting(false);
    }, 600);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-7 rounded-3xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur-sm sm:p-10"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Name
          </Label>
          <Input id="name" name="name" placeholder="Your full name" required className={fieldClass} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Subject
        </Label>
        <Input id="subject" name="subject" placeholder="What's this about?" required className={fieldClass} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us how we can help…"
          required
          className={cn(
            "min-h-32 resize-none rounded-none border-0 border-b-2 border-input bg-transparent px-0 text-base shadow-none",
            "transition-colors placeholder:text-muted-foreground/70",
            "focus-visible:border-primary focus-visible:ring-0",
            "dark:bg-transparent"
          )}
        />
      </div>
      <Button type="submit" disabled={submitting} size="lg" className="w-full sm:w-auto">
        {submitting ? "Sending…" : "Send Message"}
        <Send className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
