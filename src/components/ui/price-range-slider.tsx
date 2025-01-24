import { cn } from "@/lib/utils";

interface PriceRange {
  low: number;
  high: number;
  current: number;
}

interface PriceRangeSliderProps {
  range: PriceRange;
  className?: string;
  dotClassName?: string;
}

export function PriceRangeSlider({ range, className, dotClassName }: PriceRangeSliderProps) {
  const { low, high, current } = range;
  const percentage = ((current - low) / (high - low)) * 100;

  return (
    <div className="space-y-4">
      <div className="relative h-2 bg-neutral-100 rounded-full">
        <div 
          className={cn(
            "absolute h-2 rounded-full",
            className
          )}
          style={{ width: `${percentage}%` }}
        />
        <div 
          className={cn(
            "absolute h-4 w-4 top-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm",
            dotClassName
          )}
          style={{ left: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <span className="font-medium text-neutral-600">€{low}</span>
        <span className="font-medium text-teal-600">€{current}</span>
        <span className="font-medium text-neutral-600">€{high}</span>
      </div>
    </div>
  );
}