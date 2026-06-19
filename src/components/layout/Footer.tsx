"use client";

import Link from "next/link";
import { useState } from "react";
import { AtSign, Globe, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { FOOTER_LINKS, SITE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">{title}</h3>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-secondary-foreground/75 transition-colors hover:text-warm"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thanks for subscribing! Watch your inbox for 10% off.");
    setEmail("");
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">Business Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-secondary-foreground/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-warm" />
                123 Seaport Lane, Halifax, NS
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-warm" />
                1-800-555-0123
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-warm" />
                hello@abudabovecraftboutique.ca
              </li>
            </ul>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-warm hover:underline"
            >
              Get Directions <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">Subscribe Newsletter</h3>
            <p className="mt-4 text-sm text-secondary-foreground/75">
              We invite you to register to read the latest news, offers, and events about our company. We promise
              not spam your inbox.
            </p>
            <form onSubmit={subscribe} className="mt-4 flex max-w-sm gap-2">
              <Input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary-foreground/5 text-secondary-foreground placeholder:text-secondary-foreground/50"
                aria-label="Email address"
              />
              <Button type="submit" variant="warm" size="icon" className="shrink-0" aria-label="Subscribe">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="rounded-full bg-secondary-foreground/10 p-2 transition-colors hover:bg-warm hover:text-warm-foreground"
              >
                <AtSign className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="rounded-full bg-secondary-foreground/10 p-2 transition-colors hover:bg-warm hover:text-warm-foreground"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          <FooterColumn title="About Us" links={FOOTER_LINKS.about} />
          <FooterColumn title="Resource" links={FOOTER_LINKS.resource} />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-secondary-foreground/10 pt-6 text-xs text-secondary-foreground/60 sm:flex-row">
          <Link href="/" className="font-heading text-base font-semibold text-secondary-foreground">
            {SITE_NAME}
          </Link>
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
