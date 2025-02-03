import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Plot from "react-plotly.js";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VariableData {
  category: string;
  percentage: number;
  change: number;
  color: string;
}

const variableData: VariableData[] = [
  { 
    category: "Economic Data", 
    percentage: 40, 
    change: 5.2,
    color: "rgba(13, 148, 136, 0.9)" // teal-600 with opacity
  },
  { 
    category: "Climate Data", 
    percentage: 25, 
    change: -2.1,
    color: "rgba(13, 148, 136, 0.75)" // teal-600 with lower opacity
  },
  { 
    category: "Commodity Specific", 
    percentage: 15, 
    change: 1.8,
    color: "rgba(13, 148, 136, 0.6)" // teal-600 with even lower opacity
  },
  { 
    category: "Technical Indicators", 
    percentage: 10, 
    change: 0.5,
    color: "rgba(13, 148, 136, 0.45)" // teal-600 with lower opacity
  },
  { 
    category: "Geopolitical Data", 
    percentage: 10, 
    change: -1.2,
    color: "rgba(13, 148, 136, 0.3)" // teal-600 with lowest opacity
  }
];

export function VariableDistributionChart() {
  return (
    <div className="space-y-4">
      {/* Header with Info Button */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-neutral-900">Variable Distribution</div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Understanding Variable Distribution</DialogTitle>
              <DialogDescription>
                How our model analyzes different data sources
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <h4 className="font-medium mb-2">Data Sources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Economic Data:</strong> Market indicators, currency rates, trade volumes</li>
                  <li><strong>Climate Data:</strong> Weather patterns, seasonal trends, climate forecasts</li>
                  <li><strong>Commodity Specific:</strong> Production data, storage levels, quality metrics</li>
                  <li><strong>Technical Indicators:</strong> Price patterns, momentum indicators, volatility metrics</li>
                  <li><strong>Geopolitical Data:</strong> Trade policies, political events, global relations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Percentage Changes</h4>
                <p className="text-sm text-muted-foreground">
                  Changes show how the importance of each variable category has shifted compared to the selected time horizon, helping you understand evolving market dynamics.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Chart and Changes Grid */}
      <div className="grid grid-cols-[1fr_auto] gap-4">
        {/* Bar Chart */}
        <div className="h-[200px]">
          <Plot
            data={[
              {
                type: "bar",
                x: variableData.map(d => d.percentage),
                y: variableData.map(d => d.category),
                orientation: "h",
                marker: {
                  color: variableData.map(d => d.color),
                  line: {
                    color: "white",
                    width: 1
                  }
                },
                text: variableData.map(d => d.percentage + "%"),
                textposition: "auto",
                textfont: {
                  color: "white",
                  size: 12,
                  family: "Inter var, sans-serif"
                },
                hovertemplate: "%{y}: %{x}%<extra></extra>",
              },
            ]}
            layout={{
              paper_bgcolor: "rgba(0,0,0,0)",
              plot_bgcolor: "rgba(0,0,0,0)",
              font: {
                family: "Inter var, sans-serif",
                size: 12,
              },
              margin: { t: 0, r: 0, b: 0, l: 140 },
              xaxis: {
                showgrid: true,
                gridcolor: "#f1f5f9",
                zeroline: false,
                showticklabels: false,
              },
              yaxis: {
                automargin: true,
                tickfont: {
                  color: "#374151", // text-gray-700
                }
              },
              showlegend: false,
              bargap: 0.3,
              hoverlabel: {
                bgcolor: "white",
                font: { family: "Inter var, sans-serif" },
                bordercolor: "#e5e7eb", // border-gray-200
              },
            }}
            config={{
              displayModeBar: false,
              responsive: true,
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Changes Column */}
        <div className="flex flex-col justify-center space-y-2 min-w-[100px]">
          {variableData.map((item) => (
            <div 
              key={item.category}
              className={cn(
                "px-2 py-1 rounded text-xs font-medium text-right",
                item.change > 0 ? "text-emerald-600" : "text-red-600"
              )}
            >
              {item.change > 0 ? "+" : ""}{item.change}%
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="text-xs text-muted-foreground text-right">
        Changes compared to with last 12 weeks
      </div>
    </div>
  );
}