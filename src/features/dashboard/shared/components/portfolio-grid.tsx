import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { TrendingUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  market_code: string;
  exchange: string;
  lastViewed?: string;
}

interface PortfolioGridProps {
  items: PortfolioItem[];
  className?: string;
}

export function PortfolioGrid({ items, className }: PortfolioGridProps) {
  // Helper function to transform commodity data for Wheat
  const transformWheatData = (item: PortfolioItem) => {
    if (item.symbol === 'WHEAT') {
      return {
        ...item,
        name: 'Milling Wheat / Blé de Meunerie',
        market_code: 'EBM',
        exchange: 'Euronext'
      };
    }
    return item;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item) => {
        const transformedItem = transformWheatData(item);
        return (
          <Link 
            key={transformedItem.id} 
            to={`/dashboard/${transformedItem.name.toLowerCase()}`}
            className="block group"
          >
            <Card className="transition-all duration-200 hover:shadow-md group-hover:border-neutral-300">
              <div className="flex items-center p-5">
                {/* Left Section: Name and Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-neutral-900 truncate">
                    {transformedItem.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-1.5 py-0.5 bg-neutral-100 rounded">
                      {transformedItem.market_code}
                    </span>
                    <span className="text-xs text-neutral-500 truncate">
                      {transformedItem.exchange}
                    </span>
                  </div>
                </div>

                {/* Middle Section: Price and Volume */}
                <div className="flex items-center gap-8 mx-8">
                  {/* Current Price */}
                  <div className="text-right">
                    <div className="text-sm font-medium text-neutral-900">€201.48</div>
                    <div className="text-xs font-medium text-emerald-600">+2.4%</div>
                  </div>

                  {/* Volume */}
                  <div className="text-right">
                    <div className="text-sm font-medium text-neutral-900">12.3M tons</div>
                    <div className="text-xs font-medium text-emerald-600">+8%</div>
                  </div>
                </div>

                {/* Right Section: Icon and Arrow */}
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-teal-50 p-2.5 transition-colors duration-200 group-hover:bg-teal-100">
                    <TrendingUp className="h-4 w-4 text-teal-600" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-400 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>

              {transformedItem.lastViewed && (
                <div className="px-5 pb-4 text-xs text-neutral-500">
                  Last viewed: {transformedItem.lastViewed}
                </div>
              )}
            </Card>
          </Link>
        );
      })}
    </div>
  );
}