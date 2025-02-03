import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commodityId: string;
  commodityName: string;
  currentPrice: number;
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

export function AlertDialog({
  open,
  onOpenChange,
  commodityId,
  commodityName,
  currentPrice,
}: AlertDialogProps) {
  const [alertTab, setAlertTab] = useState<"threshold" | "change">("threshold");
  const [alertType, setAlertType] = useState<'price_above' | 'price_below'>('price_above');
  const [alertPrice, setAlertPrice] = useState(currentPrice.toString());
  const [timeframe, setTimeframe] = useState(timeframes[0].value);
  const [changePeriod, setChangePeriod] = useState(changePeriods[0].value);
  const [changePercentage, setChangePercentage] = useState("5");
  const [changeDirection, setChangeDirection] = useState<"increase" | "decrease">("increase");
  const [priceType, setPriceType] = useState<"actual" | "forecasted">("actual");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    const basePrice = priceType === "actual" ? currentPrice : currentPrice * 1.1; // Example forecasted price

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

  const handleSetAlert = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const alertData = alertTab === "threshold" 
        ? {
            user_id: user.id,
            commodity_id: commodityId,
            type: alertType,
            threshold: parseFloat(alertPrice),
            is_active: true
          }
        : {
            user_id: user.id,
            commodity_id: commodityId,
            type: changeDirection === 'increase' ? 'price_above' : 'price_below',
            threshold: currentPrice * (1 + (parseFloat(changePercentage) * (changeDirection === 'increase' ? 1 : -1) / 100)),
            is_active: true
          };

      const { error } = await supabase
        .from('commodity_alerts')
        .insert(alertData);

      if (error) throw error;

      toast({
        title: "Alert Set Successfully",
        description: "You will be notified when the conditions are met.",
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error('Error setting alert:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  Current {priceType} price: €{(priceType === "actual" ? currentPrice : currentPrice * 1.1).toFixed(2)}
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

            {/* Dynamic Alert Summary */}
            {getAlertSummary()}
          </div>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSetAlert} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting Alert...
              </>
            ) : (
              'Set Alert'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}