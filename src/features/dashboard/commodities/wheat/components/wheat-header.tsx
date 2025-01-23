import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface WheatHeaderProps {
  onSetAlert: () => void;
}

export function WheatHeader({ onSetAlert }: WheatHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Wheat Forecast</h1>
        <p className="text-muted-foreground">Real-time price predictions and market insights</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={onSetAlert}
      >
        <Bell className="h-4 w-4" />
        Set Alert
      </Button>
    </div>
  );
}