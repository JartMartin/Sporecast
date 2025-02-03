import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Database, Clock, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  className?: string;
}

function StatCard({ icon, title, value, subtitle, className }: StatCardProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="text-2xl font-bold text-teal-700 mt-0.5">{value}</div>
        {subtitle && (
          <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>
        )}
      </div>
    </div>
  );
}

export function ModelInfoCard() {
  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Machine Learning Model Overview</h2>
          <p className="text-sm text-muted-foreground">
            How we utilize data to drive accurate predictions
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-8">
          {/* Key Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<Database className="h-5 w-5 text-teal-600" />}
              title="Variables Analyzed"
              value="132,000+"
              subtitle="Updated daily"
            />
            <StatCard
              icon={<Brain className="h-5 w-5 text-teal-600" />}
              title="Historical Data"
              value="20+ Years"
              subtitle="Market data coverage"
            />
            <StatCard
              icon={<Clock className="h-5 w-5 text-teal-600" />}
              title="Model Updates"
              value="Daily"
              subtitle="8:00 AM CET"
            />
          </div>

          {/* Feature Distribution */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Feature Distribution</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Info className="h-4 w-4" />
                    More Info
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Understanding Feature Distribution</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Our model analyzes various types of data to make predictions. The distribution shows how different data categories influence the model's decisions.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Data Categories</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-teal-600" />
                          <span>Economic Data: Market indicators, trade volumes, currency rates</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-teal-500" />
                          <span>Climate Data: Weather patterns, seasonal trends</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-teal-400" />
                          <span>Commodity-Specific: Production data, storage levels</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-teal-300" />
                          <span>Technical Indicators: Price patterns, momentum</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Feature Distribution Chart */}
            <div className="space-y-3">
              {[
                { name: "Economic Data", value: 40, change: +2.5 },
                { name: "Climate Data", value: 25, change: -1.2 },
                { name: "Commodity-Specific", value: 20, change: +0.8 },
                { name: "Technical Indicators", value: 15, change: -0.4 },
              ].map((feature, index) => (
                <div key={feature.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{feature.name}</span>
                    <span className="font-medium">{feature.value}%</span>
                  </div>
                  <div className="relative h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-full",
                        "bg-gradient-to-r from-teal-600 to-teal-400"
                      )}
                      style={{ width: `${feature.value}%` }}
                    />
                  </div>
                  <div className="text-xs">
                    <span className={cn(
                      "font-medium",
                      feature.change > 0 ? "text-emerald-600" : "text-red-600"
                    )}>
                      {feature.change > 0 ? "+" : ""}{feature.change}%
                    </span>
                    <span className="text-muted-foreground ml-1">vs last week</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Update Schedule */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-teal-600" />
              Daily Update Schedule
            </div>
            <p className="text-sm text-muted-foreground">
              New predictions are generated every day at 8:00 AM CET based on the latest market conditions and overnight developments. Model retraining occurs weekly to incorporate new patterns and optimize feature selection.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}