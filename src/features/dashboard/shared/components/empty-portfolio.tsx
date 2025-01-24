import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, ArrowRight } from "lucide-react";

export function EmptyPortfolio() {
  return (
    <Card className="p-8 text-center space-y-6">
      <div className="mx-auto w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
        <Store className="h-6 w-6 text-teal-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Welcome to Sporecast!</h2>
        <p className="text-muted-foreground max-w-[600px] mx-auto">
          Start by adding commodities from the Commodity Store to begin tracking their forecasts. Our platform helps you make data-driven decisions with real-time market insights.
        </p>
      </div>
      <div className="flex justify-center">
        <Link to="/dashboard/store">
          <Button className="gap-2">
            Visit Commodity Store <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}