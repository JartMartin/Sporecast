import { Card } from "@/components/ui/card";
import { WheatPlotlyChart } from "./wheat-plotly-chart";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";

interface ForecastOverviewProps {
  horizon: string;
  volatilityIndex: number;
  volatilityChange: number;
  trendIndex: number;
  trendChange: number;
  expectedPrice: number;
  currentPrice: number;
  onSetAlert: () => void;
}

export function ForecastOverview({
  horizon,
  volatilityIndex,
  volatilityChange,
  trendIndex,
  trendChange,
  expectedPrice,
  currentPrice,
  onSetAlert,
}: ForecastOverviewProps) {
  const [viewMode, setViewMode] = useState<'actual' | 'forecasted'>('actual');
  const priceChange = ((expectedPrice - currentPrice) / currentPrice) * 100;
  const formattedHorizon = horizon.charAt(0).toUpperCase() + horizon.slice(1);

  // Helper function to get gradient colors based on value
  const getGradientColors = (value: number) => {
    if (value <= 0.33) return { bg: 'bg-emerald-100', dot: 'bg-emerald-500' };
    if (value <= 0.66) return { bg: 'bg-amber-100', dot: 'bg-amber-500' };
    return { bg: 'bg-red-100', dot: 'bg-red-500' };
  };

  const trendColors = getGradientColors(trendIndex / 5);
  const volatilityColors = getGradientColors(volatilityIndex / 100);

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Forecast Overview</h2>
          <p className="text-sm text-muted-foreground">
            Real-time price predictions and market insights for {horizon} horizon
          </p>
        </div>
      </div>

      <Card className="p-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Expected Price Card */}
          <div className="flex flex-col items-center justify-center h-[140px] border rounded-lg p-4">
            <p className="text-sm text-muted-foreground text-center mb-2">
              Expected Price
              <br />
              <span className="text-xs">(End of this {formattedHorizon})</span>
            </p>
            <p className="text-2xl font-semibold text-emerald-600 mb-1">
              €{expectedPrice.toFixed(2)}
            </p>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-sm font-medium ${
                  priceChange >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {priceChange >= 0 ? "+" : ""}
                {priceChange.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">
                vs current
              </span>
            </div>
          </div>

          {/* Market Indicators */}
          <div className="md:col-span-2 grid grid-cols-2 gap-6">
            {/* Trend Index */}
            <div className="space-y-4 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-600">Trend Index</span>
                <span className="text-sm text-neutral-600">
                  {trendChange >= 0 ? "+" : ""}{trendChange}% vs last {horizon}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Strong ↓</span>
                  <span>Neutral</span>
                  <span>Strong ↑</span>
                </div>
                <div className="relative h-2 bg-neutral-100 rounded-full">
                  <div 
                    className={`absolute h-4 w-4 top-1/2 -translate-y-1/2 ${trendColors.dot} rounded-full border-2 border-white shadow-sm`}
                    style={{ left: `${trendIndex * 20}%` }}
                  />
                  <div 
                    className={`absolute inset-y-0 left-0 ${trendColors.bg} rounded-full`}
                    style={{ width: `${trendIndex * 20}%` }}
                  />
                </div>
                <div className="text-center text-xs font-medium text-neutral-700 mt-2">
                  Current: {(trendIndex * 20).toFixed(0)}
                </div>
              </div>
            </div>

            {/* Volatility Index */}
            <div className="space-y-4 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-600">Volatility Index</span>
                <span className="text-sm text-neutral-600">
                  {volatilityChange >= 0 ? "+" : ""}{volatilityChange}% vs last {horizon}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                </div>
                <div className="relative h-2 bg-neutral-100 rounded-full">
                  <div 
                    className={`absolute h-4 w-4 top-1/2 -translate-y-1/2 ${volatilityColors.dot} rounded-full border-2 border-white shadow-sm`}
                    style={{ left: `${volatilityIndex}%` }}
                  />
                  <div 
                    className={`absolute inset-y-0 left-0 ${volatilityColors.bg} rounded-full`}
                    style={{ width: `${volatilityIndex}%` }}
                  />
                </div>
                <div className="text-center text-xs font-medium text-neutral-700 mt-2">
                  Current: {volatilityIndex}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Historical and Forecasted Price</h3>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    More Info
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Historical and Forecasted Price</DialogTitle>
                    <DialogDescription>
                      Understanding price trends and forecast confidence intervals
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 pt-4">
                    <div>
                      <h4 className="font-medium mb-2">Historical Price</h4>
                      <p className="text-sm text-muted-foreground">
                        Shows actual recorded prices up to the current date. This solid line represents verified market data and serves as the foundation for our forecasting models.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Forecasted Price</h4>
                      <p className="text-sm text-muted-foreground">
                        The dotted line represents our AI-powered price predictions. These forecasts are generated using advanced machine learning models that analyze multiple market factors and historical patterns.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Confidence Range</h4>
                      <p className="text-sm text-muted-foreground">
                        The shaded area around the forecast line represents the 90% confidence interval. This means we expect the actual price to fall within this range with 90% probability, based on our model's analysis.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2"
                onClick={onSetAlert}
              >
                <Bell className="h-4 w-4" />
                Set Alert
              </Button>
            </div>
          </div>
          <div className="aspect-[21/9]">
            <WheatPlotlyChart
              timeHorizon={horizon}
              className="[&_.main-svg]:border-0 w-full h-full"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}