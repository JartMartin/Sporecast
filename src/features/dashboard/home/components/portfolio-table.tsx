import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowRight, TrendingUp, Info, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
        name: 'Milling Wheat / Blé de Meunerie'
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

  return (
    <div className="space-y-2">
      {/* Last Update Info */}
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
        <Info className="h-3 w-3" />
        Last updated: 24-01-2025 10:30 CET
      </div>

      <div className={cn("rounded-md border bg-white", className)}>
        <Table>
          <TableHeader>
            <TableRow className="border-b-0">
              {/* Empty Column Group Header */}
              <TableHead colSpan={1} className="border-r" />
              <TableHead colSpan={2} className="text-center">
                <div className="flex items-center justify-center gap-2 py-2">
                  <BarChart2 className="h-4 w-4 text-neutral-600" />
                  <span className="text-sm font-medium text-neutral-700">
                    Current Situation
                  </span>
                </div>
              </TableHead>
              <TableHead 
                colSpan={6} 
                className="text-center border-l"
              >
                <div className="flex items-center justify-center gap-2 py-2">
                  <TrendingUp className="h-4 w-4 text-teal-600" />
                  <span className="text-sm font-medium text-teal-700">
                    Forecasted Prices
                  </span>
                </div>
              </TableHead>
              <TableHead />
            </TableRow>
            <TableRow>
              <TableHead className="w-[300px] border-r">
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
              <TableHead className="text-center border-l w-[120px]">
                Forecast Graph
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

              // Generate sparkline data points
              const sparklineData = [200, 205, 203, 208, 210, 215, 212, 218];
              const maxValue = Math.max(...sparklineData);
              const minValue = Math.min(...sparklineData);
              const range = maxValue - minValue;
              
              return (
                <TableRow
                  key={transformedItem.id}
                  className="group cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium border-r">
                    <Link 
                      to={`/dashboard/${transformedItem.symbol.toLowerCase()}`}
                      className="block"
                    >
                      {transformedItem.name}
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
                  <TableCell className="border-l px-4">
                    <Link 
                      to={`/dashboard/${transformedItem.symbol.toLowerCase()}`}
                      className="block"
                    >
                      <svg
                        width="100%"
                        height="30"
                        className="text-teal-500"
                      >
                        <path
                          d={`M 0 ${30 - ((sparklineData[0] - minValue) / range) * 25} ${sparklineData.map((value, index) => {
                            const x = (index / (sparklineData.length - 1)) * 100;
                            const y = 30 - ((value - minValue) / range) * 25;
                            return `L ${x} ${y}`;
                          }).join(' ')}`}
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
    </div>
  );
}