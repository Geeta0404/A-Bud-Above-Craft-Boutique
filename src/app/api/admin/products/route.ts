import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { ProductRepository } from "@/repositories/ProductRepository";
import type { ProductInput } from "@/types/catalog";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items: products } = await ProductRepository.list({ includeInactive: true, limit: 100 });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const input = (await request.json()) as ProductInput;

  if (!input.slug || !input.name || !input.categoryId || typeof input.price !== "number") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const product = await ProductRepository.create(input);
  return NextResponse.json({ product }, { status: 201 });
}
