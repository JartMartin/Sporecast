import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  commodityName: string;
  type: "price_above" | "price_below";
  threshold: number;
  isActive: boolean;
  onDelete: () => void;
}

export function AlertCard({ commodityName, type, threshold, isActive, onDelete }: AlertCardProps) {
  return (
    <Card className="p-4">
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
              Alert when price goes {type === "price_above" ? "above" : "below"} €{threshold}
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
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}