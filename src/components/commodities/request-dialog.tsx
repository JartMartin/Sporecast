import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const exchanges = [
  { value: "cme", label: "Chicago Mercantile Exchange (CME)" },
  { value: "euronext", label: "Euronext" },
  { value: "ice", label: "Intercontinental Exchange (ICE)" },
];

interface RequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestDialog({ open, onOpenChange }: RequestDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    commodityName: "",
    marketCode: "",
    exchange: "",
    details: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Request Submitted",
        description: "Thank you! Your commodity request has been submitted and is under review.",
      });

      // Reset form and close dialog
      setFormData({
        commodityName: "",
        marketCode: "",
        exchange: "",
        details: ""
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a New Commodity</DialogTitle>
          <DialogDescription>
            Fill out the form below to request a new commodity for the platform.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="commodity-name">Commodity Name *</Label>
            <Input
              id="commodity-name"
              placeholder="Enter commodity name"
              value={formData.commodityName}
              onChange={(e) => setFormData(prev => ({ ...prev, commodityName: e.target.value }))}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="market-code">Market Code *</Label>
            <Input
              id="market-code"
              placeholder="e.g., ZW for Wheat"
              value={formData.marketCode}
              onChange={(e) => setFormData(prev => ({ ...prev, marketCode: e.target.value }))}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exchange">Exchange *</Label>
            <Select
              value={formData.exchange}
              onValueChange={(value) => setFormData(prev => ({ ...prev, exchange: value }))}
              required
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an exchange" />
              </SelectTrigger>
              <SelectContent>
                {exchanges.map((exchange) => (
                  <SelectItem key={exchange.value} value={exchange.value}>
                    {exchange.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">Additional Details</Label>
            <Textarea
              id="details"
              placeholder="Any specific requirements or information..."
              className="min-h-[100px]"
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              disabled={loading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}