import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadialProgress } from "@/components/ui/radial-progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ModelPerformanceAnalysisProps {
  horizon: string;
  onUnsubscribe: () => void;
}

type ComparisonPeriod = "last_quarter" | "last_year_quarter" | "five_year_avg";

interface PerformanceMetrics {
  hitrate: number;
  accuracy: number;
}

const periodOptions = [
  { value: "last_quarter", label: "Last Quarter" },
  { value: "last_year_quarter", label: "Last Quarter of Last Year" },
  { value: "five_year_avg", label: "Average Last 5 Years" },
] as const;

export function ModelPerformanceAnalysis({ horizon, onUnsubscribe }: ModelPerformanceAnalysisProps) {
  const [hitrateSelectedPeriod, setHitrateSelectedPeriod] = useState<ComparisonPeriod>("last_quarter");
  const [accuracySelectedPeriod, setAccuracySelectedPeriod] = useState<ComparisonPeriod>("last_quarter");

  // Get performance metrics for the selected period
  const getPerformanceMetrics = (period: ComparisonPeriod): PerformanceMetrics => {
    switch (period) {
      case "last_quarter":
        return { hitrate: 92, accuracy: 95 };
      case "last_year_quarter":
        return { hitrate: 89, accuracy: 91 };
      case "five_year_avg":
        return { hitrate: 85, accuracy: 88 };
      default:
        return { hitrate: 90, accuracy: 92 };
    }
  };

  const hitrateMetrics = getPerformanceMetrics(hitrateSelectedPeriod);
  const accuracyMetrics = getPerformanceMetrics(accuracySelectedPeriod);

  // Helper function to get color based on value
  const getMetricColor = (value: number) => {
    if (value >= 90) return "text-emerald-600";
    if (value >= 80) return "text-teal-600";
    if (value >= 70) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Model Performance Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Assessing the reliability of historical predictions and model confidence over time
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hitrate Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium">Hitrate Confidence Interval</h3>
                  <p className="text-xs text-muted-foreground">
                    Percentage of actual prices within confidence intervals
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={hitrateSelectedPeriod}
                    onValueChange={(value) => setHitrateSelectedPeriod(value as ComparisonPeriod)}
                  >
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periodOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        More Info
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Understanding Hitrate</DialogTitle>
                        <DialogDescription>
                          The hitrate measures how often actual prices fall within our predicted confidence intervals
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 pt-4">
                        <div>
                          <h4 className="font-medium mb-2">What is Hitrate?</h4>
                          <p className="text-sm text-muted-foreground">
                            The hitrate represents the percentage of time that actual market prices fell within our model's predicted confidence intervals. A higher hitrate indicates more accurate predictions.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Interpretation</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• 90%+ : Exceptional accuracy</li>
                            <li>• 80-90%: Strong performance</li>
                            <li>• 70-80%: Good performance</li>
                            <li>• Below 70%: Requires attention</li>
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <RadialProgress
                value={hitrateMetrics.hitrate}
                className="w-64 h-32"
                indicatorColor="stroke-teal-600"
                trackColor="stroke-teal-100"
              >
                <div className="text-center">
                  <span className={cn(
                    "text-4xl font-bold",
                    getMetricColor(hitrateMetrics.hitrate)
                  )}>
                    {hitrateMetrics.hitrate}%
                  </span>
                  <span className="text-sm text-muted-foreground block mt-1">
                    Hitrate
                  </span>
                </div>
              </RadialProgress>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {hitrateMetrics.hitrate >= 90 ? "Exceptional" :
                   hitrateMetrics.hitrate >= 80 ? "Strong" :
                   hitrateMetrics.hitrate >= 70 ? "Good" : "Needs Improvement"}
                </p>
              </div>
            </div>
          </div>

          {/* Accuracy Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium">Mean Absolute Error / Accuracy</h3>
                  <p className="text-xs text-muted-foreground">
                    Model prediction accuracy for the selected period
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={accuracySelectedPeriod}
                    onValueChange={(value) => setAccuracySelectedPeriod(value as ComparisonPeriod)}
                  >
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periodOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        More Info
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Understanding Model Accuracy</DialogTitle>
                        <DialogDescription>
                          How we measure the accuracy of our price predictions
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 pt-4">
                        <div>
                          <h4 className="font-medium mb-2">Accuracy Calculation</h4>
                          <p className="text-sm text-muted-foreground">
                            Our accuracy metric combines both the precision of point predictions and the reliability of confidence intervals to give you a comprehensive view of model performance.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Interpretation</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• 95%+ : Exceptional accuracy</li>
                            <li>• 90-95%: High accuracy</li>
                            <li>• 85-90%: Good accuracy</li>
                            <li>• Below 85%: Moderate accuracy</li>
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <RadialProgress
                value={accuracyMetrics.accuracy}
                className="w-64 h-32"
                indicatorColor="stroke-emerald-600"
                trackColor="stroke-emerald-100"
              >
                <div className="text-center">
                  <span className={cn(
                    "text-4xl font-bold",
                    getMetricColor(accuracyMetrics.accuracy)
                  )}>
                    {accuracyMetrics.accuracy}%
                  </span>
                  <span className="text-sm text-muted-foreground block mt-1">
                    Accuracy
                  </span>
                </div>
              </RadialProgress>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {accuracyMetrics.accuracy >= 95 ? "Exceptional" :
                   accuracyMetrics.accuracy >= 90 ? "High" :
                   accuracyMetrics.accuracy >= 85 ? "Good" : "Moderate"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Unsubscribe Button */}
        <div className="flex justify-center mt-8 pt-8 border-t">
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground hover:text-destructive"
            onClick={onUnsubscribe}
          >
            Want to unsubscribe from this commodity?
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default ModelPerformanceAnalysis;