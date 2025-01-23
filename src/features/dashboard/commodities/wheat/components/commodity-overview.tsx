import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CommodityOverviewProps {
  name: string;
  exchange: string;
  marketCode: string;
  currentPrice: number;
  priceChange: number;
  percentChange: number;
  lastUpdate: Date;
}

export function CommodityOverview({
  name,
  exchange,
  marketCode,
  currentPrice,
  priceChange,
  percentChange,
  lastUpdate,
}: CommodityOverviewProps) {
  const isPositive = priceChange >= 0;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Title and Exchange */}
        <div>
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm text-muted-foreground">{exchange}</span>
            <span className="text-sm font-medium bg-neutral-100 px-2 py-1 rounded">
              {marketCode}
            </span>
          </div>
        </div>

        {/* Price Information */}
        <div className="space-y-1">
          <div className="text-2xl font-semibold">
            ${currentPrice.toFixed(2)}
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-medium",
              isPositive ? "text-emerald-600" : "text-red-600"
            )}>
              {isPositive ? "+" : "-"}${Math.abs(priceChange).toFixed(2)} ({Math.abs(percentChange).toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Last Update */}
        <div className="text-sm text-muted-foreground">
          Updated: {lastUpdate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'CET',
            timeZoneName: 'short'
          })}
        </div>
      </div>
    </Card>
  );
}