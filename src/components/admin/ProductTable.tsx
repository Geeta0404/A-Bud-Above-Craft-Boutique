"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CAD } from "@/lib/constants";
import type { Product } from "@/types/catalog";

export function ProductTable({ products }: { products: Product[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setDeletingId(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (!res.ok) {
      toast.error("Failed to delete product.");
      return;
    }

    toast.success("Product deleted.");
    router.refresh();
  };

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
        No products yet. Add your first one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {product.images?.[0] && (
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                      <Image src={product.images[0].imageUrl} alt={product.name} fill className="object-cover" sizes="40px" />
                    </div>
                  )}
                  <span className="font-medium">{product.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 capitalize text-muted-foreground">{product.categoryName}</td>
              <td className="px-4 py-3">{CAD(product.price)}</td>
              <td className="px-4 py-3">{product.stockQuantity}</td>
              <td className="px-4 py-3">
                <Badge variant={product.stockQuantity > 0 ? "default" : "secondary"}>
                  {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/admin/products/${product.id}/edit`} aria-label={`Edit ${product.name}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={deletingId === product.id}
                    onClick={() => handleDelete(product.id, product.name)}
                    aria-label={`Delete ${product.name}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
