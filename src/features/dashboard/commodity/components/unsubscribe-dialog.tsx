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
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface UnsubscribeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commodityName: string;
  commodityId: string;
  onConfirm: () => Promise<void>;
}

export function UnsubscribeDialog({
  open,
  onOpenChange,
  commodityName,
  commodityId,
  onConfirm,
}: UnsubscribeDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      await onConfirm();
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

export default UnsubscribeDialog;