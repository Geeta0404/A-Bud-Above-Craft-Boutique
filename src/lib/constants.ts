export const SITE_NAME = "A Bud Above Craft Boutique";
export const SITE_DESCRIPTION =
  "Handcrafted candles, pottery, woodwork, textile art, and artisan gifts made by Canadian makers. Discover one-of-a-kind pieces for your home and the people you love.";
export const SITE_URL = "https://abudabovecraftboutique.ca";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Workshops & Events", href: "/workshops" },
  { label: "Our Story", href: "/our-story" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "Categories", href: "/categories" },
    { label: "Best Sellers", href: "/shop?sort=popularity" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/our-story" },
    { label: "Workshops & Events", href: "/workshops" },
    { label: "Blog", href: "/blog" },
  ],
  support: [
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

export const CAD = (amount: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount);
