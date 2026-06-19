"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Heart, ShoppingBag, Search, ChevronDown, ArrowRight } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
        <span className="font-logo text-lg font-bold italic">Ab</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-logo text-2xl font-bold italic tracking-wide">A Bud Above</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Craft Boutique
        </span>
      </span>
    </Link>
  );
}

function AboutMenu({ label, href, children }: (typeof NAV_LINKS)[number]) {
  if (!children) return null;
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary">
        {label}
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
      </button>
      <div className="invisible absolute left-1/2 top-full z-50 w-[440px] -translate-x-1/2 translate-y-2 rounded-2xl border border-border bg-popover p-4 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-1 group-hover:opacity-100">
        <div className="grid grid-cols-2 gap-2">
          {children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="rounded-xl p-3 transition-colors hover:bg-muted"
            >
              <p className="text-sm font-semibold">{child.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{child.description}</p>
            </Link>
          ))}
        </div>
        <Link
          href={href}
          className="mt-2 flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2.5 text-sm font-semibold text-primary hover:bg-muted/70"
        >
          Visit About Us <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { itemCount } = useCart();
  const { slugs } = useWishlist();
  const router = useRouter();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <AboutMenu key={link.href} {...link} />
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <form onSubmit={submitSearch} className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              className="w-44 rounded-full border border-border bg-muted/50 py-2 pl-8 pr-3 text-sm outline-none ring-ring/50 focus:ring-2 lg:w-56"
            />
          </form>

          <Button variant="ghost" size="icon" asChild aria-label="Wishlist">
            <Link href="/wishlist" className="relative">
              <Heart className="h-5 w-5" />
              {slugs.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {slugs.length}
                </span>
              )}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild aria-label="Cart">
            <Link href="/cart" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{SITE_NAME}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-2 text-base font-semibold"
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="ml-3 flex flex-col gap-1 border-l border-border pl-3">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className={cn("py-1.5 text-sm text-muted-foreground hover:text-primary")}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
