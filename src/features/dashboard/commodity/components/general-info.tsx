import { Card } from "@/components/ui/card";
import { Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommodityDetails } from "@/lib/types";
import { PriceRangeSlider } from "@/components/ui/price-range-slider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Basic Info and Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Basic Info */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {commodity.displayName}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm px-2 py-0.5 bg-neutral-100 rounded-md font-medium">
                {commodity.marketCode}
              </span>
              <span className="text-sm text-muted-foreground">
                {commodity.exchange}
              </span>
            </div>
          </div>

          {/* Price and Volume Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current Price */}
            <Card className="bg-gradient-to-br from-teal-50 to-emerald-50/50 border-teal-100">
              <div className="p-4">
                <div className="text-sm font-medium text-teal-600">Current Price</div>
                <div className="text-2xl font-bold text-teal-700 mt-1">
                  €{commodity.currentPrice.toFixed(2)}
                </div>
                <div className={cn(
                  "text-sm font-medium mt-1",
                  commodity.percentChange >= 0 ? "text-emerald-600" : "text-red-600"
                )}>
                  {commodity.percentChange >= 0 ? '+' : ''}{commodity.percentChange.toFixed(1)}% from last {timeframeText}
                </div>
              </div>
            </Card>

            {/* Volume */}
            <Card className="bg-neutral-50 border-neutral-200">
              <div className="p-4">
                <div className="text-sm font-medium text-neutral-600">Volume</div>
                <div className="text-2xl font-bold text-neutral-900 mt-1">
                  46.53K
                </div>
                <div className="text-sm font-medium text-emerald-600 mt-1">
                  +5.3% from last {timeframeText}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Additional Information */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <div className="p-4">
              <h3 className="text-sm font-medium mb-4">Additional Information</h3>
              
              {/* Trading Hours */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">Trading Hours</div>
                    <div className="text-sm font-medium mt-1">
                      {commodity.tradingHours.start} – {commodity.tradingHours.end}
                      <span className="text-xs text-neutral-500 block mt-0.5">
                        {commodity.tradingHours.timezone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Months */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">Delivery Months</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {commodity.deliveryMonths.map((month) => (
                        <span 
                          key={month}
                          className="inline-flex items-center rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-700/10"
                        >
                          {month}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Price Ranges */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical Range */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-medium">{timeframeText} Historical Range</h3>
              <p className="text-xs text-muted-foreground mt-1">Historical price movement</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  More Info
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Historical Range</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>Understanding historical price movements</div>
                  <div>
                    The historical range shows the actual price movements over the selected time period. This helps you understand:
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Price volatility and trends</li>
                    <li>Support and resistance levels</li>
                    <li>Market behavior patterns</li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <PriceRangeSlider 
            range={commodity.weekRange}
            className="bg-teal-100"
            dotClassName="bg-teal-600"
          />
        </Card>

        {/* Forecasted Range */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-medium">{timeframeText} Forecasted Range</h3>
              <p className="text-xs text-muted-foreground mt-1">Expected price movement</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  More Info
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Forecasted Range</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>Understanding price predictions</div>
                  <div>
                    The forecasted range represents our AI model's price predictions for the selected time period. This includes:
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Expected price range</li>
                    <li>Confidence intervals</li>
                    <li>Market trend indicators</li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <PriceRangeSlider 
            range={commodity.forecastedRange}
            className="bg-emerald-100"
            dotClassName="bg-emerald-600"
          />
        </Card>
      </div>
    </Card>
  );
}