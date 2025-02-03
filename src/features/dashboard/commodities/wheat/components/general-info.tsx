import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CommodityDetails } from "@/lib/types";
import { PriceCard } from "./general-info/price-card";
import { VolumeCard } from "./general-info/volume-card";
import { TradingInfo } from "./general-info/trading-info";
import { PriceRange } from "./general-info/price-range";

interface GeneralInfoProps {
  commodity: CommodityDetails;
  selectedTimeframe: string;
}

export function GeneralInfo({ commodity, selectedTimeframe }: GeneralInfoProps) {
  // Helper function to format timeframe text
  const getTimeframeText = (timeframe: string) => {
    switch (timeframe) {
      case "1w": return "week";
      case "4w": return "4 weeks";
      case "12w": return "12 weeks";
      case "26w": return "26 weeks";
      case "52w": return "52 weeks";
      default: return timeframe;
    }
  };

  const timeframeText = getTimeframeText(selectedTimeframe);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Market Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Left Column: Price and Volume */}
          <div className="grid grid-cols-2 gap-6">
            <PriceCard
              price={commodity.currentPrice}
              change={commodity.percentChange}
              timeframe={timeframeText}
              exchange={commodity.exchange}
            />
            <VolumeCard
              amount={commodity.volume.amount}
              unit={commodity.volume.unit}
              change={commodity.volume.change}
              timeframe={timeframeText}
            />
          </div>

          {/* Right Column: Trading Info */}
          <TradingInfo
            tradingHours={commodity.tradingHours}
            deliveryMonths={commodity.deliveryMonths}
          />
        </div>

        <Separator />

        {/* Price Ranges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PriceRange
            type="historical"
            timeframe={timeframeText}
            range={commodity.weekRange}
          />
          <PriceRange
            type="forecasted"
            timeframe={timeframeText}
            range={commodity.forecastedRange}
          />
        </div>
      </div>
    </Card>
  );
}