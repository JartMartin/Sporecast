import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface PriceCardProps {
  price: number;
  change: number;
  timeframe: string;
  exchange: string;
}

export function PriceCard({ price, change, timeframe, exchange }: PriceCardProps) {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-emerald-50/50 rounded-lg p-4 border border-teal-100">
      <div className="flex items-center gap-2 text-sm text-teal-700 mb-2">
        <TrendingUp className="h-4 w-4" />
        Current Price
      </div>
      <div className="text-2xl font-bold text-teal-900">€{price.toFixed(2)}</div>
      <div className={cn(
        "text-sm font-medium mt-1",
        change >= 0 ? "text-emerald-600" : "text-red-600"
      )}>
        {change >= 0 ? '+' : ''}{change.toFixed(1)}% from last {timeframe}
      </div>
      <div className="text-sm text-teal-600/80 mt-1">{exchange}</div>
    </div>
  );
}