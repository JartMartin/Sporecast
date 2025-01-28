import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ArrowRight, TrendingUp, Info } from "lucide-react";

interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  market_code: string;
  exchange: string;
  lastViewed?: string;
}

interface PortfolioTableProps {
  items: PortfolioItem[];
  className?: string;
}

type SortField = 'name' | 'price' | 'volume' | 'forecast_1w' | 'forecast_4w' | 'forecast_12w' | 'forecast_26w' | 'forecast_52w';
type SortDirection = 'asc' | 'desc';

export function PortfolioTable({ items, className }: PortfolioTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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

  // Sort function
  const sortItems = (a: PortfolioItem, b: PortfolioItem) => {
    const aTransformed = transformWheatData(a);
    const bTransformed = transformWheatData(b);

    let comparison = 0;
    switch (sortField) {
      case 'name':
        comparison = aTransformed.name.localeCompare(bTransformed.name);
        break;
      default:
        comparison = 0;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => toggleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  const sortedItems = [...items].sort(sortItems);

  // Mobile Card View
  const MobileCard = ({ item }: { item: PortfolioItem }) => {
    const transformedItem = transformWheatData(item);
    return (
      <Link 
        to={`/dashboard/${transformedItem.symbol.toLowerCase()}`}
        className="block"
      >
        <Card className="p-4 hover:shadow-md transition-shadow duration-200">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{transformedItem.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                    {transformedItem.market_code}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {transformedItem.exchange}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-neutral-400" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div className="text-sm text-muted-foreground">Current Price</div>
                <div className="font-medium">€201.48</div>
                <div className="text-xs text-emerald-600">+2.4%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Volume</div>
                <div className="font-medium">46.53K</div>
                <div className="text-xs text-emerald-600">+8%</div>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-sm text-muted-foreground mb-2">Forecast Trend</div>
              <svg width="100%" height="30" className="text-teal-500">
                <path
                  d="M0 15 L20 10 L40 20 L60 5 L80 15 L100 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
        </Card>
      </Link>
    );
  };

  // Desktop Table View
  const DesktopView = () => (
    <div className="hidden lg:block rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortButton field="name">Commodity Name</SortButton>
            </TableHead>
            <TableHead>
              <div className="text-right">
                <SortButton field="price">Price</SortButton>
              </div>
            </TableHead>
            <TableHead>
              <div className="text-right">
                <SortButton field="volume">Volume</SortButton>
              </div>
            </TableHead>
            <TableHead>
              <div className="text-center">Forecast Graph</div>
            </TableHead>
            <TableHead>
              <div className="text-right">
                <SortButton field="forecast_1w">1W</SortButton>
              </div>
            </TableHead>
            <TableHead>
              <div className="text-right">
                <SortButton field="forecast_4w">4W</SortButton>
              </div>
            </TableHead>
            <TableHead>
              <div className="text-right">
                <SortButton field="forecast_12w">12W</SortButton>
              </div>
            </TableHead>
            <TableHead>
              <div className="text-right">
                <SortButton field="forecast_26w">26W</SortButton>
              </div>
            </TableHead>
            <TableHead>
              <div className="text-right">
                <SortButton field="forecast_52w">52W</SortButton>
              </div>
            </TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => {
            const transformedItem = transformWheatData(item);
            
            // Mock forecast data
            const forecasts = {
              '1w': { price: 205.25, change: 1.87 },
              '4w': { price: 210.50, change: 4.48 },
              '12w': { price: 218.75, change: 8.57 },
              '26w': { price: 225.30, change: 11.82 },
              '52w': { price: 235.80, change: 17.03 }
            };

            return (
              <TableRow
                key={transformedItem.id}
                className="group cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">
                  <Link 
                    to={`/dashboard/${transformedItem.symbol.toLowerCase()}`}
                    className="block"
                  >
                    <div className="truncate">{transformedItem.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                        {transformedItem.market_code}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {transformedItem.exchange}
                      </span>
                    </div>
                  </Link>
                </TableCell>

                <TableCell>
                  <div className="text-right tabular-nums">
                    <div className="font-medium">€201.48</div>
                    <div className="text-xs text-emerald-600">+2.4%</div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-right tabular-nums">
                    <div>46.53K</div>
                    <div className="text-xs text-emerald-600">+8%</div>
                  </div>
                </TableCell>

                <TableCell>
                  <Link 
                    to={`/dashboard/${transformedItem.symbol.toLowerCase()}`}
                    className="block px-2"
                  >
                    <svg
                      width="100%"
                      height="30"
                      className="text-teal-500"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M 0 15 L20 10 L40 20 L60 5 L80 15 L100 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </Link>
                </TableCell>

                {/* Forecast Cells */}
                {Object.entries(forecasts).map(([period, data]) => (
                  <TableCell key={period}>
                    <div className="text-right tabular-nums">
                      <div className="font-medium">€{data.price.toFixed(2)}</div>
                      <div className={cn(
                        "text-xs font-medium",
                        data.change >= 0 ? "text-emerald-600" : "text-red-600"
                      )}>
                        {data.change >= 0 ? "+" : ""}{data.change.toFixed(2)}%
                      </div>
                    </div>
                  </TableCell>
                ))}

                <TableCell>
                  <Link 
                    to={`/dashboard/${transformedItem.symbol.toLowerCase()}`}
                    className="block"
                  >
                    <ArrowRight className="h-4 w-4 text-neutral-400 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className={cn("space-y-2", className)}>
      {/* Last Update Info */}
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
        <Info className="h-3 w-3" />
        Last updated: 24-01-2025 10:30 CET
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden space-y-4">
        {sortedItems.map((item) => (
          <MobileCard key={item.id} item={item} />
        ))}
      </div>

      {/* Desktop View */}
      <DesktopView />
    </div>
  );
}

export default PortfolioTable;