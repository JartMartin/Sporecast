import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { Bell, Trash2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  commodityName: string;
  type: "price_above" | "price_below";
  threshold: number;
  isActive: boolean;
  onDelete: () => void;
  approachingTrigger?: boolean;
  progressToTrigger?: number;
  emailNotifications?: boolean;
  onToggleEmailNotifications?: (enabled: boolean) => void;
}

export function AlertCard({ 
  commodityName,
  type,
  threshold,
  isActive,
  onDelete,
  approachingTrigger = false,
  progressToTrigger = 0,
  emailNotifications = false,
  onToggleEmailNotifications
}: AlertCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatThreshold = (value: number): string => {
    return typeof value === 'number' ? value.toFixed(2) : '0.00';
  };

  return (
    <>
      <Card className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={cn(
                "mt-1 h-8 w-8 rounded-lg flex items-center justify-center",
                isActive ? "bg-teal-50" : "bg-neutral-50"
              )}>
                <Bell className={cn(
                  "h-4 w-4",
                  isActive ? "text-teal-600" : "text-neutral-500"
                )} />
              </div>
              <div>
                <h3 className="font-medium">{commodityName}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Alert when price goes {type === "price_above" ? "above" : "below"} €{formatThreshold(threshold)}
                </p>
                <div className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full mt-2",
                  isActive 
                    ? "bg-teal-50 text-teal-700" 
                    : "bg-neutral-100 text-neutral-700"
                )}>
                  {isActive ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-500 hover:text-red-600"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar (if approaching trigger) */}
          {approachingTrigger && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-600 font-medium">Approaching trigger</span>
                <span className="text-muted-foreground">{progressToTrigger}%</span>
              </div>
              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(Math.max(progressToTrigger, 0), 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Email Notifications Toggle */}
          {onToggleEmailNotifications && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">Email Notifications</span>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={onToggleEmailNotifications}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Alert</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this alert? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}