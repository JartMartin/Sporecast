import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CommodityDetails } from "@/lib/types";
import { TrendingUp, Clock, Calendar, Download } from "lucide-react";

interface CommodityOverviewProps {
  commodity: CommodityDetails;
  selectedTimeframe: string;
  onDownload?: () => void;
}

export function CommodityOverview({ commodity, selectedTimeframe, onDownload }: CommodityOverviewProps) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{commodity.displayName}</h1>
          <p className="text-muted-foreground">Real-time price predictions and market insights</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={onDownload}>
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      <Card className="p-6">
        <div className="grid gap-8">
          {/* Market Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-6">
            {/* Current Price */}
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <TrendingUp className="h-4 w-4" />
                Current Price
              </div>
              <div className="text-2xl font-bold">€{commodity.currentPrice.toFixed(2)}</div>
              <div className={cn(
                "text-sm font-medium mt-1",
                commodity.percentChange >= 0 ? "text-emerald-600" : "text-red-600"
              )}>
                {commodity.percentChange >= 0 ? '+' : ''}{commodity.percentChange.toFixed(1)}% from last {timeframeText}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{commodity.exchange}</div>
            </div>

            {/* Volume */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">Volume</div>
              <div className="text-2xl font-bold">{commodity.volume.amount}{commodity.volume.unit} tons</div>
              <div className="text-sm text-emerald-600 font-medium mt-1">
                +{commodity.volume.change}% from last {timeframeText}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              {/* Trading Hours */}
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Trading Hours</p>
                    <p className="text-sm text-muted-foreground">
                      {commodity.tradingHours.start} – {commodity.tradingHours.end} {commodity.tradingHours.timezone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Months */}
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Delivery Months</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {commodity.deliveryMonths.map((month) => (
                        <div 
                          key={month} 
                          className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600"
                        >
                          {month}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Ranges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Historical Range */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{timeframeText} Historical Range</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Historical price movement</p>
                </div>
                <Button variant="outline" size="sm">More Info</Button>
              </div>
              <div className="relative pt-2">
                <div className="h-2 bg-neutral-100 rounded-full" />
                <div 
                  className="absolute top-2 h-2 bg-black rounded-full" 
                  style={{ 
                    width: `${((commodity.weekRange.current - commodity.weekRange.low) / 
                      (commodity.weekRange.high - commodity.weekRange.low)) * 100}%`,
                    left: "0%" 
                  }} 
                />
                <div
                  className="absolute top-0 w-4 h-4 bg-black rounded-full -mt-1 border-2 border-white"
                  style={{ 
                    left: `${((commodity.weekRange.current - commodity.weekRange.low) / 
                      (commodity.weekRange.high - commodity.weekRange.low)) * 100}%` 
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-4">
                  <span>€{commodity.weekRange.low.toFixed(2)}</span>
                  <span>Current: €{commodity.weekRange.current.toFixed(2)}</span>
                  <span>€{commodity.weekRange.high.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Forecasted Range */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{timeframeText} Forecasted Range</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Expected price movement</p>
                </div>
                <Button variant="outline" size="sm">More Info</Button>
              </div>
              <div className="relative pt-2">
                <div className="h-2 bg-neutral-100 rounded-full" />
                <div 
                  className="absolute top-2 h-2 bg-black rounded-full" 
                  style={{ 
                    width: `${((commodity.forecastedRange.current - commodity.forecastedRange.low) / 
                      (commodity.forecastedRange.high - commodity.forecastedRange.low)) * 100}%`,
                    left: "0%" 
                  }} 
                />
                <div
                  className="absolute top-0 w-4 h-4 bg-black rounded-full -mt-1 border-2 border-white"
                  style={{ 
                    left: `${((commodity.forecastedRange.current - commodity.forecastedRange.low) / 
                      (commodity.forecastedRange.high - commodity.forecastedRange.low)) * 100}%` 
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-4">
                  <span>€{commodity.forecastedRange.low.toFixed(2)}</span>
                  <span>Current: €{commodity.forecastedRange.current.toFixed(2)}</span>
                  <span>€{commodity.forecastedRange.high.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}