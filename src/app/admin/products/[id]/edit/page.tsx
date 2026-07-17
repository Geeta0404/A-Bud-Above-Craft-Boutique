import { notFound } from "next/navigation";
import { ProductRepository } from "@/repositories/ProductRepository";
import { CategoryRepository } from "@/repositories/CategoryRepository";
import { BrandRepository } from "@/repositories/BrandRepository";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    ProductRepository.findById(Number(id)),
    CategoryRepository.list(true),
    BrandRepository.list(true),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold">Edit Product</h1>
      <ProductForm productId={product.id} initial={product} categories={categories} brands={brands} />
    </div>
  );
}
