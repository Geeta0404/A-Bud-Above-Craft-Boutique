import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistProvider } from "@/context/WishlistContext";
import { PaletteProvider } from "@/context/PaletteContext";
import { Toaster } from "@/components/ui/sonner";
import { JsonLd } from "@/components/shared/JsonLd";
import { PaletteSwitcher } from "@/components/shared/PaletteSwitcher";
import { AgeGate } from "@/components/shared/AgeGate";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";
import { palettes, defaultPaletteId } from "@/lib/palettes";
import { getCategories } from "@/lib/data/categories";

// Applies the saved palette's CSS variables and dark/light class before first paint,
// so a light theme doesn't flash the default dark background on load (see PaletteContext).
const paletteMap = Object.fromEntries(palettes.map((p) => [p.id, { mode: p.mode, colors: p.colors }]));
const themeInitScript = `(function(){try{var palettes=${JSON.stringify(paletteMap)};var id=localStorage.getItem("aba-palette")||"${defaultPaletteId}";var p=palettes[id]||palettes["${defaultPaletteId}"];var root=document.documentElement;for(var key in p.colors){var cssVar="--"+key.replace(/([A-Z])/g,"-$1").toLowerCase();root.style.setProperty(cssVar,p.colors[key]);}root.classList.toggle("dark",p.mode==="dark");}catch(e){}})();`;

const heading = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const logoFont = Cormorant_Garamond({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const categories = await getCategories();

  return (
    <html
      lang="en-CA"
      className={`${heading.variable} ${body.variable} ${logoFont.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            sameAs: [],
          }}
        />
        <AgeGate />
        <PaletteProvider>
          <CartProvider>
            <WishlistProvider>
              <Header categories={categories} />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
            </WishlistProvider>
          </CartProvider>
          <PaletteSwitcher />
        </PaletteProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
