import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WheatPlotlyChart } from "./wheat-plotly-chart";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

const periodOptions = [
  { value: "last_quarter", label: "Last 12 weeks" },
  { value: "last_year_quarter", label: "Last 12 weeks last Year" },
  { value: "five_year_avg", label: "Last 12 weeks average last 5 years" },
] as const;

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
  const [lastForecastPrice, setLastForecastPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastForecastPrice = async () => {
      try {
        // Get wheat commodity ID first
        const { data: wheat, error: wheatError } = await supabase
          .from('commodities')
          .select('id')
          .eq('symbol', 'WHEAT')
          .single();

        if (wheatError) throw wheatError;

        // Get the last forecasted price from wheat_metrics_12w
        const { data: metrics, error: metricsError } = await supabase
          .from('wheat_metrics_12w')
          .select('actual_price')
          .eq('commodity_id', wheat.id)
          .eq('horizon', '12w')
          .order('date', { ascending: false })
          .limit(1);

        if (metricsError) throw metricsError;

        if (metrics && metrics.length > 0) {
          setLastForecastPrice(metrics[0].actual_price);
        }
      } catch (error) {
        console.error('Error fetching last forecast price:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLastForecastPrice();
  }, []);

  // Use the fetched price or fall back to the prop
  const actualPrice = lastForecastPrice || currentPrice;
  const priceChange = ((expectedPrice - actualPrice) / actualPrice) * 100;

  // Helper function to format horizon text
  const getHorizonText = (horizon: string) => {
    switch (horizon) {
      case "1w": return "next 1 week";
      case "4w": return "next 4 weeks";
      case "12w": return "next 12 weeks";
      case "26w": return "next 26 weeks";
      case "52w": return "next 52 weeks";
      default: return horizon;
    }
  };

  // Helper function to get comparison text
  const getComparisonText = (horizon: string) => {
    switch (horizon) {
      case "1w": return "last 1 week";
      case "4w": return "last 4 weeks";
      case "12w": return "last 12 weeks";
      case "26w": return "last 26 weeks";
      case "52w": return "last 52 weeks";
      default: return horizon;
    }
  };

  const formattedHorizon = getHorizonText(horizon);
  const comparisonText = getComparisonText(horizon);

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
          <div className="space-y-4 border rounded-lg p-4">
            {/* Title */}
            <div className="text-sm font-medium text-neutral-600">
              Expected Price
              <br />
              <span className="text-xs">(End of {formattedHorizon})</span>
            </div>

            {/* Main Content */}
            <div className="h-[52px] flex items-center justify-center">
              <div className="text-2xl font-semibold">
                €{expectedPrice.toFixed(2)}
              </div>
            </div>

            {/* Explanatory Text */}
            <div className="text-center text-xs font-medium text-neutral-600">
              {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(1)}% vs {comparisonText}
            </div>
          </div>

          {/* Trend Index Card */}
          <div className="space-y-4 border rounded-lg p-4">
            {/* Title */}
            <div className="text-sm font-medium text-neutral-600">
              Trend Index
            </div>

            {/* Main Content */}
            <div className="h-[52px] flex flex-col justify-center space-y-1">
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
            </div>

            {/* Explanatory Text */}
            <div className="text-center text-xs font-medium text-neutral-600">
              {trendChange >= 0 ? "+" : ""}{trendChange}% vs {comparisonText}
            </div>
          </div>

          {/* Volatility Index Card */}
          <div className="space-y-4 border rounded-lg p-4">
            {/* Title */}
            <div className="text-sm font-medium text-neutral-600">
              Volatility Index
            </div>

            {/* Main Content */}
            <div className="h-[52px] flex flex-col justify-center space-y-1">
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
            </div>

            {/* Explanatory Text */}
            <div className="text-center text-xs font-medium text-neutral-600">
              {volatilityChange >= 0 ? "+" : ""}{volatilityChange}% vs {comparisonText}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Historical and Forecasted Price</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2"
                onClick={onSetAlert}
              >
                <Bell className="h-4 w-4" />
                Set Alert
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    More Info
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Understanding Price Forecasts</DialogTitle>
                    <DialogDescription>
                      How to interpret our price forecasts and confidence intervals
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Historical Price</h4>
                      <p className="text-sm text-muted-foreground">
                        Shows actual recorded prices up to the current date. This solid line represents verified market data.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Forecasted Price</h4>
                      <p className="text-sm text-muted-foreground">
                        The dotted line represents our AI-powered price predictions, based on current market conditions and historical patterns.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Confidence Range</h4>
                      <p className="text-sm text-muted-foreground">
                        The shaded area shows the 90% confidence interval - we expect the actual price to fall within this range with 90% probability.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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