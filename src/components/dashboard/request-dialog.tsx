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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenChange(false);
    toast({
      title: "Request Submitted",
      description: "Thank you! Your request has been submitted and is under review.",
    });
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
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="market-code">Market Code *</Label>
            <Input
              id="market-code"
              placeholder="e.g., ZW for Wheat"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exchange">Exchange *</Label>
            <Select required>
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
            />
          </div>
          <Button type="submit" className="w-full">Submit Request</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}