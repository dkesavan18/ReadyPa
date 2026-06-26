import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  totalRatings?: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingStars({ rating, totalRatings, size = "sm", className }: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Star
        className={cn(
          "fill-yellow-400 text-yellow-400",
          size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
        )}
      />
      <span className={cn("font-semibold", size === "sm" ? "text-xs" : "text-sm")}>
        {rating.toFixed(1)}
      </span>
      {totalRatings !== undefined && (
        <span className={cn("text-gray-400", size === "sm" ? "text-xs" : "text-sm")}>
          ({totalRatings})
        </span>
      )}
    </div>
  );
}
