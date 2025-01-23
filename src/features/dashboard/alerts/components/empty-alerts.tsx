import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";

export function EmptyAlerts() {
  return (
    <Card className="p-8 text-center space-y-6">
      <div className="mx-auto w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
        <Bell className="h-6 w-6 text-teal-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">No Alerts Yet</h2>
        <p className="text-muted-foreground max-w-[600px] mx-auto">
          Set up price alerts for your commodities to stay informed about important market changes. You'll receive notifications when prices cross your specified thresholds.
        </p>
      </div>
    </Card>
  );
}