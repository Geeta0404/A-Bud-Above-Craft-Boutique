"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { FOOTER_LINKS, SITE_NAME, STORE_INFO } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// lucide-react no longer ships brand/logo icons, so these are hand-drawn to match its stroke style.
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 4h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h2.5l.5-4h-3V8a1 1 0 0 1 1-1h2Z" />
    </svg>
  );
}

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
                {STORE_INFO.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-warm" />
                {STORE_INFO.phone}
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-warm" />
                {STORE_INFO.email}
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
                href="https://instagram.com/abudabovecraftboutique"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full bg-secondary-foreground/10 p-2 transition-colors hover:bg-warm hover:text-warm-foreground"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com/abudabovecraftboutique"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-full bg-secondary-foreground/10 p-2 transition-colors hover:bg-warm hover:text-warm-foreground"
              >
                <FacebookIcon className="h-4 w-4" />
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
