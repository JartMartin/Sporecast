import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CommodityCard } from "./commodity-card";
import { RadarChart } from "./radar-chart";

// Mock data for wheat
const wheatData = {
  name: "Milling Wheat / Blé de Meunerie",
  currentPrice: 201.48,
  weekChange: 2.4,
  prices: {
    week: { price: 201.48, change: 2.4 },
    month: { price: 200.75, change: -1.2 },
    quarter: { price: 199.80, change: 0.8 },
    year: { price: 198.25, change: -4.5 }
  },
  volume: {
    weekly: { amount: 46.53, unit: "K tons", change: -3.5 },
    daily: { trades: 120, change: 4.8 }
  },
  volatility: {
    current: 12.5,
    change: 2.3,
    benchmark: 10.2
  },
  nutrition: {
    protein: 11,
    carbs: 76,
    fat: 1.5
  },
  sustainability: {
    co2: 280,
    annualOutput: { amount: 558.36, unit: "K tons" }
  }
};

// Mock data for maize
const maizeData = {
  name: "Maize / Corn",
  currentPrice: 185.75,
  weekChange: 1.8,
  prices: {
    week: { price: 185.75, change: 1.8 },
    month: { price: 184.00, change: -0.6 },
    quarter: { price: 182.50, change: 1.2 },
    year: { price: 180.00, change: -3.5 }
  },
  volume: {
    weekly: { amount: 38.2, unit: "K tons", change: -2.2 },
    daily: { trades: 95, change: 3.1 }
  },
  volatility: {
    current: 15.8,
    change: 4.1,
    benchmark: 12.0
  },
  nutrition: {
    protein: 9.8,
    carbs: 72,
    fat: 2.0
  },
  sustainability: {
    co2: 350,
    annualOutput: { amount: 458.4, unit: "K tons" }
  }
};

// Mock data for Chicago SRW Wheat
const chicagoWheatData = {
  name: "Chicago SRW Wheat Futures",
  currentPrice: 198.25,
  weekChange: 1.5,
  prices: {
    week: { price: 198.25, change: 1.5 },
    month: { price: 197.50, change: -0.8 },
    quarter: { price: 196.75, change: 0.5 },
    year: { price: 195.00, change: -3.8 }
  },
  volume: {
    weekly: { amount: 42.8, unit: "K tons", change: -1.8 },
    daily: { trades: 110, change: 2.5 }
  },
  volatility: {
    current: 13.2,
    change: 1.8,
    benchmark: 11.5
  },
  nutrition: {
    protein: 10.5,
    carbs: 74,
    fat: 1.8
  },
  sustainability: {
    co2: 320,
    annualOutput: { amount: 502.4, unit: "K tons" }
  }
};

const recommendedOptions = [
  { id: "chicago-wheat", name: "Chicago SRW Wheat", data: chicagoWheatData },
  { id: "maize", name: "Corn / Mais EMA", data: maizeData }
];

export function CommodityExplorer() {
  const [selectedOption, setSelectedOption] = useState(recommendedOptions[0]);

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Compare your commodities with recommended alternatives</h2>
        <Tabs 
          defaultValue={selectedOption.id}
          className="w-[300px]"
          onValueChange={(value) => {
            const option = recommendedOptions.find(opt => opt.id === value);
            if (option) setSelectedOption(option);
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            {recommendedOptions.map((option) => (
              <TabsTrigger 
                key={option.id}
                value={option.id}
                className={cn(
                  "data-[state=active]:bg-teal-50",
                  "data-[state=active]:text-teal-900",
                  "data-[state=active]:shadow-none"
                )}
              >
                {option.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected Commodity */}
        <CommodityCard data={wheatData} />

        {/* Recommended Commodity */}
        <CommodityCard data={selectedOption.data} />
      </div>
    </div>
  );
}