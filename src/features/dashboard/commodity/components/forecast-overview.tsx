import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { WheatPlotlyChart } from "./wheat-plotly-chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

type AlertTimeframe = {
  value: string;
  label: string;
};

type AlertPeriod = {
  value: string;
  label: string;
};

const timeframes: AlertTimeframe[] = [
  { value: "1w", label: "1 Week" },
  { value: "2w", label: "2 Weeks" },
  { value: "4w", label: "4 Weeks" },
  { value: "12w", label: "12 Weeks" },
  { value: "26w", label: "26 Weeks" },
  { value: "52w", label: "52 Weeks" },
];

const changePeriods: AlertPeriod[] = [
  { value: "1d", label: "1 Day" },
  { value: "2d", label: "2 Days" },
  { value: "5d", label: "5 Days" },
  { value: "10d", label: "10 Days" },
  { value: "30d", label: "30 Days" },
  { value: "60d", label: "60 Days" },
];

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
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertType, setAlertType] = useState<'price_above' | 'price_below'>('price_above');
  const [alertPrice, setAlertPrice] = useState(currentPrice.toString());
  const [alertTab, setAlertTab] = useState<"threshold" | "change">("threshold");
  const [timeframe, setTimeframe] = useState(timeframes[0].value);
  const [changePeriod, setChangePeriod] = useState(changePeriods[0].value);
  const [changePercentage, setChangePercentage] = useState("5");
  const [changeDirection, setChangeDirection] = useState<"increase" | "decrease">("increase");
  const [priceType, setPriceType] = useState<"actual" | "forecasted">("actual");

  // Helper function to get timeframe label
  const getTimeframeLabel = (value: string) => {
    return timeframes.find(tf => tf.value === value)?.label || value;
  };

  // Helper function to get period label
  const getChangePeriodLabel = (value: string) => {
    return changePeriods.find(p => p.value === value)?.label || value;
  };

  // Generate alert summary text
  const getAlertSummary = () => {
    const priceTypeText = priceType === "actual" ? "actual" : "forecasted";
    const basePrice = priceType === "actual" ? currentPrice : expectedPrice;

    if (alertTab === "threshold") {
      return (
        <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
          Alert: If in the upcoming <span className="font-medium">{getTimeframeLabel(timeframe)}</span>, 
          the <span className="font-medium">{priceTypeText} price</span> {alertType === 'price_above' ? 'rises above' : 'falls below'} <span className="font-medium">€{alertPrice}</span> 
          (current {priceTypeText} price: €{basePrice.toFixed(2)}).
        </p>
      );
    } else {
      return (
        <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
          Alert: If in the upcoming <span className="font-medium">{getTimeframeLabel(timeframe)}</span>, 
          the <span className="font-medium">{priceTypeText} price</span> {changeDirection === 'increase' ? 'increases' : 'decreases'} by <span className="font-medium">{changePercentage}%</span> 
          within <span className="font-medium">{getChangePeriodLabel(changePeriod)}</span>.
        </p>
      );
    }
  };

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

  const handleSetAlert = () => {
    const alertData = alertTab === "threshold" 
      ? {
          type: "threshold",
          alertType,
          price: parseFloat(alertPrice),
          timeframe
        }
      : {
          type: "change",
          direction: changeDirection,
          percentage: parseFloat(changePercentage),
          timeframe,
          period: changePeriod
        };

    console.log('Setting alert:', alertData);
    setShowAlertDialog(false);
  };

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
        {/* More Info Button */}
        <div className="flex justify-end mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                More Info
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Understanding Our Metrics</DialogTitle>
                <DialogDescription>
                  Learn how we calculate and interpret our key market indicators
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Expected Price</h4>
                  <p className="text-sm text-muted-foreground">
                    Our AI model's predicted price at the end of the selected time horizon, based on current market conditions and historical patterns.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Trend Index</h4>
                  <p className="text-sm text-muted-foreground">
                    A measure of price momentum from 0 (strong downward trend) to 100 (strong upward trend), with 50 indicating a neutral trend.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Volatility Index</h4>
                  <p className="text-sm text-muted-foreground">
                    Indicates expected market volatility from 0 (very stable) to 100 (highly volatile), helping assess risk levels.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Expected Price Card */}
          <div className="space-y-4 border rounded-lg p-4">
            {/* Title */}
            <div className="text-sm font-medium text-neutral-600">
              Expected Price over {formattedHorizon}
            </div>

            {/* Main Content */}
            <div className="h-[52px] flex items-center justify-center">
              <div className="text-2xl font-semibold">
                €{expectedPrice.toFixed(2)}
              </div>
            </div>

            {/* Explanatory Text */}
            <div className="text-center text-xs font-medium text-neutral-600">
              {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(1)}% vs last {horizon}
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
              {trendChange >= 0 ? "+" : ""}{trendChange}% vs last {horizon}
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
              {volatilityChange >= 0 ? "+" : ""}{volatilityChange}% vs last {horizon}
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
                onClick={() => setShowAlertDialog(true)}
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

      {/* Enhanced Alert Dialog */}
      <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Set Price Alert</DialogTitle>
            <DialogDescription>
              Configure alerts based on price thresholds or price changes
            </DialogDescription>
          </DialogHeader>

          <Tabs value={alertTab} onValueChange={(value) => setAlertTab(value as "threshold" | "change")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="threshold">Price Threshold</TabsTrigger>
              <TabsTrigger value="change">Price Change</TabsTrigger>
            </TabsList>

            <div className="space-y-4 py-4">
              {/* Price Type Selection */}
              <div className="space-y-2">
                <Label>Price Type</Label>
                <RadioGroup
                  value={priceType}
                  onValueChange={(value) => setPriceType(value as "actual" | "forecasted")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="actual" id="actual" />
                    <Label htmlFor="actual">Actual Price</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="forecasted" id="forecasted" />
                    <Label htmlFor="forecasted">Forecasted Price</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Timeframe Selection */}
              <div className="space-y-2">
                <Label>Alert Timeframe</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map((tf) => (
                      <SelectItem key={tf.value} value={tf.value}>
                        {tf.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tab-specific content */}
              <TabsContent value="threshold" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Alert Type</Label>
                  <Select
                    value={alertType}
                    onValueChange={(value) => setAlertType(value as 'price_above' | 'price_below')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price_above">Price Above</SelectItem>
                      <SelectItem value="price_below">Price Below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Price Threshold (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-sm text-muted-foreground">
                    Current {priceType} price: €{(priceType === "actual" ? currentPrice : expectedPrice).toFixed(2)}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="change" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Change Direction</Label>
                  <RadioGroup
                    value={changeDirection}
                    onValueChange={(value) => setChangeDirection(value as "increase" | "decrease")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="increase" id="increase" />
                      <Label htmlFor="increase">Increase</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="decrease" id="decrease" />
                      <Label htmlFor="decrease">Decrease</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Percentage Change</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      step="0.1"
                      value={changePercentage}
                      onChange={(e) => setChangePercentage(e.target.value)}
                      className="font-mono"
                    />
                    <span className="text-sm font-medium">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Change Period</Label>
                  <Select value={changePeriod} onValueChange={setChangePeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {changePeriods.map((period) => (
                        <SelectItem key={period.value} value={period.value}>
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </div>

            {/* Dynamic Alert Summary */}
            {getAlertSummary()}
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAlertDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetAlert}>
              Set Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}