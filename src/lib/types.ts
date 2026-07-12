export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
};

export type StrainType = "Sativa" | "Indica" | "Hybrid" | "Blend";
export type PotencyUnit = "%" | "mg";

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  longDescription: string;
  images: string[];
  brand: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  tags: string[];
  inStock: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  isSeasonal?: boolean;
  createdAt: string;
  strainType: StrainType;
  thcMin: number;
  thcMax: number;
  thcUnit: PotencyUnit;
  cbdMin: number;
  cbdMax: number;
  cbdUnit: PotencyUnit;
  size: string;
};

export type Testimonial = {
  id: string;
  author: string;
  location: string;
  rating: number;
  quote: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
};

export type Workshop = {
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  price: number;
  seatsLeft: number;
  instructor: string;
};

export type FaqItem = {
  question: string;
  answer: string;
  category: string;
};

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

// Admin-managed product record, persisted in Databricks.
export type AdminProduct = Product & {
  id: string;
  stockQuantity: number;
  updatedAt: string;
};

export type AdminProductInput = Omit<AdminProduct, "id" | "createdAt" | "updatedAt" | "reviews" | "rating" | "reviewCount"> & {
  rating?: number;
  reviewCount?: number;
};
