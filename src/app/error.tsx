"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export default function GlobalError({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
      <EmptyState
        icon={TriangleAlert}
        title="Something went wrong"
        description="We hit an unexpected error loading this page. Please try again or head back home."
        actionLabel="Back to Home"
        actionHref="/"
      />
    </div>
  );
}
