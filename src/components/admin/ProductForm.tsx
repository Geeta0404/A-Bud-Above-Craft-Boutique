"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { categories } from "@/lib/data/categories";
import type { AdminProduct, AdminProductInput } from "@/lib/types";

type Props = {
  productId?: string;
  initial?: AdminProduct;
};

const empty: AdminProductInput = {
  slug: "",
  name: "",
  category: categories[0].slug,
  price: 0,
  compareAtPrice: undefined,
  description: "",
  longDescription: "",
  images: [],
  brand: "",
  tags: [],
  strainType: "Hybrid",
  thcMin: 0,
  thcMax: 0,
  thcUnit: "%",
  cbdMin: 0,
  cbdMax: 0,
  cbdUnit: "%",
  size: "",
  inStock: true,
  stockQuantity: 0,
  isBestSeller: false,
  isNew: false,
  isSeasonal: false,
};

export function ProductForm({ productId, initial }: Props) {
  const [form, setForm] = useState<AdminProductInput>(
    initial
      ? {
          slug: initial.slug,
          name: initial.name,
          category: initial.category,
          price: initial.price,
          compareAtPrice: initial.compareAtPrice,
          description: initial.description,
          longDescription: initial.longDescription,
          images: initial.images,
          brand: initial.brand,
          tags: initial.tags,
          strainType: initial.strainType,
          thcMin: initial.thcMin,
          thcMax: initial.thcMax,
          thcUnit: initial.thcUnit,
          cbdMin: initial.cbdMin,
          cbdMax: initial.cbdMax,
          cbdUnit: initial.cbdUnit,
          size: initial.size,
          inStock: initial.inStock,
          stockQuantity: initial.stockQuantity,
          isBestSeller: initial.isBestSeller,
          isNew: initial.isNew,
          isSeasonal: initial.isSeasonal,
        }
      : empty
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const update = <K extends keyof AdminProductInput>(key: K, value: AdminProductInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    e.target.value = "";

    if (!res.ok) {
      toast.error(data.error || "Upload failed");
      return;
    }

    update("images", [...form.images, data.url]);
  };

  const removeImage = (url: string) => update("images", form.images.filter((i) => i !== url));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = productId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Failed to save product");
      return;
    }

    toast.success(productId ? "Product updated" : "Product created");
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" required value={form.slug} onChange={(e) => update("slug", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <Select value={form.category} onValueChange={(v) => update("category", v)}>
            <SelectTrigger id="category"><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price">Price (CAD)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            required
            value={form.price}
            onChange={(e) => update("price", parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="compareAtPrice">Compare-at Price</Label>
          <Input
            id="compareAtPrice"
            type="number"
            step="0.01"
            min="0"
            value={form.compareAtPrice ?? ""}
            onChange={(e) => update("compareAtPrice", e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Short Description</Label>
        <Textarea id="description" required rows={2} value={form.description} onChange={(e) => update("description", e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="longDescription">Full Description</Label>
        <Textarea id="longDescription" rows={5} value={form.longDescription} onChange={(e) => update("longDescription", e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" value={form.brand} onChange={(e) => update("brand", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="size">Size</Label>
          <Input id="size" placeholder="e.g. 3.5g, 1 x 355mL" value={form.size} onChange={(e) => update("size", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stockQuantity">Stock Quantity</Label>
          <Input
            id="stockQuantity"
            type="number"
            min="0"
            required
            value={form.stockQuantity}
            onChange={(e) => update("stockQuantity", parseInt(e.target.value, 10) || 0)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={form.tags.join(", ")}
          onChange={(e) => update("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="strainType">Strain Type</Label>
          <Select value={form.strainType} onValueChange={(v) => update("strainType", v as AdminProductInput["strainType"])}>
            <SelectTrigger id="strainType"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Sativa">Sativa</SelectItem>
              <SelectItem value="Indica">Indica</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
              <SelectItem value="Blend">Blend</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>THC Range</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.1"
              min="0"
              aria-label="THC min"
              value={form.thcMin}
              onChange={(e) => update("thcMin", parseFloat(e.target.value) || 0)}
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="number"
              step="0.1"
              min="0"
              aria-label="THC max"
              value={form.thcMax}
              onChange={(e) => update("thcMax", parseFloat(e.target.value) || 0)}
            />
            <Select value={form.thcUnit} onValueChange={(v) => update("thcUnit", v as AdminProductInput["thcUnit"])}>
              <SelectTrigger className="w-20" aria-label="THC unit"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="%">%</SelectItem>
                <SelectItem value="mg">mg</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>CBD Range</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.1"
              min="0"
              aria-label="CBD min"
              value={form.cbdMin}
              onChange={(e) => update("cbdMin", parseFloat(e.target.value) || 0)}
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="number"
              step="0.1"
              min="0"
              aria-label="CBD max"
              value={form.cbdMax}
              onChange={(e) => update("cbdMax", parseFloat(e.target.value) || 0)}
            />
            <Select value={form.cbdUnit} onValueChange={(v) => update("cbdUnit", v as AdminProductInput["cbdUnit"])}>
              <SelectTrigger className="w-20" aria-label="CBD unit"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="%">%</SelectItem>
                <SelectItem value="mg">mg</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Product Images</Label>
        <div className="flex flex-wrap gap-3">
          {form.images.map((url) => (
            <div key={url} className="relative h-24 w-24 overflow-hidden rounded-lg border border-border">
              <Image src={url} alt="" fill className="object-cover" sizes="96px" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 rounded-full bg-background/90 p-1"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
        {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={form.inStock} onCheckedChange={(v) => update("inStock", Boolean(v))} />
          In Stock
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={form.isBestSeller} onCheckedChange={(v) => update("isBestSeller", Boolean(v))} />
          Best Seller
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={form.isNew} onCheckedChange={(v) => update("isNew", Boolean(v))} />
          New Arrival
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={form.isSeasonal} onCheckedChange={(v) => update("isSeasonal", Boolean(v))} />
          Seasonal
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting || uploading} size="lg">
          {submitting ? "Saving…" : productId ? "Save Changes" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
