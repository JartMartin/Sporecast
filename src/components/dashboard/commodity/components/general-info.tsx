import { Card } from "@/components/ui/card";
import { Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommodityDetails } from "@/lib/types";

interface GeneralInfoProps {
  commodity: CommodityDetails;
}

export function GeneralInfo({ commodity }: GeneralInfoProps) {
  const formatPrice = (price: number) => `€${price.toFixed(2)}`;
  const formatPercentage = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Title and Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Name and Exchange */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold">{commodity.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm px-2 py-0.5 bg-neutral-100 rounded-md font-medium">
                {commodity.marketCode}
              </span>
              <span className="text-sm text-muted-foreground">
                {commodity.exchange}
              </span>
            </div>
          </div>

          {/* Current Price */}
          <PriceCard 
            price={commodity.currentPrice}
            change={commodity.priceChange}
            percentChange={commodity.percentChange}
          />
        </div>

        {/* Price Ranges and Trading Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TradingHoursCard hours={commodity.tradingHours} />
          <PriceRangesCard 
            weekRange={commodity.weekRange}
            forecastedRange={commodity.forecastedRange}
          />
        </div>
      </div>
    </Card>
  );
}

// Extract reusable sub-components
function PriceCard({ price, change, percentChange }: { 
  price: number;
  change: number;
  percentChange: number;
}) {
  const formatPrice = (p: number) => `€${p.toFixed(2)}`;
  const formatPercentage = (p: number) => `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`;

  return (
    <Card className="p-4 bg-teal-50/50 border-teal-100">
      <div className="text-sm font-medium text-teal-600 mb-1">Current Price</div>
      <div className="text-2xl font-bold text-teal-700">{formatPrice(price)}</div>
      <div className={cn(
        "text-sm font-medium mt-1",
        percentChange >= 0 ? "text-emerald-600" : "text-red-600"
      )}>
        {formatPrice(change)} ({formatPercentage(percentChange)})
      </div>
    </Card>
  );
}

function TradingHoursCard({ hours }: { hours: TradingHours }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center">
          <Clock className="h-4 w-4 text-teal-600" />
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">
            Trading Hours ({hours.timezone})
          </div>
          <div className="text-lg font-semibold mt-1">
            {hours.start} - {hours.end}
          </div>
        </div>
      </div>
    </Card>
  );
}

function PriceRangesCard({ weekRange, forecastedRange }: {
  weekRange: PriceRange;
  forecastedRange: PriceRange;
}) {
  const formatPrice = (p: number) => `€${p.toFixed(2)}`;
  
  return (
    <Card className="p-4 space-y-6">
      <RangeHeader />
      <PriceRangeSlider 
        range={weekRange}
        className="bg-teal-100"
        dotClassName="bg-teal-600"
      />
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">
          Forecasted Range
        </div>
        <PriceRangeSlider 
          range={forecastedRange}
          className="bg-emerald-100"
          dotClassName="bg-emerald-600"
        />
      </div>
    </Card>
  );
}

// Further component extraction omitted for brevity