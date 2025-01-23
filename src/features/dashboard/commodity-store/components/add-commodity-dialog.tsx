import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface AddCommodityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commodityId: string;
  commodityName: string;
}

export function AddCommodityDialog({
  open,
  onOpenChange,
  commodityId,
  commodityName,
}: AddCommodityDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddCommodity = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // First check if commodity is already in portfolio
      const { data: existing } = await supabase
        .from('commodity_portfolio')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('commodity_id', commodityId)
        .maybeSingle();

      if (existing) {
        if (existing.status === 'active') {
          toast({
            title: "Already in Portfolio",
            description: `${commodityName} is already in your portfolio.`,
            variant: "destructive",
          });
          onOpenChange(false);
          navigate(`/dashboard/${commodityName.toLowerCase()}`);
          return;
        } else {
          // If inactive, reactivate it
          const { error: updateError } = await supabase
            .from('commodity_portfolio')
            .update({ 
              status: 'active', 
              added_at: new Date().toISOString(),
              last_viewed_at: new Date().toISOString()
            })
            .eq('id', existing.id);

          if (updateError) throw updateError;
        }
      } else {
        // Add new entry to portfolio
        const { error: insertError } = await supabase
          .from('commodity_portfolio')
          .insert({
            user_id: user.id,
            commodity_id: commodityId,
            status: 'active',
            last_viewed_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: `${commodityName} has been added to your portfolio.`,
      });

      // Close dialog and navigate to the commodity page
      onOpenChange(false);
      navigate(`/dashboard/${commodityName.toLowerCase()}`);
    } catch (error: any) {
      console.error('Error adding commodity:', error);
      toast({
        title: "Error",
        description: "Failed to add commodity to portfolio. Please try again.",
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
          <DialogTitle>Add {commodityName} to Portfolio</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4">
              <div>Adding {commodityName} to your portfolio will enable:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time price forecasting</li>
                <li>Market trend analysis</li>
                <li>Custom alerts and notifications</li>
              </ul>
              <div className="text-sm text-muted-foreground">
                Subscription cost: €99/month
                <br />
                You can cancel anytime. Changes take effect at the start of your next billing cycle.
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddCommodity}
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add to Portfolio'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}