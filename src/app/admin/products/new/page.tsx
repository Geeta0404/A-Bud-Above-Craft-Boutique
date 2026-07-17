import { ProductForm } from "@/components/admin/ProductForm";
import { CategoryRepository } from "@/repositories/CategoryRepository";
import { BrandRepository } from "@/repositories/BrandRepository";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    CategoryRepository.list(true),
    BrandRepository.list(true),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold">Add Product</h1>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
