"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Heart, ShoppingBag, Search, ChevronDown, ArrowRight } from "lucide-react";
import { TOP_NAV_LINKS, SECONDARY_NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { categories } from "@/lib/data/categories";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/auth/UserMenu";

// The secondary shop bar only appears on shop-related sections of the site.
const SHOP_ROUTE_PREFIXES = ["/shop", "/brands", "/specials", "/categories"];

function isShopRoute(pathname: string) {
  return SHOP_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

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

function AboutMenu({ label, href, children }: (typeof TOP_NAV_LINKS)[number]) {
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

function ShopMegaMenu() {
  const half = Math.ceil(categories.length / 2);
  const columns = [categories.slice(0, half), categories.slice(half)];

  return (
    <div className="group relative">
      <Link
        href="/shop"
        className="flex items-center gap-1 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
      >
        Shop
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
      </Link>
      <div className="invisible absolute left-0 top-full z-50 w-[420px] translate-y-2 rounded-2xl border border-border bg-popover p-5 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-3 group-hover:opacity-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Categories</p>
        <div className="mt-3 grid grid-cols-2 gap-x-6">
          {columns.map((column, i) => (
            <div key={i} className="flex flex-col">
              {column.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="rounded-lg px-2 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <Link
          href="/shop/all"
          className="mt-2 flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2.5 text-sm font-semibold text-primary hover:bg-muted/70"
        >
          Shop All Products <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function SearchForm({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query ? `/shop/all?q=${encodeURIComponent(query)}` : "/shop/all");
  };

  return (
    <form onSubmit={submitSearch} className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        className="w-full rounded-full border border-border bg-muted/50 py-1.5 pl-8 pr-3 text-sm outline-none ring-ring/50 focus:ring-2 sm:w-80"
      />
    </form>
  );
}

function AccountActions({ iconSize = "h-11 w-11" }: { iconSize?: string }) {
  const { itemCount, openCart } = useCart();
  const { slugs } = useWishlist();

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <UserMenu />

      <Button variant="ghost" size="icon" className={iconSize} asChild aria-label="Wishlist">
        <Link href="/wishlist" className="relative">
          <Heart className="size-6" />
          {slugs.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {slugs.length}
            </span>
          )}
        </Link>
      </Button>

      <Button variant="ghost" size="icon" className={cn("relative", iconSize)} aria-label="Cart" onClick={openCart}>
        <ShoppingBag className="size-6" />
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {itemCount}
          </span>
        )}
      </Button>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const showSecondaryBar = isShopRoute(pathname);

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex">
            {TOP_NAV_LINKS.map((link) =>
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
            <Button asChild size="sm" className="hidden lg:inline-flex">
              <Link href="/shop">Shop Now</Link>
            </Button>

            <div className="flex lg:hidden">
              <AccountActions />
            </div>

            {!showSecondaryBar && (
              <div className="hidden lg:flex">
                <AccountActions iconSize="h-9 w-9" />
              </div>
            )}

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
                <div className="px-4">
                  <SearchForm className="w-full" />
                </div>
                <nav className="flex flex-col gap-1 px-4 pt-2">
                  {SECONDARY_NAV_LINKS.map((link) => (
                    <div key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block py-2 text-base font-semibold"
                      >
                        {link.label}
                      </Link>
                      {link.label === "Shop" && (
                        <div className="ml-3 flex flex-col gap-1 border-l border-border pl-3">
                          {categories.map((category) => (
                            <Link
                              key={category.slug}
                              href={`/categories/${category.slug}`}
                              onClick={() => setOpen(false)}
                              className="py-1.5 text-sm text-muted-foreground hover:text-primary"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="my-1 h-px bg-border" />
                  {TOP_NAV_LINKS.map((link) => (
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
      </div>

      {showSecondaryBar && (
        <div className="hidden border-b border-border bg-card lg:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-6">
              {SECONDARY_NAV_LINKS.map((link) =>
                link.label === "Shop" ? (
                  <ShopMegaMenu key={link.href} />
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
              <SearchForm />
            </nav>

            <AccountActions iconSize="h-9 w-9" />
          </div>
        </div>
      )}
    </header>
  );
}
