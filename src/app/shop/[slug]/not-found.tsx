import { PackageX } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <EmptyState
        icon={PackageX}
        title="Product not found"
        description="This item may have sold out or moved. Browse the shop to find something just as lovely."
        actionLabel="Back to Shop"
        actionHref="/shop"
      />
    </div>
  );
}
