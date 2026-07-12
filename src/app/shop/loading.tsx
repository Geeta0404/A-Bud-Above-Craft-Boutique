import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-[42vh] min-h-[280px] w-full rounded-2xl" />
      <div className="flex gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/5] w-36 shrink-0 rounded-2xl" />
        ))}
      </div>
      <div className="flex gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-52 shrink-0 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
