# A Bud Above Craft Boutique

A premium, production-quality eCommerce storefront for a Canadian artisan craft boutique, built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and Shadcn UI.

> 🇨🇦 Handcrafted candles, pottery, woodwork, home décor, textile art, and gifts from independent Canadian makers.

## Overview

This project is a fully responsive, SEO-optimized storefront demonstrating a complete eCommerce shopping experience — browsing, searching, filtering, cart, wishlist, and a multi-step checkout flow — built entirely on static/mock data so it can be reviewed and deployed without any backend setup. Cart and wishlist state persist in the browser via `localStorage`. Checkout is a fully-built UI flow (shipping → payment → review → confirmation) but does **not** process real payments; it's designed to be wired to a real backend/payment provider (e.g. Shopify, Stripe) later.

## Features

- 14 fully built pages: Home, Shop, Product Details, Categories, About Us, Our Story, Workshops & Events, Blog (+ post), FAQ, Contact, Cart, Checkout (+ confirmation), Privacy Policy, Terms & Conditions
- Product search, category & price filters, sorting (popularity, newest, price)
- Shopping cart and wishlist with `localStorage` persistence
- Multi-step checkout with `react-hook-form` + `zod` validation
- Product reviews, ratings, and related products
- Custom SVG-based favicon/brand mark and Open Graph image generated at build time
- SEO: per-page metadata, Open Graph/Twitter cards, `sitemap.xml`, `robots.txt`, JSON-LD structured data (Organization, Product, BlogPosting, FAQPage)
- Loading skeletons, empty states, and error boundaries
- Accessible, keyboard-navigable, responsive UI (mobile, tablet, desktop)

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router, Turbopack, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/) (Radix-based components)
- [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) for form validation
- [lucide-react](https://lucide.dev/) for icons
- [Sonner](https://sonner.emilkowal.ski/) for toast notifications
- Fonts: `Playfair Display` (headings) + `Inter` (body) via `next/font/google`

## Folder Structure

```
src/
  app/                      Routes (App Router)
    page.tsx                Home
    shop/                   Shop listing + [slug] product details
    categories/             Category index + [slug] category listing
    about/, our-story/, workshops/, blog/, faq/, contact/
    cart/, checkout/        Cart and multi-step checkout + confirmation
    privacy-policy/, terms/
    sitemap.ts, robots.ts, icon.tsx, opengraph-image.tsx
  components/
    layout/                 Header, Footer
    home/                   Homepage sections (Hero, FeaturedCollections, etc.)
    shop/                   ProductCard, ProductGrid, FilterSidebar, SortDropdown
    product/                Gallery, Reviews, RelatedProducts, AddToCartForm
    cart/, checkout/        CartItemRow, OrderSummary, CheckoutClient
    shared/                 RatingStars, EmptyState, JsonLd, PageBreadcrumbs
    ui/                     Shadcn UI primitives
  lib/
    data/                   Mock data: products, categories, blog, testimonials, workshops, faqs
    types.ts, utils.ts, constants.ts, checkoutSchema.ts
  context/                  CartContext, WishlistContext (localStorage-backed)
  hooks/                    useDebounce
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other commands

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint the codebase
```

## Deployment (Vercel)

1. Push this repository to GitHub (already configured for `A-Bud-Above-Craft-Boutique`).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework preset: **Next.js** (auto-detected). No environment variables are required for the current mock-data setup.
4. Click **Deploy** — Vercel will build and host the site automatically on every push to `main`.
5. Update `SITE_URL` in `src/lib/constants.ts` to your production domain so metadata, sitemap, and Open Graph tags resolve correctly.

## Roadmap / Next Steps

- Replace the mock data layer (`src/lib/data/*`) with a real backend or headless CMS
- Integrate a real payment processor (e.g. Stripe) into the checkout flow
- Add account/authentication and order history
- Add automated tests (unit + e2e)

## License

All rights reserved — A Bud Above Craft Boutique.
