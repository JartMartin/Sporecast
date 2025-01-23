import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendAnalysisChart } from "./trend-analysis-chart";
import { FutureTrendAnalysisChart } from "./future-trend-analysis-chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TrendAnalysisProps {
  horizon: string;
}

export function TrendAnalysis({ horizon }: TrendAnalysisProps) {
  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Trend Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Historical and future price trend comparison for {horizon} horizon
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical Trend Analysis */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold">Historical Trend Analysis</h3>
                <p className="text-sm text-muted-foreground">Last quarter price comparison</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    More Info
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Historical Trend Analysis</DialogTitle>
                    <DialogDescription>
                      Understanding historical price patterns and market behavior
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 pt-4">
                    <div>
                      <h4 className="font-medium mb-2">Last Quarter</h4>
                      <p className="text-sm text-muted-foreground">
                        Shows the actual price movements over the past three months, providing a clear view of recent market behavior.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Same Quarter Last Year</h4>
                      <p className="text-sm text-muted-foreground">
                        Compares current prices with the same period last year to identify seasonal patterns and year-over-year changes.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">5-Year Average</h4>
                      <p className="text-sm text-muted-foreground">
                        Shows the average price trend for this quarter over the past five years, helping identify long-term patterns and anomalies.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Historical Chart */}
            <TrendAnalysisChart />
          </div>
        </Card>

        {/* Future Trend Analysis */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold">Future Trend Analysis</h3>
                <p className="text-sm text-muted-foreground">Next quarter price projection</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    More Info
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Future Trend Analysis</DialogTitle>
                    <DialogDescription>
                      Understanding projected price trends and market forecasts
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 pt-4">
                    <div>
                      <h4 className="font-medium mb-2">Expected Trend</h4>
                      <p className="text-sm text-muted-foreground">
                        Our AI-powered forecast for the next three months, based on current market conditions, historical patterns, and predictive modeling.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Last Year Trend</h4>
                      <p className="text-sm text-muted-foreground">
                        Shows how prices moved during this period last year, providing context for seasonal patterns and cyclical behavior.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">5-Year Average</h4>
                      <p className="text-sm text-muted-foreground">
                        The historical average trend for this period over the past five years, helping identify typical market behavior.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Future Chart */}
            <FutureTrendAnalysisChart />
          </div>
        </Card>
      </div>
    </div>
  );
}