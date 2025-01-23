import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface UnsubscribeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commodityName: string;
  commodityId: string;
}

export function UnsubscribeDialog({
  open,
  onOpenChange,
  commodityName,
  commodityId,
}: UnsubscribeDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update the commodity status to inactive
      const { error } = await supabase
        .from('commodity_portfolio')
        .update({ status: 'inactive' })
        .eq('commodity_id', commodityId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Close dialog first to prevent any state updates on unmounted components
      onOpenChange(false);

      // Show success message
      toast({
        title: "Successfully Unsubscribed",
        description: `${commodityName} has been removed from your portfolio.`,
      });

      // Navigate to dashboard with replace to prevent going back to the unsubscribed commodity
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Unsubscribe error:', error);
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to unsubscribe from {commodityName}?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <div>
                If you unsubscribe from this commodity, it will be immediately removed from your portfolio and dashboard.
                Your subscription cost will decrease by €99 per month starting from your next billing cycle.
              </div>
              <div className="font-medium text-destructive">
                Any historical data or custom settings for this commodity will no longer be accessible.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUnsubscribe}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Unsubscribing...
              </>
            ) : (
              'Unsubscribe'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}