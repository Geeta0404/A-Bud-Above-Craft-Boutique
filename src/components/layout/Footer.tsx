"use client";

import Link from "next/link";
import { useState } from "react";
import { AtSign, Globe, Mail } from "lucide-react";
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
            <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
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
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="font-heading text-lg font-semibold">
              {SITE_NAME}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-secondary-foreground/70">
              Handcrafted candles, pottery, woodwork, and artisan gifts made by Canadian makers, shipped with care
              across Canada.
            </p>
            <form onSubmit={subscribe} className="mt-5 flex max-w-sm gap-2">
              <Input
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary-foreground/5 text-secondary-foreground placeholder:text-secondary-foreground/50"
                aria-label="Email address"
              />
              <Button type="submit" variant="secondary" className="shrink-0 border border-secondary-foreground/20">
                <Mail className="mr-1 h-4 w-4" /> Join
              </Button>
            </form>
            <div className="mt-5 flex gap-3">
              <a href="#" aria-label="Instagram" className="rounded-full bg-secondary-foreground/10 p-2 hover:bg-secondary-foreground/20">
                <AtSign className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Facebook" className="rounded-full bg-secondary-foreground/10 p-2 hover:bg-secondary-foreground/20">
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          <FooterColumn title="Shop" links={FOOTER_LINKS.shop} />
          <FooterColumn title="Company" links={FOOTER_LINKS.company} />
          <FooterColumn title="Support" links={FOOTER_LINKS.support} />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-secondary-foreground/10 pt-6 text-xs text-secondary-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <p>Proudly made in Canada 🍁</p>
        </div>
      </div>
    </footer>
  );
}
