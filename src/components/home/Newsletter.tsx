"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/shared/Reveal";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You're on the list! Check your inbox for 10% off.");
    setEmail("");
  };

  return (
    <Reveal className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <h2 className="font-heading text-3xl font-bold sm:text-4xl">Join Our Community of Craft Lovers</h2>
      <p className="mt-3 text-muted-foreground">
        Get 10% off your first order, early access to new collections, and stories from our artisans.
      </p>
      <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md gap-2">
        <Input
          type="email"
          required
          placeholder="you@example.com"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" className="shrink-0">
          Subscribe
        </Button>
      </form>
    </Reveal>
  );
}
