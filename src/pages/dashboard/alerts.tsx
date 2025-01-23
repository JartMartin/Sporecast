import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Alerts</h1>
        <p className="mt-1 text-sm text-neutral-500">Stay informed about important market changes</p>
      </div>

      <Card className="p-8 text-center space-y-6">
        <div className="mx-auto w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
          <Bell className="h-6 w-6 text-teal-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-neutral-900">No Alerts Yet</h2>
          <p className="text-sm text-neutral-500 max-w-[600px] mx-auto">
            You'll see your commodity alerts here once you add commodities to your portfolio and set up alert preferences.
          </p>
        </div>
        <div className="flex justify-center">
          <Link to="/dashboard/store">
            <Button className="gap-2 shadow-sm hover:shadow transition-all duration-200">
              Browse Commodities <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default AlertsPage;