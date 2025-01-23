import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, Bell, ArrowRight } from "lucide-react";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commodityId: string;
  commodityName: string;
  currentPrice: number;
}

const timeframes = [
  { value: "1w", label: "1 Week" },
  { value: "1m", label: "1 Month" },
  { value: "3m", label: "1 Quarter" },
] as const;

type Timeframe = typeof timeframes[number]['value'];

type PriceType = "actual" | "forecasted";
type Direction = "above" | "below";

export function AlertDialog({
  open,
  onOpenChange,
  commodityId,
  commodityName,
  currentPrice,
}: AlertDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    priceType: "actual" as PriceType,
    timeframe: "1m" as Timeframe,
    direction: "above" as Direction,
    threshold: currentPrice.toString(),
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('commodity_alerts')
        .insert({
          user_id: user.id,
          commodity_id: commodityId,
          type: `${formData.priceType}_price_${formData.direction}`,
          threshold: parseFloat(formData.threshold),
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Alert Created",
        description: `You'll be notified when the ${formData.priceType} price of ${commodityName} goes ${formData.direction} €${formData.threshold}.`,
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isValid = 
    formData.timeframe && 
    formData.direction && 
    formData.threshold && 
    !isNaN(parseFloat(formData.threshold));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-teal-50 flex items-center justify-center">
              <Bell className="h-4 w-4 text-teal-600" />
            </div>
            Create Price Alert
          </DialogTitle>
          <DialogDescription>
            Set up a price alert for {commodityName} using the interactive sentence below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Interactive Sentence UI */}
          <div className="relative rounded-xl border bg-gradient-to-b from-neutral-50/80 to-white p-10">
            {/* Visual Flow Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 rounded-full bg-gradient-to-b from-teal-500/20 to-emerald-500/20" />

            {/* Sentence Structure */}
            <div className="pl-4">
              <div className="flex items-center gap-6 flex-nowrap min-h-[48px] w-full">
                <span className="text-sm text-neutral-600 whitespace-nowrap">Notify me when the</span>
                
                <Select
                  value={formData.priceType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priceType: value as PriceType }))}
                >
                  <SelectTrigger className="w-[160px] border-dashed">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actual">actual price</SelectItem>
                    <SelectItem value="forecasted">forecasted price</SelectItem>
                  </SelectContent>
                </Select>

                <span className="whitespace-nowrap">of</span>
                <span className="font-medium text-neutral-900 whitespace-nowrap">{commodityName}</span>

                <Select
                  value={formData.direction}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, direction: value as Direction }))}
                >
                  <SelectTrigger className="w-[150px] border-dashed">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">rises above</SelectItem>
                    <SelectItem value="below">falls below</SelectItem>
                  </SelectContent>
                </Select>

                <span className="whitespace-nowrap">€</span>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.threshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
                  className="w-[140px] border-dashed"
                  required
                />

                <span className="whitespace-nowrap">within</span>
                <Select
                  value={formData.timeframe}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, timeframe: value as Timeframe }))}
                >
                  <SelectTrigger className="w-[150px] border-dashed">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map((timeframe) => (
                      <SelectItem key={timeframe.value} value={timeframe.value}>
                        {timeframe.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Current Price Reference */}
          <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-2">
            <span className="text-sm text-neutral-600">Current price</span>
            <span className="font-medium text-neutral-900">€{currentPrice}</span>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading || !isValid}
              className="min-w-[140px] gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Alert
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}