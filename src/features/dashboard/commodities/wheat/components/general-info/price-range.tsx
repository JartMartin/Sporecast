import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PriceRangeProps {
  type: "historical" | "forecasted";
  timeframe: string;
  range: {
    low: number;
    high: number;
    current: number;
  };
}

export function PriceRange({ type, timeframe, range }: PriceRangeProps) {
  const isHistorical = type === "historical";
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">{timeframe} {isHistorical ? "Historical" : "Forecasted"} Range</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isHistorical ? "Historical price movement" : "Expected price movement"}
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2">
              <Info className="h-4 w-4" />
              More Info
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Understanding {isHistorical ? "Historical" : "Forecasted"} Range
              </DialogTitle>
              <DialogDescription>
                {isHistorical 
                  ? "The historical range shows actual price movements over the selected time period"
                  : "Our AI model's price predictions for the selected time period"
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                {isHistorical ? "This range helps you understand:" : "The forecasted range includes:"}
              </p>
              <ul className="space-y-2 text-sm">
                {isHistorical ? (
                  <>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      Price volatility and trends
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      Support and resistance levels
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      Market behavior patterns
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      Expected price range
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      Confidence intervals
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      Market trend indicators
                    </li>
                  </>
                )}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative pt-6 pb-6"> {/* Added padding to ensure dot glow doesn't get cut off */}
        {/* Track */}
        <div className="h-1.5 bg-neutral-100 rounded-full" />
        
        {/* Progress Bar */}
        <div 
          className="absolute top-6 h-1.5 bg-teal-600/90 rounded-full"
          style={{ 
            width: `${((range.current - range.low) / (range.high - range.low)) * 100}%`,
            left: "0%" 
          }} 
        />
        
        {/* Dot */}
        <div
          className="absolute top-6 -mt-[5px] w-4 h-4 -translate-x-1/2 transition-all duration-200"
          style={{ 
            left: `${((range.current - range.low) / (range.high - range.low)) * 100}%` 
          }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-teal-400/20 rounded-full animate-pulse" />
          
          {/* Dot with border */}
          <div className="absolute inset-0 bg-teal-600 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)]" />
        </div>
        
        {/* Labels */}
        <div className="flex justify-between text-xs text-muted-foreground mt-4">
          <span>€{range.low.toFixed(2)}</span>
          <span>Current: €{range.current.toFixed(2)}</span>
          <span>€{range.high.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}