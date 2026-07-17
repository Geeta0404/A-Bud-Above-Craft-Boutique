export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CategoryInput = {
  name: string;
  slug: string;
  description?: string | null;
  parentId?: number | null;
  imageUrl?: string | null;
  isActive?: boolean;
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BrandInput = {
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  isActive?: boolean;
};

export type ProductImage = {
  id: number;
  productId: number;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type ProductSpecification = {
  id: number;
  productId: number;
  specKey: string;
  specValue: string;
  sortOrder: number;
};

export type StrainType = "Sativa" | "Indica" | "Hybrid" | "Blend";
export type PotencyUnit = "%" | "mg";

export type Product = {
  id: number;
  categoryId: number;
  brandId: number | null;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  longDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  strainType: StrainType | null;
  thcMin: number | null;
  thcMax: number | null;
  thcUnit: PotencyUnit | null;
  cbdMin: number | null;
  cbdMax: number | null;
  cbdUnit: PotencyUnit | null;
  size: string | null;
  isBestSeller: boolean;
  isNew: boolean;
  isSeasonal: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  images?: ProductImage[];
  specifications?: ProductSpecification[];
  categoryName?: string;
  categorySlug?: string;
  brandName?: string;
  brandSlug?: string;
};

export type ProductInput = {
  categoryId: number;
  brandId?: number | null;
  name: string;
  slug: string;
  sku?: string | null;
  description?: string | null;
  longDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  stockQuantity?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  strainType?: StrainType | null;
  thcMin?: number | null;
  thcMax?: number | null;
  thcUnit?: PotencyUnit | null;
  cbdMin?: number | null;
  cbdMax?: number | null;
  cbdUnit?: PotencyUnit | null;
  size?: string | null;
  isBestSeller?: boolean;
  isNew?: boolean;
  isSeasonal?: boolean;
  tags?: string[];
  images?: { imageUrl: string; altText?: string | null; sortOrder?: number; isPrimary?: boolean }[];
  specifications?: { specKey: string; specValue: string; sortOrder?: number }[];
};

export type ProductListFilters = {
  q?: string;
  categoryId?: number;
  categorySlug?: string;
  brandId?: number;
  brandSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  includeInactive?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "rating" | "name";
  page?: number;
  limit?: number;
};
