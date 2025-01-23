import { ForecastLine } from "@/components/ui/forecast-line";
import { cn } from "@/lib/utils";
import { BarChart2 } from "lucide-react";

interface MarketForecastProps {
  isVisible: boolean;
}

export function MarketForecast({ isVisible }: MarketForecastProps) {
  return (
    <div className={cn(
      "relative transition-all duration-1000 delay-700",
      isVisible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
    )}>
      {/* Container for overlapping cards */}
      <div className="relative">
        {/* Analytics Card (Top Layer) */}
        <div className="absolute top-[calc(95%-20px)] -right-4 z-10 group">
          <div className="relative flex w-[200px] rounded-xl bg-white border shadow-sm p-2.5 transition-all duration-300 group-hover:shadow-md group-hover:border-neutral-300">
            <div className="relative flex-1">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-teal-50">
                    <BarChart2 className="h-3 w-3 text-teal-600" />
                  </div>
                  <h3 className="text-[10px] font-medium text-neutral-900">Analytics</h3>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-teal-50 px-1.5 py-0.5 text-[8px] font-medium text-teal-600">
                  <span className="h-1 w-1 rounded-full bg-teal-500" />
                  Live
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-neutral-50 p-1.5">
                  <p className="text-[8px] font-medium text-neutral-500">Forecast prediction 6M</p>
                  <p className="text-xs font-semibold text-neutral-900">245.75</p>
                  <span className="text-[8px] font-medium text-teal-600">+12.3%</span>
                </div>
                <div className="rounded-lg bg-neutral-50 p-1.5">
                  <p className="text-[8px] font-medium text-neutral-500">Confidence interval Hitrate</p>
                  <p className="text-xs font-semibold text-neutral-900">97%</p>
                  <span className="text-[8px] font-medium text-teal-600">+8.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Card (Base Layer) */}
        <div className="relative bg-white rounded-2xl shadow-xl p-5 border mt-16">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-neutral-900">Daily food commodity forecasting</h3>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                  <span className="text-xs text-teal-600 font-medium">Live</span>
                </div>
              </div>
              <p className="text-xs text-neutral-500">
                Our state-of-the-art neural networks continuously adapting to the newest market conditions
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-[250px] w-full">
                <ForecastLine />
              </div>
              
              <div className="flex items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-8 bg-teal-600" />
                  <span className="text-xs text-neutral-500">Historical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-8 border-0" style={{ 
                    backgroundImage: 'repeating-linear-gradient(to right, #14b8a6 0%, #14b8a6 33%, transparent 33%, transparent 66%)',
                  }} />
                  <span className="text-xs text-neutral-500">Forecast</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}