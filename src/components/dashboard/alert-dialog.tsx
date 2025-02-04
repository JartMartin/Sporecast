import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAlerts } from "@/hooks/use-alerts";
import { Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commodityId: string;
  commodityName: string;
  currentPrice: number;
}

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
  const [changePercentage, setChangePercentage] = useState("5");
  const [changeDirection, setChangeDirection] = useState<"increase" | "decrease">("increase");
  const [loading, setLoading] = useState(false);
  const { createAlert } = useAlerts();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSetAlert = async () => {
    setLoading(true);
    try {
      if (alertTab === "threshold") {
        // Direct threshold alert
        await createAlert(commodityId, {
          type: alertType,
          threshold: parseFloat(alertPrice),
          is_active: true,
          email_notifications: false
        });
      } else {
        // Calculate threshold based on percentage change
        const basePrice = currentPrice;
        const changeMultiplier = changeDirection === 'increase' ? 1 : -1;
        const threshold = basePrice * (1 + (changeMultiplier * parseFloat(changePercentage) / 100));

        await createAlert(commodityId, {
          type: changeDirection === 'increase' ? 'price_above' : 'price_below',
          threshold,
          is_active: true,
          email_notifications: false
        });
      }

      toast({
        title: "Alert Created",
        description: "Your price alert has been set successfully.",
      });

      onOpenChange(false);
      navigate('/dashboard/alerts');
    } catch (error: any) {
      console.error('Error setting alert:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create alert. Please try again.",
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
          <DialogTitle>Set Price Alert for {commodityName}</DialogTitle>
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
            {/* Tab-specific content */}
            <TabsContent value="threshold" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Alert Type</Label>
                <RadioGroup
                  value={alertType}
                  onValueChange={(value) => setAlertType(value as 'price_above' | 'price_below')}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price_above" id="price_above" />
                    <Label htmlFor="price_above">Price Above</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price_below" id="price_below" />
                    <Label htmlFor="price_below">Price Below</Label>
                  </div>
                </RadioGroup>
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
                  Current price: €{currentPrice.toFixed(2)}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="change" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Change Direction</Label>
                <RadioGroup
                  value={changeDirection}
                  onValueChange={(value) => setChangeDirection(value as "increase" | "decrease")}
                  className="flex flex-col gap-2"
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
                <p className="text-sm text-muted-foreground">
                  Alert will trigger when price {changeDirection}s by {changePercentage}%
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSetAlert}
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting...
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