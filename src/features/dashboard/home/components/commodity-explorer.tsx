import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadarChart } from "./radar-chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface CommodityExplorerProps {
  selectedCommodity: {
    name: string;
    marketCode: string;
    currentPrice: number;
    volume: {
      amount: number;
      unit: string;
      change: number;
    };
  };
}

// Mock data for recommended commodities
const recommendedCommodities = [
  {
    id: "srw-wheat",
    name: "Chicago SRW Wheat Futures",
    marketCode: "ZWW00",
    exchange: "Chicago Board of Trade",
    currentPrice: 198.25,
    volume: {
      amount: 42.8,
      unit: "K",
      change: 3.2
    },
    metrics: {
      historicalSimilarity: 78,
      nutritionalValue: 65,
      volumeConsistency: 83,
      sustainability: 88,
      priceStability: 85,
      marketActivity: 72
    },
    averagePrices: {
      week: 197.50,
      month: 196.75,
      quarter: 195.80,
      year: 194.25
    },
    macros: {
      protein: 10.5,
      carbs: 74,
      fat: 1.8
    },
    volume: {
      monthly: 38.2,
      annual: 458.4,
      unit: "K"
    },
    co2: 350,
    volatility: 15.8,
    trades: 95
  },
  {
    id: "corn-paris",
    name: "Corn/Mais Euronext Derivatives Paris",
    marketCode: "EMA",
    exchange: "Euronext Paris",
    currentPrice: 185.75,
    volume: {
      amount: 38.2,
      unit: "K",
      change: 5.8
    },
    metrics: {
      historicalSimilarity: 72,
      nutritionalValue: 70,
      volumeConsistency: 80,
      sustainability: 92,
      priceStability: 88,
      marketActivity: 68
    },
    averagePrices: {
      week: 184.50,
      month: 183.75,
      quarter: 182.80,
      year: 181.25
    },
    macros: {
      protein: 9.5,
      carbs: 78,
      fat: 1.2
    },
    volume: {
      monthly: 35.2,
      annual: 422.4,
      unit: "K"
    },
    co2: 320,
    volatility: 14.2,
    trades: 88
  }
];

// Base metrics for the selected commodity
const selectedMetrics = {
  historicalSimilarity: 85,
  nutritionalValue: 75,
  volumeConsistency: 90,
  sustainability: 70,
  priceStability: 80,
  marketActivity: 68,
  averagePrices: {
    week: 201.48,
    month: 200.75,
    quarter: 199.80,
    year: 198.25
  },
  macros: {
    protein: 11,
    carbs: 76,
    fat: 1.5
  },
  volume: {
    monthly: 46.53,
    annual: 558.36,
    unit: "K"
  },
  co2: 280,
  volatility: 12.5,
  trades: 120
};

export function CommodityExplorer({ selectedCommodity }: CommodityExplorerProps) {
  const [selectedRecommendation, setSelectedRecommendation] = useState(recommendedCommodities[0]);

  // Transform data for radar chart
  const chartData = [
    {
      metric: "Historical Similarity",
      selected: selectedMetrics.historicalSimilarity,
      recommended: selectedRecommendation.metrics.historicalSimilarity
    },
    {
      metric: "Nutritional Value",
      selected: selectedMetrics.nutritionalValue,
      recommended: selectedRecommendation.metrics.nutritionalValue
    },
    {
      metric: "Volume Consistency",
      selected: selectedMetrics.volumeConsistency,
      recommended: selectedRecommendation.metrics.volumeConsistency
    },
    {
      metric: "Sustainability",
      selected: selectedMetrics.sustainability,
      recommended: selectedRecommendation.metrics.sustainability
    },
    {
      metric: "Price Stability",
      selected: selectedMetrics.priceStability,
      recommended: selectedRecommendation.metrics.priceStability
    },
    {
      metric: "Market Activity",
      selected: selectedMetrics.marketActivity,
      recommended: selectedRecommendation.metrics.marketActivity
    }
  ];

  // Helper function to render commodity card
  const renderCommodityCard = (
    commodity: typeof selectedCommodity & { 
      metrics?: typeof selectedMetrics,
      exchange?: string 
    },
    type: "selected" | "recommended"
  ) => {
    const metrics = type === "selected" ? selectedMetrics : selectedRecommendation;
    
    return (
      <div className="space-y-6">
        {/* Title Section */}
        <div className="h-[88px]">
          <div className="text-sm font-medium text-teal-600 capitalize">{type}</div>
          <h3 className="text-lg font-semibold mt-1 line-clamp-2">{commodity.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded">
              {commodity.marketCode}
            </span>
            {type === "recommended" && commodity.exchange && (
              <span className="text-xs text-muted-foreground line-clamp-1">
                {commodity.exchange}
              </span>
            )}
          </div>
        </div>

        {/* Average Prices */}
        <div className="h-[120px]">
          <div className="text-sm font-medium text-muted-foreground mb-2">Average Price</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Week</div>
              <div className="font-medium">€{metrics.averagePrices.week.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Month</div>
              <div className="font-medium">€{metrics.averagePrices.month.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Quarter</div>
              <div className="font-medium">€{metrics.averagePrices.quarter.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Year</div>
              <div className="font-medium">€{metrics.averagePrices.year.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Macros */}
        <div className="h-[88px]">
          <div className="text-sm font-medium text-muted-foreground mb-2">Macros</div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Protein</div>
              <div className="font-medium">{metrics.macros.protein}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Carbs</div>
              <div className="font-medium">{metrics.macros.carbs}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Fat</div>
              <div className="font-medium">{metrics.macros.fat}%</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Volume and Sustainability */}
        <div className="h-[120px]">
          <div className="text-sm font-medium text-muted-foreground mb-2">Volume & Sustainability</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Monthly Volume</div>
              <div className="font-medium">{metrics.volume.monthly}{metrics.volume.unit}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Annual Output</div>
              <div className="font-medium">{metrics.volume.annual}{metrics.volume.unit}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">CO2eq/ton</div>
              <div className="font-medium">{metrics.co2}kg</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Volatility</div>
              <div className="font-medium">{metrics.volatility}%</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Trade Activity */}
        <div className="h-[64px]">
          <div className="text-sm font-medium text-muted-foreground mb-2">Trade Activity</div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Daily Trades</div>
            <div className="font-medium">{metrics.trades}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Compare your commodities with recommended alternatives</h2>
        </div>
        <Tabs 
          defaultValue="srw-wheat"
          className="w-[300px]"
          onValueChange={(value) => {
            const recommendation = recommendedCommodities.find(r => r.id === value);
            if (recommendation) setSelectedRecommendation(recommendation);
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="srw-wheat"
              className={cn(
                "data-[state=active]:bg-teal-50",
                "data-[state=active]:text-teal-900",
                "data-[state=active]:shadow-none"
              )}
            >
              Chicago SRW Wheat
            </TabsTrigger>
            <TabsTrigger 
              value="corn-paris"
              className={cn(
                "data-[state=active]:bg-teal-50",
                "data-[state=active]:text-teal-900",
                "data-[state=active]:shadow-none"
              )}
            >
              Corn / Mais EMA
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Selected Commodity */}
        <div className="lg:col-span-3">
          <Card className="p-6 h-full">
            {renderCommodityCard(selectedCommodity, "selected")}
          </Card>
        </div>

        {/* Center: Radar Chart and Key Metrics */}
        <div className="lg:col-span-6">
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Metrics Analysis</h3>
              
              {/* Radar Chart */}
              <div className="h-[300px]">
                <RadarChart data={chartData} />
              </div>

              {/* Key Metrics Table */}
              <div className="mt-6">
                <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 text-sm">
                  <div className="font-medium text-right text-muted-foreground">Selected</div>
                  <div className="font-medium text-center text-muted-foreground">Metric</div>
                  <div className="font-medium text-left text-muted-foreground">Recommended</div>
                </div>
                <div className="mt-2 space-y-2">
                  {chartData.map((metric) => (
                    <div key={metric.metric} className="grid grid-cols-[1fr_2fr_1fr] gap-4 text-sm py-1">
                      <div className="font-medium text-right">{metric.selected}</div>
                      <div className="text-center text-muted-foreground">{metric.metric}</div>
                      <div className="font-medium text-left text-teal-600">{metric.recommended}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Recommended Commodity */}
        <div className="lg:col-span-3">
          <Card className="p-6 h-full">
            {renderCommodityCard(selectedRecommendation, "recommended")}
          </Card>
        </div>
      </div>
    </div>
  );
}