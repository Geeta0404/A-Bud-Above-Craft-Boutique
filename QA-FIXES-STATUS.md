# QA Audit — Fix Status

Tracks the 17 findings from the pre-production QA audit (see the audit artifact for full repro
details). Status as of this pass.

## Fixed

| ID | Finding | What changed |
|----|---------|--------------|
| C1 | Split site identity — copy described a candle/pottery boutique, not a cannabis retailer | Rewrote hero, testimonials, newsletter, Instagram gallery, About, Our Story, Workshops (+ data), FAQ (+ data), Blog (+ data), Terms, Categories, and cart empty-state copy. Removed the now-unused legacy stock-photo exports in `src/lib/images.ts`. |
| C2 | Two conflicting business addresses (Halifax vs. Vancouver) | `Footer.tsx` and `contact/page.tsx` now read address/phone/email from the single `STORE_INFO` constant in `src/lib/constants.ts` instead of hardcoding a separate address. |
| H1 | Age gate had no keyboard focus trap | `AgeGate.tsx` now traps Tab/Shift+Tab inside the dialog while it's open. Verified: focus stays inside after 16+ Tab presses. |
| H3 | Every product review site-wide shared identical text | `reviews()` generator in `src/lib/data/products.ts` now varies body text (10 variants), author pool (16 names), and occasionally rates 3 stars instead of always 4–5. |
| H4 | "Added to cart" toast rendered on top of the Checkout button | Moved `Toaster` position from `bottom-right` to `top-center` in `layout.tsx`, so it no longer collides with the cart drawer's CTA. |
| H5 | Sidebar filter counts ignored the active search query, producing dead-end filters | `CategoryShopClient.tsx` now computes a search-scoped product list and passes it to the sidebar; category **and** brand counts (brand counts are new) reflect the active search. |
| M1 | "Clear filters" on empty results navigated to `/shop` instead of resetting | `ProductGrid`/`ProductList` now accept an `onClearFilters` callback wired to the real filter-reset function, instead of a hardcoded link. |
| M2 | Cart toast didn't reliably auto-dismiss | Root cause was the same bottom-right collision as H4; resolved by the same position change. |
| M3 | Footer social icons were the wrong glyphs (`@` / globe) and linked nowhere | Replaced with hand-drawn Instagram/Facebook icons (lucide-react no longer ships brand icons) and pointed the links at real-looking profile URLs instead of `#`. |
| M4 | "Continue with Gmail" was the wrong label for Google sign-in | Changed to "Continue with Google" in `GoogleSignInButton.tsx`. |
| M5 | Light color themes flashed the default dark theme on every page load | Added a blocking inline script (`layout.tsx`) that applies the saved palette before first paint. Verified no flash on hard reload. |
| L1 | Two newsletter forms with inconsistent styling/placeholder conventions | Aligned placeholder text and gave the homepage form a `bg-muted` section + better input contrast. |
| L3 | THC/CBD potency was hidden a tab deep on the product page | Now shown inline in the main summary, matching every product card sitewide. |

## Also fixed (not in the original numbered list, found while fixing the above)

- Brand filter list on `/shop/all` now shows counts and scopes to the active search (previously showed the full unscoped brand list with no counts at all).

## Pending / not fixed (out of scope for a code change)

| ID | Finding | Why it's still open |
|----|---------|----------------------|
| C3 | Auth backend (Supabase) unreachable — login/register/admin non-functional | Infrastructure issue, not a code bug. The configured Supabase project itself doesn't respond to a direct health check. Needs to be checked on the Supabase dashboard (paused/deleted project, or wrong env var) — nothing in the app code is misconfigured. |
| H2 | Age/ID verification (age gate + checkout DOB check) is enforced entirely client-side | Architectural — there's no backend to enforce this server-side in the current app. Flagged as a real gap for a production cannabis storefront, but fixing it means adding server-side enforcement, which is a design decision, not a bug fix. |
| L2 | `/categories` is an orphaned page (no longer linked from nav since the Shop mega-menu covers it) | Left as-is pending a decision on whether the standalone category grid should stay reachable (e.g. re-link from footer) or be removed. |
| L4 | Mobile/responsive viewport not verified | Testing-environment limitation during the audit (viewport resize didn't take effect in that session), not a code defect. Worth a dedicated mobile pass on a real device before launch. |

## Requested behavior change (separate from the audit)

- **Guest browsing/checkout**: verified already correct — no code gates Shop, PDP, Cart, or Wishlist
  behind login (middleware only protects `/admin`). Checkout offers login/create-account up front
  but never blocks the guest path; confirmed live that a guest can add to cart and reach
  `/checkout` without a redirect.
