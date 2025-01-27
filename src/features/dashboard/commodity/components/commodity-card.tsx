import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface CommodityCardProps {
  data: {
    name: string;
    currentPrice: number;
    weekChange: number;
    prices: {
      week: { price: number; change: number };
      month: { price: number; change: number };
      quarter: { price: number; change: number };
      year: { price: number; change: number };
    };
    volume: {
      weekly: { amount: number; unit: string; change: number };
      daily: { trades: number; change: number };
    };
    volatility: {
      current: number;
      change: number;
      benchmark: number;
    };
    nutrition: {
      protein: number;
      carbs: number;
      fat: number;
    };
    sustainability: {
      co2: number;
      annualOutput: { amount: number; unit: string };
    };
  };
  className?: string;
}

export function CommodityCard({ data, className }: CommodityCardProps) {
  // Helper function to format percentage changes
  const formatChange = (value: number) => {
    const prefix = value >= 0 ? "+" : "−";
    return `${prefix}${Math.abs(value).toFixed(1)}%`;
  };

  // Helper function to format volume
  const formatVolume = (amount: number, unit: string) => `${amount}${unit}`;

  return (
    <Card className={cn("p-6 space-y-6", className)}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">{data.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xl font-bold">€{data.currentPrice.toFixed(2)}</span>
          <span className={cn(
            "flex items-center text-sm font-medium",
            data.weekChange >= 0 ? "text-emerald-600" : "text-red-600"
          )}>
            {data.weekChange >= 0 ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {formatChange(data.weekChange)} vs last week
          </span>
        </div>
      </div>

      {/* Price & Trends */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Price & Trends</h4>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(data.prices).map(([period, { price, change }]) => (
            <div key={period}>
              <div className="text-sm font-medium capitalize">{period}:</div>
              <div className="flex items-center gap-2">
                <span>€{price.toFixed(2)}</span>
                <span className={cn(
                  "text-sm",
                  change >= 0 ? "text-emerald-600" : "text-red-600"
                )}>
                  {change >= 0 ? "▲" : "▼"} {formatChange(change)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Volume & Activity */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Volume & Activity</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Weekly Volume:</span>
            <span className="text-sm font-medium">
              {formatVolume(data.volume.weekly.amount, data.volume.weekly.unit)}
              <span className="text-muted-foreground ml-2">
                ({formatChange(data.volume.weekly.change)} vs 4-week avg)
              </span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Daily Trades:</span>
            <span className="text-sm font-medium">
              {data.volume.daily.trades} trades
              <span className="text-muted-foreground ml-2">
                ({formatChange(data.volume.daily.change)} vs yesterday)
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Market Volatility */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Market Volatility</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Volatility:</span>
            <span className="text-sm font-medium">
              {data.volatility.current}%
              <span className="text-muted-foreground ml-2">
                ({formatChange(data.volatility.change)} vs last year)
              </span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Benchmark:</span>
            <span className="text-sm font-medium">
              5-Year Avg: {data.volatility.benchmark}%
            </span>
          </div>
        </div>
      </div>

      {/* Nutritional Profile */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Nutritional Profile</h4>
        <div className="flex items-center gap-4">
          <span className="text-sm">
            <span className="font-medium">Protein:</span> {data.nutrition.protein}%
          </span>
          <span className="text-sm">
            <span className="font-medium">Carbs:</span> {data.nutrition.carbs}%
          </span>
          <span className="text-sm">
            <span className="font-medium">Fat:</span> {data.nutrition.fat}%
          </span>
        </div>
      </div>

      {/* Sustainability */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Sustainability</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">CO2eq/ton:</span>
            <span className="text-sm font-medium">{data.sustainability.co2}kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Annual Output:</span>
            <span className="text-sm font-medium">
              {formatVolume(data.sustainability.annualOutput.amount, data.sustainability.annualOutput.unit)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}