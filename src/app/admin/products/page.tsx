import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductRepository } from "@/repositories/ProductRepository";
import { ProductTable } from "@/components/admin/ProductTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const { items: products } = await ProductRepository.list({ includeInactive: true, limit: 100 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} product{products.length === 1 ? "" : "s"}</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      <ProductTable products={products} />
    </div>
  );
}
