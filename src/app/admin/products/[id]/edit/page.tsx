import { notFound } from "next/navigation";
import { getProductById } from "@/lib/databricks/products";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold">Edit Product</h1>
      <ProductForm productId={id} initial={product} />
    </div>
  );
}
