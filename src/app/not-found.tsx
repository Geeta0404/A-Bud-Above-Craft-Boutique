import { Compass } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
        actionLabel="Back to Home"
        actionHref="/"
      />
    </div>
  );
}
