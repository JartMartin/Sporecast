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
import { cn } from "@/lib/utils";

interface ModelPerformanceAnalysisProps {
  horizon: string;
}

export function ModelPerformanceAnalysis({ horizon }: ModelPerformanceAnalysisProps) {
  // Get performance metrics
  const hitrateMetrics = { hitrate: 92, accuracy: 95 };
  const accuracyMetrics = { hitrate: 89, accuracy: 91 };

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
                    Percentage of actual prices within confidence intervals last 2 years of running the model
                  </p>
                </div>
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

            <div className="flex flex-col items-center">
              <div className="relative">
                <RadialProgress
                  value={hitrateMetrics.hitrate}
                  className="w-64 h-32"
                  indicatorColor="stroke-teal-600"
                  trackColor="stroke-teal-100"
                />
                <div className="absolute top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
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
                    Model prediction accuracy for the selected period last 2 years of running the model
                  </p>
                </div>
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

            <div className="flex flex-col items-center">
              <div className="relative">
                <RadialProgress
                  value={accuracyMetrics.accuracy}
                  className="w-64 h-32"
                  indicatorColor="stroke-emerald-600"
                  trackColor="stroke-emerald-100"
                />
                <div className="absolute top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
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
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ModelPerformanceAnalysis;