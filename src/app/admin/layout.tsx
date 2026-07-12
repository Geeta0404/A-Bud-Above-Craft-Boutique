import type { ReactNode } from "react";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-heading text-xl font-semibold">
              Admin
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/admin/products" className="hover:text-foreground">Products</Link>
              <Link href="/admin/products/new" className="hover:text-foreground">Add Product</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{user?.email || user?.phone}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
