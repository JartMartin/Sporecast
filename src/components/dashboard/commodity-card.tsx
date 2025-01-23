import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Commodity {
  id: string;
  name: string;
  category: string;
  status: "available" | "portfolio" | "coming-soon";
  market_code: string;
  exchange: string;
}

interface CommodityCardProps {
  commodity: Commodity;
  onSelect: (commodity: Commodity) => void;
}

export function CommodityCard({ commodity, onSelect }: CommodityCardProps) {
  return (
    <Card className="flex flex-col">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="min-w-0">
            <h3 className="font-medium truncate">{commodity.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                {commodity.market_code}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {commodity.exchange}
              </span>
            </div>
          </div>
          {commodity.status === "coming-soon" && (
            <span className="flex-shrink-0 text-xs font-medium bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
              Soon
            </span>
          )}
          {commodity.status === "portfolio" && (
            <span className="flex-shrink-0 text-xs font-medium bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
              Added
            </span>
          )}
        </div>
        <Button
          className="w-full mt-auto"
          variant={commodity.status === "portfolio" ? "outline" : "default"}
          size="sm"
          disabled={commodity.status !== "available"}
          onClick={() => {
            if (commodity.status === "available") {
              onSelect(commodity);
            }
          }}
        >
          {commodity.status === "portfolio"
            ? "In Portfolio"
            : commodity.status === "coming-soon"
            ? "Coming Soon"
            : "Add to Portfolio"}
        </Button>
      </div>
    </Card>
  );
}