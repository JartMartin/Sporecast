import { Card } from "@/components/ui/card";
import { Brain, Clock } from "lucide-react";
import { VariableDistributionChart } from "./variable-distribution-chart";

export function ModelInfoCard() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Machine Learning Model Information
        </span>
      </div>

      <div className="space-y-6">
        {/* Model Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4 bg-teal-50/50 border-teal-100">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <Brain className="h-4 w-4 text-teal-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-teal-600">Variables Analyzed</div>
                <div className="text-2xl font-bold text-teal-700">130,000+</div>
                <div className="text-xs text-teal-600 mt-1">Daily updated</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-teal-50/50 border-teal-100">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-teal-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-teal-600">Historical Data</div>
                <div className="text-2xl font-bold text-teal-700">21+ Years</div>
                <div className="text-xs text-teal-600 mt-1">Of market data</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Variable Distribution */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Variable Distribution</h3>
          <VariableDistributionChart />
        </div>

        {/* Update Schedule */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
            <Clock className="h-4 w-4 text-teal-600" />
            Daily Update Schedule
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            New predictions are generated every day at 8:00 AM CET based on the latest market conditions and overnight developments.
          </p>
        </div>
      </div>
    </Card>
  );
}