import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TimeHorizon {
  id: string;
  label: string;
  expectedChange: number;
}

const timeHorizons: TimeHorizon[] = [
  { id: "1w", label: "1 Week", expectedChange: 2.5 },
  { id: "1m", label: "1 Month", expectedChange: 4.8 },
  { id: "1q", label: "1 Quarter", expectedChange: 8.2 },
  { id: "1y", label: "1 Year", expectedChange: -3.1 },
  { id: "1.5y", label: "1.5 Years", expectedChange: 12.4 },
];

interface WheatRadialDashboardProps {
  currentPrice: number;
}

export function WheatRadialDashboard({ currentPrice }: WheatRadialDashboardProps) {
  const [hoveredHorizon, setHoveredHorizon] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleHorizonClick = (horizonId: string) => {
    navigate(`/dashboard/wheat/horizon/${horizonId}`);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center space-y-6">
        {/* Current Price Display */}
        <div className="text-center">
          <div className="text-sm text-neutral-500 mb-1">Current Price</div>
          <div className="text-2xl font-bold text-teal-700">
            €{currentPrice.toFixed(2)}
          </div>
        </div>

        {/* Time Horizons */}
        <div className="flex justify-center items-center gap-4 w-full">
          {timeHorizons.map((horizon) => {
            const isHovered = hoveredHorizon === horizon.id;
            const isPositive = horizon.expectedChange > 0;

            return (
              <TooltipProvider key={horizon.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        "w-24 h-24 transition-all duration-200",
                        isHovered && "scale-105"
                      )}
                      onClick={() => handleHorizonClick(horizon.id)}
                      onMouseEnter={() => setHoveredHorizon(horizon.id)}
                      onMouseLeave={() => setHoveredHorizon(null)}
                    >
                      <div 
                        className={cn(
                          "w-full h-full rounded-full border-2 flex items-center justify-center",
                          "transition-all duration-200",
                          isHovered
                            ? "bg-teal-50 border-teal-200 shadow-md"
                            : "bg-white border-neutral-200",
                        )}
                      >
                        <div className="text-center">
                          <div className="text-sm font-medium mb-1">{horizon.label}</div>
                          <div className={cn(
                            "text-xs flex items-center justify-center gap-0.5",
                            isPositive ? "text-emerald-600" : "text-red-600"
                          )}>
                            {isPositive ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {Math.abs(horizon.expectedChange)}%
                          </div>
                        </div>
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <div className="font-medium">{horizon.label} Forecast</div>
                      <div className="text-neutral-500">
                        Expected {isPositive ? "increase" : "decrease"} of {Math.abs(horizon.expectedChange)}%
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
    </Card>
  );
}