import { ProductGridSkeleton } from "@/components/shared/ProductGridSkeleton";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ProductGridSkeleton />
    </div>
  );
}
