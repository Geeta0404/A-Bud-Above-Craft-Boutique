import { RatingStars } from "@/components/shared/RatingStars";
import type { Review } from "@/lib/types";

export function Reviews({ reviews, rating, count }: { reviews: Review[]; rating: number; count: number }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <RatingStars rating={rating} />
        <span className="text-sm text-muted-foreground">
          {rating.toFixed(1)} · {count} reviews
        </span>
      </div>
      <div className="mt-6 space-y-6 divide-y divide-border">
        {reviews.map((review) => (
          <div key={review.id} className="pt-6 first:pt-0">
            <div className="flex items-center justify-between">
              <p className="font-medium">{review.author}</p>
              <time className="text-xs text-muted-foreground">{review.date}</time>
            </div>
            <RatingStars rating={review.rating} className="mt-1" />
            <p className="mt-2 font-medium">{review.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{review.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
