import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PortfolioHeaderProps {
  totalCommodities: number;
}

export function PortfolioHeader({ totalCommodities }: PortfolioHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900">My Commodities</h2>
        <p className="mt-1 text-sm text-neutral-500">
          {totalCommodities === 0 
            ? "Start building your commodity list by adding commodities"
            : `Managing ${totalCommodities} commodit${totalCommodities === 1 ? 'y' : 'ies'}`
          }
        </p>
      </div>
      <Link to="/dashboard/store">
        <Button className="gap-2 shadow-sm hover:shadow transition-all duration-200">
          <Plus className="h-4 w-4" />
          Add Commodity
        </Button>
      </Link>
    </div>
  );
}