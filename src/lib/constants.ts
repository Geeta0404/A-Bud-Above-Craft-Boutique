export const SITE_NAME = "A Bud Above Craft Boutique";
export const SITE_TAGLINE = "Premium Cannabis, Thoughtfully Curated";
export const SITE_DESCRIPTION =
  "Premium flower, pre-rolls, vapes, edibles, concentrates, topicals, and beverages from trusted BC brands. Curated cannabis, delivered with care.";
export const SITE_URL = "https://abudabovecraftboutique.ca";

// Top utility bar — brand, informational links, and account/cart actions.
export const TOP_NAV_LINKS = [
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "About Us", href: "/about", description: "Our mission, values, and craft" },
      { label: "Our Story", href: "/our-story", description: "How A Bud Above began" },
      { label: "Workshops & Events", href: "/workshops", description: "Hands-on classes and product tastings" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Delivery", href: "/delivery" },
  { label: "Contact", href: "/contact" },
];

// Secondary shop bar — browsing links, the Shop mega menu, and search.
export const SECONDARY_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Brands", href: "/brands" },
  { label: "Specials", href: "/specials" },
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

export const STORE_INFO = {
  name: "A Bud Above Craft Boutique",
  address: "1204 Granville Street, Vancouver, BC",
  phone: "1-800-555-0123",
  email: "hello@abudabovecraftboutique.ca",
  pickupHours: "In-store & curbside pickup available 9:00 AM – 9:00 PM daily",
  deliveryHours: "Delivery available 11:00 AM – 8:00 PM daily",
};

export const CAD = (amount: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount);

export const discountPercent = (price: number, compareAtPrice: number) =>
  Math.round((1 - price / compareAtPrice) * 100);
