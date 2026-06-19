export const SITE_NAME = "A Bud Above Craft Boutique";
export const SITE_DESCRIPTION =
  "Handcrafted candles, pottery, woodwork, textile art, and artisan gifts made by independent makers. Discover one-of-a-kind pieces for your home and the people you love.";
export const SITE_URL = "https://abudabovecraftboutique.ca";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "About Us", href: "/about", description: "Our mission, values, and craft" },
      { label: "Our Story", href: "/our-story", description: "How A Bud Above began" },
      { label: "Workshops & Events", href: "/workshops", description: "Hands-on classes with our artisans" },
      { label: "Blog", href: "/blog", description: "Care guides & artisan spotlights" },
    ],
  },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = {
  about: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Our Story", href: "/our-story" },
    { label: "Workshops & Events", href: "/workshops" },
  ],
  resource: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "FAQ's", href: "/faq" },
    { label: "Blog", href: "/blog" },
  ],
};

export const CAD = (amount: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount);
