import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { listProducts, createProduct } from "@/lib/databricks/products";
import type { AdminProductInput } from "@/lib/types";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await listProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const input = (await request.json()) as AdminProductInput;

  if (!input.slug || !input.name || !input.category || typeof input.price !== "number") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const id = await createProduct(input);
  return NextResponse.json({ id }, { status: 201 });
}
