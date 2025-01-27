import { useState } from "react";
import { ForecastOverview } from "./forecast-overview";
import { TrendAnalysis } from "./trend-analysis";
import { ModelPerformanceAnalysis } from "./model-performance-analysis";
import { AlertDialog } from "@/components/ui/alert-dialog";

interface WheatTimeHorizonContentProps {
  horizon: string;
  onUnsubscribe: () => void;
  onSetAlert: () => void;
}

export function WheatTimeHorizonContent({ horizon, onUnsubscribe, onSetAlert }: WheatTimeHorizonContentProps) {
  // Get horizon-specific data
  const getHorizonData = () => {
    switch (horizon) {
      case "1w":
        return {
          volatilityIndex: 25,
          volatilityChange: -5,
          trendIndex: 3.5,
          trendChange: 2,
          expectedPrice: 220.50,
          currentPrice: 200.25
        };
      case "4w":
        return {
          volatilityIndex: 45,
          volatilityChange: 8,
          trendIndex: 4,
          trendChange: 15,
          expectedPrice: 235.75,
          currentPrice: 200.25
        };
      case "12w":
        return {
          volatilityIndex: 55,
          volatilityChange: 12,
          trendIndex: 4.5,
          trendChange: 20,
          expectedPrice: 245.80,
          currentPrice: 200.25
        };
      case "26w":
        return {
          volatilityIndex: 75,
          volatilityChange: 15,
          trendIndex: 5,
          trendChange: 25,
          expectedPrice: 255.90,
          currentPrice: 200.25
        };
      case "52w":
        return {
          volatilityIndex: 85,
          volatilityChange: 18,
          trendIndex: 4.8,
          trendChange: 22,
          expectedPrice: 265.75,
          currentPrice: 200.25
        };
      default:
        return {
          volatilityIndex: 0,
          volatilityChange: 0,
          trendIndex: 3,
          trendChange: 0,
          expectedPrice: 200.25,
          currentPrice: 200.25
        };
    }
  };

  const data = getHorizonData();

  return (
    <div className="space-y-6">
      {/* Forecast Overview Section */}
      <ForecastOverview
        horizon={horizon}
        volatilityIndex={data.volatilityIndex}
        volatilityChange={data.volatilityChange}
        trendIndex={data.trendIndex}
        trendChange={data.trendChange}
        expectedPrice={data.expectedPrice}
        currentPrice={data.currentPrice}
        onSetAlert={onSetAlert}
      />

      {/* Trend Analysis Section */}
      <TrendAnalysis horizon={horizon} />

      {/* Model Performance Analysis Section */}
      <ModelPerformanceAnalysis 
        horizon={horizon} 
        onUnsubscribe={onUnsubscribe}
      />
    </div>
  );
}

export default WheatTimeHorizonContent;