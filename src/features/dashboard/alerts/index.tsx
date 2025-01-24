import { Loading3D } from "@/components/ui/loading-3d";
import { Card } from "@/components/ui/card";
import { AlertCard } from "./components/alert-card";
import { EmptyAlerts } from "./components/empty-alerts";
import { useAlerts } from "@/hooks/use-alerts";
import { Loader2 } from "lucide-react";

export function AlertsPage() {
  const { alerts, loading, deleteAlert } = useAlerts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading3D />
      </div>
    );
  }

  if (alerts.length === 0) {
    return <EmptyAlerts />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Alerts</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Stay informed about important market changes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            commodityName={alert.commodity.name}
            type={alert.type}
            threshold={alert.threshold}
            isActive={alert.is_active}
            onDelete={() => deleteAlert(alert.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default AlertsPage;