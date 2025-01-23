import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
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
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {items.map((item) => (
        <Link 
          key={item.id} 
          to={`/dashboard/${item.name.toLowerCase()}`}
          className="block group"
        >
          <Card className="p-5 h-full transition-all duration-200 hover:shadow-md group-hover:border-neutral-300">
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-medium text-neutral-900">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-1.5 py-0.5 bg-neutral-100 rounded">
                      {item.market_code}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {item.exchange}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-teal-50 p-2.5 transition-colors duration-200 group-hover:bg-teal-100">
                  <TrendingUp className="h-4 w-4 text-teal-600" />
                </div>
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between">
                {item.lastViewed && (
                  <span className="text-xs text-neutral-500">
                    Last viewed: {item.lastViewed}
                  </span>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto text-sm text-neutral-700 group-hover:text-neutral-900"
                >
                  View Details <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}